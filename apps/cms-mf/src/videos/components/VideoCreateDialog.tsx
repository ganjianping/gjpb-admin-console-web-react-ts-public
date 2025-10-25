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
import type { VideoFormData } from '../types/video.types';
import { LANGUAGE_OPTIONS } from '../constants';
import { videoService } from '../services/videoService';

interface VideoCreateDialogProps {
	open: boolean;
	onClose: () => void;
	formData: VideoFormData;
	onFormChange: (field: keyof VideoFormData, value: any) => void;
		// onSubmit not used here; submit handled internally
	loading?: boolean;
	formErrors?: Record<string, string[] | string>;
	onReset?: () => void;
	onCreated?: () => Promise<void> | void;
}

const VideoCreateDialog = ({
	open,
	onClose,
	formData,
	onFormChange,
	loading,
	formErrors = {},
	onReset,
	onCreated,
}: VideoCreateDialogProps) => {
	const { t, i18n } = useTranslation();
	const [localSaving, setLocalSaving] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const availableTags = useMemo(() => {
		try {
			const settings = localStorage.getItem('gjpb_app_settings');
			if (!settings) return [] as string[];
			const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
			const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
			const videoTagsSetting = appSettings.find((s) => s.name === 'video_tags' && s.lang === currentLang);
			if (!videoTagsSetting) return [] as string[];
			return videoTagsSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
		} catch (err) {
			console.error('[VideoCreateDialog] Error loading tags:', err);
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
			console.error('[VideoCreateDialog] Error loading lang options:', err);
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

	const handleFileChange = (field: keyof VideoFormData, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onFormChange(field, file);
	};

		const handleSubmit = async () => {
		setErrorMsg(null);
		setLocalSaving(true);
		try {
			// build request expected by createVideoByUpload
				if (!formData.file) throw new Error('No video file selected');
				const file = formData.file;
				await videoService.createVideoByUpload({
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
					console.error('[VideoCreateDialog] onCreated callback failed', err);
				}
			}
			onClose();
		} catch (err: any) {
			setErrorMsg(err?.message || 'Failed to upload video');
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
				<Typography variant="h6" component="div">{t('videos.create') || 'Create Video'}</Typography>
			</DialogTitle>
			<DialogContent sx={{ pt: 2 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
					<TextField label={t('videos.form.name') || 'Name'} value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} fullWidth error={!!getFieldError('name')} helperText={getFieldError('name')} />
					<TextField label={t('videos.form.sourceName') || 'Source Name'} value={(formData as any).sourceName || ''} onChange={(e) => onFormChange('sourceName' as any, e.target.value)} fullWidth />
					<TextField label={t('videos.form.originalUrl') || 'Original URL'} value={(formData as any).originalUrl || ''} onChange={(e) => onFormChange('originalUrl' as any, e.target.value)} fullWidth />
                    <Box>
						<Typography variant="subtitle2">{t('videos.form.videoFile') || 'Video File'}</Typography>
						<input type="file" accept="video/*" onChange={(e) => handleFileChange('file', e)} />
					</Box>
					<Box>
						<Typography variant="subtitle2">{t('videos.form.coverImageFile') || 'Cover Image File'}</Typography>
						<input type="file" accept="image/*" onChange={(e) => handleFileChange('coverImageFile', e)} />
					</Box>    
					<Box>
						<Typography variant="subtitle2">{t('videos.form.description') || 'Description'}</Typography>
						<TextareaAutosize
							minRows={3}
							style={{ width: '100%', padding: '8.5px 14px', borderRadius: 4, border: '1px solid rgba(0,0,0,0.23)', fontFamily: 'inherit' }}
							value={formData.description || ''}
							onChange={(e) => onFormChange('description', e.target.value)}
							aria-label={t('videos.form.description') || 'Description'}
						/>
						{getFieldError('description') && <FormHelperText error>{getFieldError('description')}</FormHelperText>}
					</Box>

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

					<TextField label={t('videos.form.displayOrder') || 'Display Order'} type="number" value={String(formData.displayOrder)} onChange={(e) => onFormChange('displayOrder', Number(e.target.value) || 0)} fullWidth />
					<FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />} label={t('videos.form.isActive') || 'Active'} />

					{errorMsg && <Typography color="error">{errorMsg}</Typography>}
				</Box>
			</DialogContent>
			<DialogActions>
			<Button onClick={() => { if (onReset) { onReset(); } onClose(); }} disabled={loading || localSaving}>{t('videos.actions.cancel') || 'Cancel'}</Button>
				<Button variant="contained" onClick={handleSubmit} disabled={loading || localSaving} startIcon={(loading || localSaving) ? <CircularProgress size={16} color="inherit" /> : undefined}>{t('videos.actions.save') || 'Save'}</Button>
			</DialogActions>
			<Backdrop sx={{ position: 'absolute', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0,0,0,0.6)' }} open={loading || localSaving}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, borderRadius: 2, backgroundColor: 'background.paper' }}>
					<CircularProgress size={48} />
					<Typography>{t('videos.messages.pleaseWait') || 'Please wait...'}</Typography>
				</Box>
			</Backdrop>
		</Dialog>
	);
};

export default VideoCreateDialog;
