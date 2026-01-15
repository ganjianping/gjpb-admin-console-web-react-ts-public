import React, { useMemo, useState } from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Button,
	FormControl,
	Select,
	MenuItem,
	Box,
	Typography,
	FormControlLabel,
	Switch,
	OutlinedInput,
	Chip,
	LinearProgress,
	Backdrop,
	CircularProgress,
	TextareaAutosize,
	FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { VideoRuFormData } from '../types/videoRu.types';
import { LANGUAGE_OPTIONS } from '../constants';
import { videoRuService } from '../services/videoRuService';

interface VideoRuCreateDialogProps {
	open: boolean;
	onClose: () => void;
	formData: VideoRuFormData;
	onFormChange: (field: keyof VideoRuFormData, value: any) => void;
		// onSubmit not used here; submit handled internally
	loading?: boolean;
	formErrors?: Record<string, string[] | string>;
	onReset?: () => void;
	onCreated?: () => Promise<void> | void;
}

const VideoRuCreateDialog = ({
	open,
	onClose,
	formData,
	onFormChange,
	loading,
	formErrors = {},
	onReset,
	onCreated,
}: VideoRuCreateDialogProps) => {
	const { t, i18n } = useTranslation();
	const [localSaving, setLocalSaving] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const availableTags = useMemo(() => {
		try {
			const settings = localStorage.getItem('gjpb_app_settings');
			if (!settings) return [] as string[];
			const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
			const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
			const videoRuTagsSetting = appSettings.find((s) => s.name === 'video_ru_tags' && s.lang === currentLang);
			if (!videoRuTagsSetting) return [] as string[];
			return videoRuTagsSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
		} catch (err) {
			console.error('[VideoRuCreateDialog] Error loading tags:', err);
			return [] as string[];
		}
	}, [i18n.language]);

	const availableLangOptions = useMemo(() => {
		try {
			const settings = localStorage.getItem('gjpb_app_settings');
			if (!settings) return LANGUAGE_OPTIONS;
			const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
			const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
			const langSetting = appSettings.find((s) => s.name === 'lang' && s.lang === currentLang) || appSettings.find((s) => s.name === 'lang');
			if (!langSetting) return LANGUAGE_OPTIONS;
			return langSetting.value.split(',').map((item) => {
				const [code, label] = item.split(':').map((s) => s.trim());
				if (label) return { value: code, label };
				const fallback = LANGUAGE_OPTIONS.find((o) => o.value === code);
				return { value: code, label: fallback ? fallback.label : code };
			});
		} catch (err) {
			console.error('[VideoRuCreateDialog] Error loading lang options:', err);
			return LANGUAGE_OPTIONS;
		}
	}, [i18n.language]);

		const getFieldError = (field: string) => {
			const err = formErrors[field];
			if (Array.isArray(err)) return err.join(', ');
			return typeof err === 'string' ? err : '';
		};

	// handlers
	const handleTagsChange = (e: any) => {
		const value = e.target.value as string[];
		onFormChange('tags', value.join(','));
	};

	const handleLangChange = (e: any) => {
		onFormChange('lang', e.target.value);
	};

	const handleFileChange = (field: keyof VideoRuFormData, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onFormChange(field, file);
		if (file) {
			if (field === 'file' && !formData.filename) {
				onFormChange('filename', file.name);
			}
			if (field === 'coverImageFile' && !formData.coverImageFilename) {
				onFormChange('coverImageFilename', file.name);
			}
			if (field === 'imageFile' && !formData.imageFilename) {
				onFormChange('imageFilename', file.name);
			}
			if (field === 'phoneticAudioFile' && !formData.phoneticAudioFilename) {
				onFormChange('phoneticAudioFilename', file.name);
			}
		}
	};

		const handleSubmit = async () => {
		setErrorMsg(null);
		setLocalSaving(true);
		try {
			// build request expected by createVideoRuByUpload
				if (!formData.file) throw new Error('No videoRu file selected');
				const file = formData.file;
				await videoRuService.createVideoRuByUpload({
					file,
					name: formData.name,
					filename: formData.filename,
					coverImageFilename: formData.coverImageFilename,
					coverImageFile: formData.coverImageFile || undefined,
					sourceName: (formData as any).sourceName,
					originalUrl: (formData as any).originalUrl,
					description: formData.description,
				tags: formData.tags,
				lang: formData.lang,
				displayOrder: formData.displayOrder,
				isActive: formData.isActive,
			});

			// on success: reset, let parent refresh table and then close
			if (onReset) onReset();
			if (onCreated) {
				try {
					await onCreated();
				} catch (err) {
					console.error('[VideoRuCreateDialog] onCreated callback failed', err);
				}
			}
			onClose();
		} catch (err: any) {
			setErrorMsg(err?.message || 'Failed to upload videoRu');
		} finally {
			setLocalSaving(false);
		}
	};

	return (
			<Dialog
				open={open}
				onClose={(_event, reason) => {
					if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
					onClose();
				}}
				disableEscapeKeyDown
				maxWidth="md"
				fullWidth
			>
			{(loading || localSaving) && (
				<Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
					<LinearProgress />
				</Box>
			)}
			<DialogTitle sx={{ pt: loading ? 3 : 2 }}>
				<Typography variant="h6" component="div">{t('videoRus.create') || 'Create VideoRu'}</Typography>
			</DialogTitle>
			<DialogContent sx={{ pt: 2 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
					{/* Basic Information */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Basic Information</Typography>
					<TextField label={t('videoRus.form.name') || 'Name'} value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} fullWidth error={!!getFieldError('name')} helperText={getFieldError('name')} />
					<TextField label="Phonetic" value={formData.phonetic || ''} onChange={(e) => onFormChange('phonetic', e.target.value)} fullWidth />
					<TextField label="Translation" value={formData.translation || ''} onChange={(e) => onFormChange('translation', e.target.value)} fullWidth />
					<TextField label="Definition" value={formData.definition || ''} onChange={(e) => onFormChange('definition', e.target.value)} fullWidth />
					<TextField label="Example" value={formData.example || ''} onChange={(e) => onFormChange('example', e.target.value)} fullWidth />
					<TextField label="Synonyms" value={formData.synonyms || ''} onChange={(e) => onFormChange('synonyms', e.target.value)} fullWidth />

					{/* Part of Speech */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Part of Speech</Typography>
					<FormControl fullWidth>
						<Select value={formData.partOfSpeech || ''} onChange={(e) => onFormChange('partOfSpeech', e.target.value)}>
							<MenuItem value="">Select Part of Speech</MenuItem>
							<MenuItem value="noun">Noun</MenuItem>
							<MenuItem value="verb">Verb</MenuItem>
							<MenuItem value="adjective">Adjective</MenuItem>
							<MenuItem value="adverb">Adverb</MenuItem>
							<MenuItem value="pronoun">Pronoun</MenuItem>
							<MenuItem value="preposition">Preposition</MenuItem>
							<MenuItem value="conjunction">Conjunction</MenuItem>
							<MenuItem value="interjection">Interjection</MenuItem>
						</Select>
					</FormControl>

					{/* Noun Forms */}
					{formData.partOfSpeech === 'noun' && (
						<TextField label="Plural Form" value={formData.nounPluralForm || ''} onChange={(e) => onFormChange('nounPluralForm', e.target.value)} fullWidth />
					)}

					{/* Verb Forms */}
					{formData.partOfSpeech === 'verb' && (
						<>
							<TextField label="Simple Past Tense" value={formData.verbSimplePastTense || ''} onChange={(e) => onFormChange('verbSimplePastTense', e.target.value)} fullWidth />
							<TextField label="Past Perfect Tense" value={formData.verbPastPerfectTense || ''} onChange={(e) => onFormChange('verbPastPerfectTense', e.target.value)} fullWidth />
							<TextField label="Present Participle" value={formData.verbPresentParticiple || ''} onChange={(e) => onFormChange('verbPresentParticiple', e.target.value)} fullWidth />
							<TextField label="Verb Form" value={formData.verbForm || ''} onChange={(e) => onFormChange('verbForm', e.target.value)} fullWidth />
							<TextField label="Verb Meaning" value={formData.verbMeaning || ''} onChange={(e) => onFormChange('verbMeaning', e.target.value)} fullWidth />
							<TextField label="Verb Example" value={formData.verbExample || ''} onChange={(e) => onFormChange('verbExample', e.target.value)} fullWidth multiline rows={2} />
						</>
					)}

					{/* Adjective Forms */}
					{formData.partOfSpeech === 'adjective' && (
						<>
							<TextField label="Comparative Form" value={formData.adjectiveComparativeForm || ''} onChange={(e) => onFormChange('adjectiveComparativeForm', e.target.value)} fullWidth />
							<TextField label="Superlative Form" value={formData.adjectiveSuperlativeForm || ''} onChange={(e) => onFormChange('adjectiveSuperlativeForm', e.target.value)} fullWidth />
							<TextField label="Adjective Form" value={formData.adjectiveForm || ''} onChange={(e) => onFormChange('adjectiveForm', e.target.value)} fullWidth />
							<TextField label="Adjective Meaning" value={formData.adjectiveMeaning || ''} onChange={(e) => onFormChange('adjectiveMeaning', e.target.value)} fullWidth />
							<TextField label="Adjective Example" value={formData.adjectiveExample || ''} onChange={(e) => onFormChange('adjectiveExample', e.target.value)} fullWidth multiline rows={2} />
						</>
					)}

					{/* Adverb Forms */}
					{formData.partOfSpeech === 'adverb' && (
						<>
							<TextField label="Adverb Form" value={formData.adverbForm || ''} onChange={(e) => onFormChange('adverbForm', e.target.value)} fullWidth />
							<TextField label="Adverb Meaning" value={formData.adverbMeaning || ''} onChange={(e) => onFormChange('adverbMeaning', e.target.value)} fullWidth />
							<TextField label="Adverb Example" value={formData.adverbExample || ''} onChange={(e) => onFormChange('adverbExample', e.target.value)} fullWidth multiline rows={2} />
						</>
					)}

					{/* Media Files */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Media Files</Typography>
					<Box>
						<Typography variant="subtitle2">Image File</Typography>
						<input type="file" accept="image/*" onChange={(e) => handleFileChange('imageFile', e)} />
					</Box>
					<TextField label="Image Filename" value={formData.imageFilename || ''} onChange={(e) => onFormChange('imageFilename', e.target.value)} fullWidth />
					<TextField label="Image Original URL" value={formData.imageOriginalUrl || ''} onChange={(e) => onFormChange('imageOriginalUrl', e.target.value)} fullWidth />

					<Box>
						<Typography variant="subtitle2">Phonetic Audio File</Typography>
						<input type="file" accept="audio/*" onChange={(e) => handleFileChange('phoneticAudioFile', e)} />
					</Box>
					<TextField label="Phonetic Audio Filename" value={formData.phoneticAudioFilename || ''} onChange={(e) => onFormChange('phoneticAudioFilename', e.target.value)} fullWidth />
					<TextField label="Phonetic Audio Original URL" value={formData.phoneticAudioOriginalUrl || ''} onChange={(e) => onFormChange('phoneticAudioOriginalUrl', e.target.value)} fullWidth />

					{/* URLs and References */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>URLs & References</Typography>
					<TextField label="Dictionary URL" value={formData.dictionaryUrl || ''} onChange={(e) => onFormChange('dictionaryUrl', e.target.value)} fullWidth />

					{/* Legacy VideoRu Fields */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>VideoRu Information</Typography>
					<TextField label={t('videoRus.form.sourceName') || 'Source Name'} value={(formData as any).sourceName || ''} onChange={(e) => onFormChange('sourceName' as any, e.target.value)} fullWidth />
					<TextField label={t('videoRus.form.originalUrl') || 'Original URL'} value={(formData as any).originalUrl || ''} onChange={(e) => onFormChange('originalUrl' as any, e.target.value)} fullWidth />
                    <Box>
						<Typography variant="subtitle2">{t('videoRus.form.videoRuFile') || 'VideoRu File'}</Typography>
						<input type="file" accept="videoRu/*" onChange={(e) => handleFileChange('file', e)} />
					</Box>
					<TextField label={t('videoRus.form.filename') || 'Filename'} value={formData.filename || ''} onChange={(e) => onFormChange('filename', e.target.value)} fullWidth />
					<Box>
						<Typography variant="subtitle2">{t('videoRus.form.coverImageFile') || 'Cover Image File'}</Typography>
						<input type="file" accept="image/*" onChange={(e) => handleFileChange('coverImageFile', e)} />
					</Box>
					<TextField label={t('videoRus.form.coverImageFilename') || 'Cover Image Filename'} value={formData.coverImageFilename || ''} onChange={(e) => onFormChange('coverImageFilename', e.target.value)} fullWidth />
                    <Box>
						<Typography variant="subtitle2">{t('videoRus.form.description') || 'Description'}</Typography>
						<TextareaAutosize
							minRows={3}
							style={{ width: '100%', padding: '8.5px 14px', borderRadius: 4, border: '1px solid rgba(0,0,0,0.23)', fontFamily: 'inherit' }}
							value={formData.description || ''}
							onChange={(e) => onFormChange('description', e.target.value)}
							aria-label={t('videoRus.form.description') || 'Description'}
						/>
						{getFieldError('description') && <FormHelperText error>{getFieldError('description')}</FormHelperText>}
					</Box>

					{/* Tags and Language */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Tags & Language</Typography>
					<FormControl fullWidth>
						<Select multiple value={formData.tags ? formData.tags.split(',').filter(Boolean) : []} onChange={handleTagsChange} input={<OutlinedInput />} renderValue={(selected) => (
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
								{Array.isArray(selected) && selected.map((v) => (<Chip key={v} label={v} size="small" />))}
							</Box>
						)}>
							{availableTags.length > 0 ? availableTags.map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>)) : (<MenuItem disabled>No tags</MenuItem>)}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<Select value={formData.lang || ''} onChange={handleLangChange}>
							{availableLangOptions.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
						</Select>
					</FormControl>

					{/* Settings */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Settings</Typography>
					<TextField label="Difficulty Level" value={formData.difficultyLevel || ''} onChange={(e) => onFormChange('difficultyLevel', e.target.value)} fullWidth />
					<TextField label={t('videoRus.form.displayOrder') || 'Display Order'} type="number" value={String(formData.displayOrder)} onChange={(e) => onFormChange('displayOrder', Number(e.target.value) || 0)} fullWidth />
					<FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />} label={t('videoRus.form.isActive') || 'Active'} />

					{errorMsg && <Typography color="error">{errorMsg}</Typography>}
				</Box>
			</DialogContent>
			<DialogActions>
			<Button onClick={() => { if (onReset) { onReset(); } onClose(); }} disabled={loading || localSaving}>{t('videoRus.actions.cancel') || 'Cancel'}</Button>
				<Button variant="contained" onClick={handleSubmit} disabled={loading || localSaving} startIcon={(loading || localSaving) ? <CircularProgress size={16} color="inherit" /> : undefined}>{t('videoRus.actions.save') || 'Save'}</Button>
			</DialogActions>
			<Backdrop sx={{ position: 'absolute', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0,0,0,0.6)' }} open={loading || localSaving}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, borderRadius: 2, backgroundColor: 'background.paper' }}>
					<CircularProgress size={48} />
					<Typography>{t('videoRus.messages.pleaseWait') || 'Please wait...'}</Typography>
				</Box>
			</Backdrop>
		</Dialog>
	);
};

export default VideoRuCreateDialog;
