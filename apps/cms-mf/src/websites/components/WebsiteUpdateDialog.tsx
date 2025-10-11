import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Alert,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
  Divider,
  Chip,
  OutlinedInput,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import '../i18n/translations';
import { Edit } from 'lucide-react';
import type { WebsiteFormData } from '../types/website.types';
import { LANGUAGE_OPTIONS } from '../constants';

export interface WebsiteUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  formData: WebsiteFormData;
  onFormChange: (field: keyof WebsiteFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}


export const WebsiteUpdateDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: WebsiteUpdateDialogProps) => {
  const { t, i18n } = useTranslation();

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const websiteTagsSetting = appSettings.find(
        (setting) => setting.name === 'website_tags' && setting.lang === currentLang
      );
      if (!websiteTagsSetting) return [];
      return websiteTagsSetting.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    } catch (error) {
      console.error('[WebsiteUpdateDialog] Error loading tags:', error);
      return [];
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
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Edit size={20} />
        <Typography variant="h6" component="span">{t('websites.edit')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>{t('websites.form.basicInformation') || 'Basic Information'}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Website Name */}
              <TextField label={t('websites.form.name')} value={formData.name} onChange={(e) => onFormChange('name', e.target.value)} fullWidth variant="outlined" placeholder={t('websites.form.namePlaceholder')} error={!!getFieldError('name')} helperText={getFieldError('name') || t('websites.form.nameHelper')} sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }} />
              {/* Website URL */}
              <TextField label={t('websites.form.url')} value={formData.url} onChange={(e) => onFormChange('url', e.target.value)} fullWidth variant="outlined" placeholder={t('websites.form.urlPlaceholder')} error={!!getFieldError('url')} helperText={getFieldError('url') || t('websites.form.urlHelper')} sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }} />
              {/* Logo URL (read-only or editable) */}
              <TextField label={t('websites.form.logoUrl')} value={formData.logoUrl} onChange={(e) => onFormChange('logoUrl', e.target.value)} fullWidth variant="outlined" placeholder={t('websites.form.logoUrlPlaceholder')} error={!!getFieldError('logoUrl')} helperText={getFieldError('logoUrl') || t('websites.form.logoUrlHelper')} sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }} />
              {/* Description */}
              <TextField label={t('websites.form.description')} value={formData.description} onChange={(e) => onFormChange('description', e.target.value)} fullWidth multiline rows={4} variant="outlined" placeholder={t('websites.form.descriptionPlaceholder')} error={!!getFieldError('description')} helperText={getFieldError('description') || t('websites.form.descriptionHelper')} sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }} />
              {/* Tags */}
              <FormControl fullWidth error={!!getFieldError('tags')}>
                <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>{t('websites.form.tags')}</FormLabel>
                <Select<string[]> multiple value={formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []} onChange={(e) => { const value = e.target.value; const tagsArray = typeof value === 'string' ? value.split(',') : value; onFormChange('tags', tagsArray.join(',')); }} input={<OutlinedInput />} renderValue={(selected) => (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{selected.map((value) => (<Chip key={value} label={value} size="small" />))}</Box>)} sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }}>
                  {availableTags.length > 0 ? (
                    availableTags.map((tag) => (
                      <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled><Typography variant="body2" color="text.secondary">No tags available for current language</Typography></MenuItem>
                  )}
                </Select>
                {getFieldError('tags') ? (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{getFieldError('tags')}</Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>{t('websites.form.tagsHelper')}</Typography>
                )}
              </FormControl>
              {/* Language */}
              <FormControl fullWidth error={!!getFieldError('lang')}>
                <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>{t('websites.form.lang')}</FormLabel>
                <Select value={formData.lang} onChange={(e) => onFormChange('lang', e.target.value)} displayEmpty sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }}>
                  <MenuItem value="" disabled>{t('websites.form.langPlaceholder')}</MenuItem>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
                {getFieldError('lang') && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{getFieldError('lang')}</Typography>
                )}
              </FormControl>
              {/* Display Order */}
              <TextField label={t('websites.form.displayOrder')} type="number" value={formData.displayOrder} onChange={(e) => onFormChange('displayOrder', parseInt(e.target.value) || 0)} fullWidth variant="outlined" placeholder={t('websites.form.displayOrderPlaceholder')} error={!!getFieldError('displayOrder')} helperText={getFieldError('displayOrder') || t('websites.form.displayOrderHelper')} sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }} />
            </Box>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>{t('websites.form.settings') || 'Settings'}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} color="primary" />} label={<Box sx={{ display: 'flex', flexDirection: 'column' }}><Typography variant="body2" sx={{ fontWeight: 500 }}>{t('websites.form.isActive')}</Typography><Typography variant="caption" color="text.secondary">Active websites are visible to users</Typography></Box>} sx={{ alignItems: 'flex-start', ml: 0 }} />
            </Box>
          </Box>
          {Object.keys(formErrors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>{t('websites.form.correctErrors')}</Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {Object.entries(formErrors).map(([field, error]) => (
                  <li key={field}><Typography variant="body2">{Array.isArray(error) ? error.join(', ') : error}</Typography></li>
                ))}
              </Box>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('websites.actions.cancel')}</Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null} sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600, minWidth: 120 }}>{(() => { if (loading) { return 'Saving...'; } return t('websites.actions.save'); })()}</Button>
      </DialogActions>
    </Dialog>
  );
}
