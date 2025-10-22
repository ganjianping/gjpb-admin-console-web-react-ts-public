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
import TiptapTextEditor from '../../../../shared-lib/src/ui-components/rich-text/tiptapTextEditor';
import { useTranslation } from 'react-i18next';
import type { AudioFormData } from '../types/audio.types';
import { LANGUAGE_OPTIONS } from '../constants';
import { audioService } from '../services/audioService';

interface AudioCreateDialogProps {
  open: boolean;
  onClose: () => void;
  formData: AudioFormData;
  onFormChange: (field: keyof AudioFormData, value: any) => void;
  loading?: boolean;
  formErrors?: Record<string, string[] | string>;
  onReset?: () => void;
  onCreated?: () => Promise<void> | void;
}

const AudioCreateDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  loading,
  formErrors = {},
  onReset,
  onCreated,
}: AudioCreateDialogProps) => {
  const { t, i18n } = useTranslation();
  const [localSaving, setLocalSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const audioTagsSetting = appSettings.find((s) => s.name === 'audio_tags' && s.lang === currentLang);
      if (!audioTagsSetting) return [] as string[];
      return audioTagsSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[AudioCreateDialog] Error loading tags:', err);
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
      console.error('[AudioCreateDialog] Error loading lang options:', err);
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

  const handleFileChange = (field: keyof AudioFormData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFormChange(field, file);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    setLocalSaving(true);
    try {
      if (!formData.file) throw new Error('No audio file selected');
      const file = formData.file;
      await audioService.createAudioByUpload({
        // cast to any to avoid needing to supply filename/coverImageFilename in this helper
        ...( {
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
        } as any ),
      } as any);

      if (onReset) onReset();
      if (onCreated) {
        try {
          await onCreated();
        } catch (err) {
          console.error('[AudioCreateDialog] onCreated callback failed', err);
        }
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to upload audio');
    } finally {
      setLocalSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {(loading || localSaving) && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <LinearProgress />
        </Box>
      )}
      <DialogTitle sx={{ pt: loading ? 3 : 2 }}>
        <Typography variant="h6" component="div">{t('audios.create') || 'Create Audio'}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label={t('audios.form.name') || 'Name'} value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} fullWidth error={!!getFieldError('name')} helperText={getFieldError('name')} />
          <Box>
            <Typography variant="subtitle2">{t('audios.form.audioFile') || 'Audio File'}</Typography>
            <input type="file" accept="audio/*" onChange={(e) => handleFileChange('file', e)} />
          </Box>
          <Box>
            <Typography variant="subtitle2">{t('audios.form.coverImageFile') || 'Cover Image File'}</Typography>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange('coverImageFile', e)} />
          </Box>
          <Box>
            <Typography variant="subtitle2">{t('audios.form.description') || 'Description'}</Typography>
            <TextareaAutosize
              minRows={3}
              style={{ width: '100%', padding: '8.5px 14px', borderRadius: 4, border: '1px solid rgba(0,0,0,0.23)', fontFamily: 'inherit' }}
              value={formData.description || ''}
              onChange={(e) => onFormChange('description', e.target.value)}
              aria-label={t('audios.form.description') || 'Description'}
            />
            {getFieldError('description') && <FormHelperText error>{getFieldError('description')}</FormHelperText>}
          </Box>

          <Box>
            <Typography variant="subtitle2">{t('audios.form.subtitle') || 'Subtitle'}</Typography>
            <TiptapTextEditor value={(formData as any).subtitle || ''} onChange={(html: string) => onFormChange('subtitle' as any, html)} placeholder={t('audios.form.subtitle') || 'Subtitle'} />
            {getFieldError('subtitle') && <FormHelperText error>{getFieldError('subtitle')}</FormHelperText>}
          </Box>

          <TextField label={t('audios.form.sourceName') || 'Source Name'} value={(formData as any).sourceName || ''} onChange={(e) => onFormChange('sourceName' as any, e.target.value)} fullWidth />
          <TextField label={t('audios.form.originalUrl') || 'Original URL'} value={(formData as any).originalUrl || ''} onChange={(e) => onFormChange('originalUrl' as any, e.target.value)} fullWidth />
          

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

          <TextField label={t('audios.form.displayOrder') || 'Display Order'} type="number" value={String(formData.displayOrder)} onChange={(e) => onFormChange('displayOrder', Number(e.target.value) || 0)} fullWidth />
          <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />} label={t('audios.form.isActive') || 'Active'} />

          {errorMsg && <Typography color="error">{errorMsg}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { if (onReset) { onReset(); } onClose(); }} disabled={loading || localSaving}>{t('audios.actions.cancel') || 'Cancel'}</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || localSaving} startIcon={(loading || localSaving) ? <CircularProgress size={16} color="inherit" /> : undefined}>{t('audios.actions.save') || 'Save'}</Button>
      </DialogActions>
      <Backdrop sx={{ position: 'absolute', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0,0,0,0.6)' }} open={loading || localSaving}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4, borderRadius: 2, backgroundColor: 'background.paper' }}>
          <CircularProgress size={48} />
          <Typography>{t('audios.messages.pleaseWait') || 'Please wait...'}</Typography>
        </Box>
      </Backdrop>
    </Dialog>
  );
};

export default AudioCreateDialog;
