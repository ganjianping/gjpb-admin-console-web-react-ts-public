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
  FormLabel,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  OutlinedInput,
  Chip,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import '../i18n/translations';
import { Edit, ImageIcon } from 'lucide-react';
import type { ImageFormData } from '../types/image.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface ImageEditDialogProps {
  open: boolean;
  onClose: () => void;
  formData: ImageFormData;
  onFormChange: (field: keyof ImageFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

const ImageEditDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: ImageEditDialogProps) => {
  const { t, i18n } = useTranslation();
  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const imageTagsSetting = appSettings.find(
        (setting) => setting.name === 'image_tags' && setting.lang === currentLang
      );
      if (!imageTagsSetting) return [];
      return imageTagsSetting.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    } catch (error) {
      console.error('[ImageEditDialog] Error loading tags:', error);
      return [];
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
        const fallback = LANGUAGE_OPTIONS.find((opt) => opt.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (error) {
      console.error('[ImageEditDialog] Error loading lang options:', error);
      return LANGUAGE_OPTIONS;
    }
  }, [i18n.language]);
  const getFieldError = (field: string): string => {
    const error = formErrors[field];
    if (Array.isArray(error)) {
      return error.join(', ');
    }
    return error || '';
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {loading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <LinearProgress />
        </Box>
      )}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: loading ? 3 : 2 }}>
        <Edit size={20} />
        <Typography variant="h6" component="span">
          {t('images.edit')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField label={t('images.form.name')} value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} fullWidth error={!!getFieldError('name')} helperText={getFieldError('name')} />
          <TextField label={t('images.form.sourceName')} value={formData.sourceName} onChange={(e) => onFormChange('sourceName', e.target.value)} fullWidth error={!!getFieldError('sourceName')} helperText={getFieldError('sourceName')} />
          <TextField label={t('images.form.originalUrl')} value={formData.originalUrl} onChange={(e) => onFormChange('originalUrl', e.target.value)} fullWidth error={!!getFieldError('originalUrl')} helperText={getFieldError('originalUrl')} placeholder="https://example.com/image.jpg" />
          <TextField label={t('images.form.filename')} value={formData.filename} fullWidth disabled helperText={t('images.form.filename') + ' (read-only)'} />
          <TextField label={t('images.form.thumbnailFilename')} value={formData.thumbnailFilename} fullWidth disabled helperText={t('images.form.thumbnailFilename') + ' (read-only)'} />
          <TextField label={t('images.form.extension')} value={formData.extension} onChange={(e) => onFormChange('extension', e.target.value)} fullWidth error={!!getFieldError('extension')} helperText={getFieldError('extension')} />
          <TextField label={t('images.form.mimeType')} value={formData.mimeType} onChange={(e) => onFormChange('mimeType', e.target.value)} fullWidth error={!!getFieldError('mimeType')} helperText={getFieldError('mimeType')} />
          <TextField label={t('images.form.sizeBytes')} value={formData.sizeBytes} onChange={(e) => onFormChange('sizeBytes', parseInt(e.target.value) || 0)} type="number" fullWidth error={!!getFieldError('sizeBytes')} helperText={getFieldError('sizeBytes')} />
          <TextField label={t('images.form.width')} value={formData.width} onChange={(e) => onFormChange('width', parseInt(e.target.value) || 0)} type="number" fullWidth error={!!getFieldError('width')} helperText={getFieldError('width')} />
          <TextField label={t('images.form.height')} value={formData.height} onChange={(e) => onFormChange('height', parseInt(e.target.value) || 0)} type="number" fullWidth error={!!getFieldError('height')} helperText={getFieldError('height')} />
          <TextField
            label={t('images.form.altText')}
            value={formData.altText}
            onChange={(e) => onFormChange('altText', e.target.value)}
            fullWidth
            error={!!getFieldError('altText')}
            helperText={getFieldError('altText') || `${(formData.altText || '').length}/500`}
            multiline
            rows={4}
            inputProps={{ maxLength: 500 }}
          />
          <FormControl fullWidth error={!!getFieldError('tags')}>
            <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>{t('images.form.tags')}</FormLabel>
            <Select<string[]> multiple value={formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []} onChange={(e) => {
              const value = e.target.value;
              const tagsArray = typeof value === 'string' ? value.split(',') : value;
              onFormChange('tags', tagsArray.join(','));
            }} input={<OutlinedInput />} renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )} sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }}>
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">No tags available for current language</Typography>
                </MenuItem>
              )}
            </Select>
            {getFieldError('tags') && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{getFieldError('tags')}</Typography>
            )}
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>{t('images.form.lang')}</FormLabel>
            <Select value={formData.lang} onChange={(e) => onFormChange('lang', e.target.value)} error={!!getFieldError('lang')}>
              {availableLangOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label={t('images.form.displayOrder')} value={formData.displayOrder} onChange={(e) => onFormChange('displayOrder', parseInt(e.target.value) || 0)} type="number" fullWidth error={!!getFieldError('displayOrder')} helperText={getFieldError('displayOrder')} />
          <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />} label={t('images.form.isActive')} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{t('images.actions.cancel')}</Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>{t('images.actions.save')}</Button>
      </DialogActions>
      <Backdrop sx={{ position: 'absolute', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', gap: 2 }} open={loading}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 4, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 3 }}>
          <CircularProgress size={60} thickness={4} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon size={20} />
              {t('images.messages.savingImage')}
            </Typography>
            <Typography variant="body2" color="text.secondary">{t('images.messages.pleaseWait')}</Typography>
          </Box>
        </Box>
      </Backdrop>
    </Dialog>
  );
};

export default ImageEditDialog;
