import React, { useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, FormControlLabel, Checkbox, FormControl, Select, MenuItem, OutlinedInput, Chip, Typography, TextareaAutosize, LinearProgress, Backdrop, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { AudioFormData } from '../types/audio.types';
import { LANGUAGE_OPTIONS } from '../constants';
import TiptapTextEditor from '../../../../shared-lib/src/ui-components/rich-text/tiptapTextEditor';

interface AudioEditDialogProps {
  open: boolean;
  formData: AudioFormData;
  onFormChange: (field: keyof AudioFormData, value: any) => void;
  onSubmit: (useFormData?: boolean) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  formErrors?: Record<string, string[] | string>;
}
const AudioEditDialog: React.FC<AudioEditDialogProps> = ({ open, formData, onFormChange, onSubmit, onClose, loading, formErrors = {} }) => {
  const { i18n, t } = useTranslation();
  const [localSaving, setLocalSaving] = useState(false);

  const getFieldError = (field: string) => {
    const err = formErrors[field];
    if (Array.isArray(err)) return err.join(', ');
    return typeof err === 'string' ? err : '';
  };

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
      console.error('[AudioEditDialog] Error loading tags:', err);
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
      console.error('[AudioEditDialog] Error loading lang options:', err);
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {(loading || localSaving) && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1200 }}>
          <LinearProgress />
        </Box>
      )}
      <DialogTitle>{t('audios.edit') || 'Edit Audio'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label={t('audios.form.name') || 'Name'} value={formData.name} onChange={e => onFormChange('name', e.target.value)} fullWidth />
          
          <TextField label={t('audios.form.sourceName') || 'Source Name'} value={(formData as any).sourceName || ''} onChange={e => onFormChange('sourceName' as any, e.target.value)} fullWidth />
          <TextField label={t('audios.form.originalUrl') || 'Original URL'} value={(formData as any).originalUrl || ''} onChange={e => onFormChange('originalUrl' as any, e.target.value)} fullWidth />
          <Box>
            <Typography variant="subtitle2">{t('audios.form.coverImageFile') || 'Cover Image File'}</Typography>
            <input type="file" accept="image/*" onChange={handleCoverFileChange} />
          </Box>
          <Box>
            <Typography variant="subtitle2">{t('audios.form.description') || 'Description'}</Typography>
            <TextareaAutosize minRows={2} style={{ width: '100%', padding: '8.5px 14px', borderRadius: 4, border: '1px solid rgba(0,0,0,0.23)', fontFamily: 'inherit' }} value={formData.description || ''} onChange={e => onFormChange('description', e.target.value)} aria-label={t('audios.form.description') || 'Description'} />
          </Box>
          <Box>
            <Typography variant="subtitle2">{t('audios.form.subtitle') || 'Subtitle'}</Typography>
            <TiptapTextEditor value={(formData as any).subtitle || ''} onChange={(html: string) => onFormChange('subtitle' as any, html)} placeholder={t('audios.form.subtitle') || 'Subtitle'} />
            {getFieldError('subtitle') && <Typography variant="caption" color="error">{getFieldError('subtitle')}</Typography>}
          </Box>

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

          <TextField label={t('audios.form.displayOrder') || 'Display Order'} type="number" value={String(formData.displayOrder)} onChange={e => onFormChange('displayOrder', Number(e.target.value) || 0)} fullWidth />
          <FormControlLabel control={<Checkbox checked={formData.isActive} onChange={e => onFormChange('isActive', e.target.checked)} />} label={t('audios.form.isActive') || 'Active'} />

          <TextField label={t('audios.form.filename') || 'Filename'} value={formData.filename} fullWidth disabled />
          <TextField label={t('audios.form.coverImageFilename') || 'Cover Image Filename'} value={formData.coverImageFilename || ''} fullWidth disabled />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading || localSaving}>{t('audios.actions.cancel') || 'Cancel'}</Button>
        <Button variant="contained" onClick={async () => {
          setLocalSaving(true);
          try {
            await onSubmit(Boolean(formData.coverImageFile));
          } finally {
            setLocalSaving(false);
          }
        }} disabled={loading || localSaving}>{t('audios.actions.save') || 'Save'}</Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }} open={loading || localSaving}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography>{t('audios.messages.pleaseWait') || 'Please wait...'}</Typography>
        </Box>
      </Backdrop>
    </Dialog>
  );
};

export default AudioEditDialog;
