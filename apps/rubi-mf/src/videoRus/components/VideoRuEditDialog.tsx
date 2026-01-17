
import React, { useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, FormControlLabel, Checkbox, FormControl, FormLabel, Select, MenuItem, OutlinedInput, Chip, Typography, TextareaAutosize, LinearProgress, Backdrop, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { VideoRuFormData } from '../types/videoRu.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface VideoRuEditDialogProps {
	open: boolean;
	formData: VideoRuFormData;
	onFormChange: (field: keyof VideoRuFormData, value: any) => void;
	onSubmit: (useFormData?: boolean) => Promise<void>;
	onClose: () => void;
	loading?: boolean;
	formErrors?: Record<string, string>;
}

const VideoRuEditDialog: React.FC<VideoRuEditDialogProps> = ({ open, formData, onFormChange, onSubmit, onClose, loading }) => {
	const { i18n, t } = useTranslation();
	const [localSaving, setLocalSaving] = useState(false);

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
			console.error('[VideoRuEditDialog] Error loading tags:', err);
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
			console.error('[VideoRuEditDialog] Error loading lang options:', err);
			return LANGUAGE_OPTIONS;
		}
	}, [i18n.language]);

	const handleTagsChange = (e: any) => {
		const value = e.target.value as string[];
		onFormChange('tags', value.join(','));
	};

	const handleLangChange = (e: any) => {
		onFormChange('lang', e.target.value);
	};

	const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onFormChange('coverImageFile', file);
	};

	return (
		<Dialog
			open={open}
			onClose={(_event, reason) => {
				if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
				onClose();
			}}
			disableEscapeKeyDown
			maxWidth="sm"
			fullWidth
		>
			{(loading || localSaving) && (
				<Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1200 }}>
					<LinearProgress />
				</Box>
				)}
			<DialogTitle>{t('videoRus.edit') || 'Edit VideoRu'}</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
					{/* Basic Information */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Basic Information</Typography>
					<TextField label={t('videoRus.form.name') || 'Name'} value={formData.name} onChange={e => onFormChange('name', e.target.value)} fullWidth />
					<TextField label="Phonetic" value={formData.phonetic || ''} onChange={e => onFormChange('phonetic', e.target.value)} fullWidth />
					<TextField label="Translation" value={formData.translation || ''} onChange={e => onFormChange('translation', e.target.value)} fullWidth />
					<TextField label="Definition" value={formData.definition || ''} onChange={e => onFormChange('definition', e.target.value)} fullWidth />
					<TextField label="Example" value={formData.example || ''} onChange={e => onFormChange('example', e.target.value)} fullWidth />
					<TextField label="Synonyms" value={formData.synonyms || ''} onChange={e => onFormChange('synonyms', e.target.value)} fullWidth />

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
						<TextField label="Plural Form" value={formData.nounPluralForm || ''} onChange={e => onFormChange('nounPluralForm', e.target.value)} fullWidth />
					)}

					{/* Verb Forms */}
					{formData.partOfSpeech === 'verb' && (
						<>
							<TextField label="Simple Past Tense" value={formData.verbSimplePastTense || ''} onChange={e => onFormChange('verbSimplePastTense', e.target.value)} fullWidth />
							<TextField label="Past Perfect Tense" value={formData.verbPastPerfectTense || ''} onChange={e => onFormChange('verbPastPerfectTense', e.target.value)} fullWidth />
							<TextField label="Present Participle" value={formData.verbPresentParticiple || ''} onChange={e => onFormChange('verbPresentParticiple', e.target.value)} fullWidth />
							<TextField label="Verb Form" value={formData.verbForm || ''} onChange={e => onFormChange('verbForm', e.target.value)} fullWidth />
							<TextField label="Verb Meaning" value={formData.verbMeaning || ''} onChange={e => onFormChange('verbMeaning', e.target.value)} fullWidth />
							<TextField label="Verb Example" value={formData.verbExample || ''} onChange={e => onFormChange('verbExample', e.target.value)} fullWidth multiline rows={2} />
						</>
					)}

					{/* Adjective Forms */}
					{formData.partOfSpeech === 'adjective' && (
						<>
							<TextField label="Comparative Form" value={formData.adjectiveComparativeForm || ''} onChange={e => onFormChange('adjectiveComparativeForm', e.target.value)} fullWidth />
							<TextField label="Superlative Form" value={formData.adjectiveSuperlativeForm || ''} onChange={e => onFormChange('adjectiveSuperlativeForm', e.target.value)} fullWidth />
							<TextField label="Adjective Form" value={formData.adjectiveForm || ''} onChange={e => onFormChange('adjectiveForm', e.target.value)} fullWidth />
							<TextField label="Adjective Meaning" value={formData.adjectiveMeaning || ''} onChange={e => onFormChange('adjectiveMeaning', e.target.value)} fullWidth />
							<TextField label="Adjective Example" value={formData.adjectiveExample || ''} onChange={e => onFormChange('adjectiveExample', e.target.value)} fullWidth multiline rows={2} />
						</>
					)}

					{/* Adverb Forms */}
					{formData.partOfSpeech === 'adverb' && (
						<>
							<TextField label="Adverb Form" value={formData.adverbForm || ''} onChange={e => onFormChange('adverbForm', e.target.value)} fullWidth />
							<TextField label="Adverb Meaning" value={formData.adverbMeaning || ''} onChange={e => onFormChange('adverbMeaning', e.target.value)} fullWidth />
							<TextField label="Adverb Example" value={formData.adverbExample || ''} onChange={e => onFormChange('adverbExample', e.target.value)} fullWidth multiline rows={2} />
						</>
					)}

					{/* Media Files */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Media Files</Typography>
					<Box>
						<Typography variant="subtitle2">Image File</Typography>
						<input type="file" accept="image/*" onChange={(e) => {
							const file = e.target.files?.[0] || null;
							onFormChange('imageFile', file);
						}} />
					</Box>
					<TextField label="Image Filename" value={formData.imageFilename || ''} onChange={e => onFormChange('imageFilename', e.target.value)} fullWidth />
					<TextField label="Image Original URL" value={formData.imageOriginalUrl || ''} onChange={e => onFormChange('imageOriginalUrl', e.target.value)} fullWidth />

					<Box>
						<Typography variant="subtitle2">Phonetic Audio File</Typography>
						<input type="file" accept="audio/*" onChange={(e) => {
							const file = e.target.files?.[0] || null;
							onFormChange('phoneticAudioFile', file);
						}} />
					</Box>
					<TextField label="Phonetic Audio Filename" value={formData.phoneticAudioFilename || ''} onChange={e => onFormChange('phoneticAudioFilename', e.target.value)} fullWidth />
					<TextField label="Phonetic Audio Original URL" value={formData.phoneticAudioOriginalUrl || ''} onChange={e => onFormChange('phoneticAudioOriginalUrl', e.target.value)} fullWidth />

					{/* URLs and References */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>URLs & References</Typography>
					<TextField label="Dictionary URL" value={formData.dictionaryUrl || ''} onChange={e => onFormChange('dictionaryUrl', e.target.value)} fullWidth />

					{/* Legacy VideoRu Fields */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>VideoRu Information</Typography>
					<TextField label={t('videoRus.form.sourceName') || 'Source Name'} value={(formData as any).sourceName || ''} onChange={e => onFormChange('sourceName' as any, e.target.value)} fullWidth />
					<TextField label={t('videoRus.form.originalUrl') || 'Original URL'} value={(formData as any).originalUrl || ''} onChange={e => onFormChange('originalUrl' as any, e.target.value)} fullWidth />
					<TextField label={t('videoRus.form.filename') || 'Filename'} value={formData.filename} onChange={e => onFormChange('filename' as any, e.target.value)} fullWidth />
					<Box>
						<Typography variant="subtitle2">{t('videoRus.form.coverImageFile') || 'Cover Image File'}</Typography>
						<input type="file" accept="image/*" onChange={handleCoverFileChange} />
					</Box>
					<TextField label={t('videoRus.form.coverImageFilename') || 'Cover Image Filename'} value={formData.coverImageFilename || ''} onChange={e => onFormChange('coverImageFilename' as any, e.target.value)} fullWidth />
					<Box>
						<Typography variant="subtitle2">{t('videoRus.form.description') || 'Description'}</Typography>
						<TextareaAutosize minRows={2} style={{ width: '100%', padding: '8.5px 14px', borderRadius: 4, border: '1px solid rgba(0,0,0,0.23)', fontFamily: 'inherit' }} value={formData.description || ''} onChange={e => onFormChange('description', e.target.value)} aria-label={t('videoRus.form.description') || 'Description'} />
					</Box>

					{/* Tags and Language */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Tags & Language</Typography>
					<FormControl fullWidth>
						<Select multiple value={formData.tags ? formData.tags.split(',').filter(Boolean) : []} onChange={handleTagsChange} input={<OutlinedInput />} renderValue={(selected) => (
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
								{Array.isArray(selected) && selected.map((v) => (<Chip key={v} label={v} size="small" />))}
							</Box>
						)}>
							{availableTags.length > 0 ? availableTags.map((tOpt) => (<MenuItem key={tOpt} value={tOpt}>{tOpt}</MenuItem>)) : (<MenuItem disabled>No tags</MenuItem>)}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<Select value={formData.lang || ''} onChange={handleLangChange}>
							{availableLangOptions.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
						</Select>
					</FormControl>

					{/* Settings */}
					<Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>Settings</Typography>
					<TextField label="Difficulty Level" value={formData.difficultyLevel || ''} onChange={e => onFormChange('difficultyLevel', e.target.value)} fullWidth />
					
					<FormControl fullWidth>
						<FormLabel>{t('videoRus.form.term')}</FormLabel>
						<Select
							value={formData.term?.toString() || ''}
							onChange={(e) => onFormChange('term', e.target.value ? parseInt(e.target.value) : undefined)}
						>
							<MenuItem value=""><em>None</em></MenuItem>
							{[1, 2, 3, 4].map((term) => (
								<MenuItem key={term} value={term.toString()}>{term}</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<FormLabel>{t('videoRus.form.week')}</FormLabel>
						<Select
							value={formData.week?.toString() || ''}
							onChange={(e) => onFormChange('week', e.target.value ? parseInt(e.target.value) : undefined)}
						>
							<MenuItem value=""><em>None</em></MenuItem>
							{Array.from({ length: 14 }, (_, i) => i + 1).map((week) => (
								<MenuItem key={week} value={week.toString()}>{week}</MenuItem>
							))}
						</Select>
					</FormControl>
					
					<TextField label={t('videoRus.form.displayOrder') || 'Display Order'} type="number" value={String(formData.displayOrder)} onChange={e => onFormChange('displayOrder', Number(e.target.value) || 0)} fullWidth />
					<FormControlLabel control={<Checkbox checked={formData.isActive} onChange={e => onFormChange('isActive', e.target.checked)} />} label={t('videoRus.form.isActive') || 'Active'} />
				</Box>
			</DialogContent>
							<DialogActions>
								<Button onClick={onClose} disabled={loading || localSaving}>{t('videoRus.actions.cancel') || 'Cancel'}</Button>
								<Button variant="contained" onClick={async () => {
									setLocalSaving(true);
									try {
										await onSubmit(Boolean(formData.coverImageFile));
									} finally {
										setLocalSaving(false);
									}
								}} disabled={loading || localSaving}>{t('videoRus.actions.save') || 'Save'}</Button>
							</DialogActions>
							<Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }} open={loading || localSaving}>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
									<CircularProgress color="inherit" />
									<Typography>{t('videoRus.messages.pleaseWait') || 'Please wait...'}</Typography>
								</Box>
							</Backdrop>
		</Dialog>
	);
};

export default VideoRuEditDialog;
