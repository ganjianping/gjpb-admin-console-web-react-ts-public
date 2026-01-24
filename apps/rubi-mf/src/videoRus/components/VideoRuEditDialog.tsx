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
  Alert,
} from '@mui/material';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { VideoRuFormData } from '../types/videoRu.types';
import { LANGUAGE_OPTIONS } from '../constants';
import { videoRuService } from '../services/videoRuService';

interface VideoRuEditDialogProps {
  open: boolean;
  onClose: () => void;
  formData: VideoRuFormData;
  onFormChange: (field: keyof VideoRuFormData, value: any) => void;
  videoId: string;
  loading?: boolean;
  onReset?: () => void;
  onUpdated?: () => Promise<void> | void;
}

const VideoRuEditDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  videoId,
  loading,
  onReset,
  onUpdated,
}: VideoRuEditDialogProps) => {
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

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFormChange('videoFile', file);
    if (file && !formData.filename) {
      onFormChange('filename', file.name);
    }
  };

  const handleCoverImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFormChange('coverImageFile', file);
    if (file && !formData.coverImageFilename) {
      onFormChange('coverImageFilename', file.name);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    setLocalSaving(true);
    try {
      await videoRuService.updateVideoRuWithFiles(videoId, {
        name: formData.name,
        filename: formData.filename,
        coverImageFilename: formData.coverImageFilename,
        sourceName: formData.sourceName,
        originalUrl: formData.originalUrl,
        description: formData.description,
        tags: formData.tags,
        lang: formData.lang,
        term: formData.term,
        week: formData.week,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
        file: formData.videoFile,
        coverImageFile: formData.coverImageFile,
      });

      if (onReset) onReset();
      if (onUpdated) {
        try {
          await onUpdated();
        } catch (err) {
          console.error('[VideoRuEditDialog] onUpdated callback failed', err);
        }
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update video');
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
        {t('videoRus.edit') || 'Edit Video'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Video File Upload (Optional - to replace existing) */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t('videoRus.form.replaceVideoFile') || 'Replace Video File (Optional)'}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload size={20} />}
              fullWidth
            >
              {formData.videoFile ? formData.videoFile.name : (t('videoRus.form.chooseVideoFile') || 'Choose Video File')}
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleVideoFileChange}
              />
            </Button>
            {formData.videoFile && (
              <Alert severity="info" sx={{ mt: 1 }}>
                {t('videoRus.form.selectedFile') || 'Selected file'}: {formData.videoFile.name}
              </Alert>
            )}
          </Box>

          <TextField
            label={t('videoRus.form.filename') || 'Filename'}
            value={formData.filename}
            onChange={(e) => onFormChange('filename', e.target.value)}
            fullWidth
          />

          {/* Cover Image Upload */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
            {t('videoRus.form.replaceCoverImage') || 'Replace Cover Image (Optional)'}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload size={20} />}
              fullWidth
            >
              {formData.coverImageFile ? formData.coverImageFile.name : (t('videoRus.form.chooseCoverImage') || 'Choose Cover Image')}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleCoverImageFileChange}
              />
            </Button>
            {formData.coverImageFile && (
              <Alert severity="info" sx={{ mt: 1 }}>
                {t('videoRus.form.selectedFile') || 'Selected file'}: {formData.coverImageFile.name}
              </Alert>
            )}
          </Box>

          <TextField
            label={t('videoRus.form.coverImageFilename') || 'Cover Image Filename'}
            value={formData.coverImageFilename}
            onChange={(e) => onFormChange('coverImageFilename', e.target.value)}
            fullWidth
          />

          {/* Basic Information */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
            {t('videoRus.form.basicInfo') || 'Basic Information'}
          </Typography>
          <TextField
            label={t('videoRus.form.name') || 'Name'}
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label={t('videoRus.form.description') || 'Description'}
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            label={t('videoRus.form.sourceName') || 'Source Name'}
            value={formData.sourceName}
            onChange={(e) => onFormChange('sourceName', e.target.value)}
            fullWidth
          />

          <TextField
            label={t('videoRus.form.originalUrl') || 'Original URL'}
            value={formData.originalUrl}
            onChange={(e) => onFormChange('originalUrl', e.target.value)}
            fullWidth
          />

          {/* Tags and Language */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
            {t('videoRus.form.classification') || 'Classification'}
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              value={formData.tags ? formData.tags.split(',').filter(Boolean) : []}
              onChange={handleTagsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) && selected.map((v) => (
                    <Chip key={v} label={v} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                ))
              ) : (
                <MenuItem disabled>No tags available</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Select
              value={formData.lang}
              onChange={(e) => onFormChange('lang', e.target.value)}
            >
              {availableLangOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Term and Week */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <TextField
                label={t('videoRus.form.term') || 'Term'}
                type="number"
                value={formData.term ?? ''}
                onChange={(e) => onFormChange('term', e.target.value ? Number.parseInt(e.target.value) : undefined)}
                inputProps={{ min: 1, max: 4 }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label={t('videoRus.form.week') || 'Week'}
                type="number"
                value={formData.week ?? ''}
                onChange={(e) => onFormChange('week', e.target.value ? Number.parseInt(e.target.value) : undefined)}
                inputProps={{ min: 1, max: 14 }}
              />
            </FormControl>
          </Box>

          {/* Settings */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
            {t('videoRus.form.settings') || 'Settings'}
          </Typography>
          <TextField
            label={t('videoRus.form.displayOrder') || 'Display Order'}
            type="number"
            value={formData.displayOrder}
            onChange={(e) => onFormChange('displayOrder', Number(e.target.value) || 0)}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => onFormChange('isActive', e.target.checked)}
              />
            }
            label={t('videoRus.form.isActive') || 'Active'}
          />

          {errorMsg && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={() => {
            if (onReset) onReset();
            onClose();
          }}
          disabled={loading || localSaving}
        >
          {t('common.cancel') || 'Cancel'}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || localSaving}
        >
          {(loading || localSaving) ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            t('common.save') || 'Save'
          )}
        </Button>
      </DialogActions>
      <Backdrop
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
        open={loading || localSaving}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <CircularProgress size={48} />
          <Typography>{t('common.pleaseWait') || 'Please wait...'}</Typography>
        </Box>
      </Backdrop>
    </Dialog>
  );
};

export default VideoRuEditDialog;
