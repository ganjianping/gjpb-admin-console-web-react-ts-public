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
import type { LogoFormData } from '../types/logo.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface LogoEditDialogProps {
  open: boolean;
  onClose: () => void;
  formData: LogoFormData;
  onFormChange: (field: keyof LogoFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

export const LogoEditDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: LogoEditDialogProps) => {
  const { t, i18n } = useTranslation();

  // Get logo tags from local storage filtered by current language
  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [];

      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      
      const logoTagsSetting = appSettings.find(
        (setting) => setting.name === 'logo_tags' && setting.lang === currentLang
      );

      if (!logoTagsSetting) return [];

      // Parse the comma-separated tags
      return logoTagsSetting.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    } catch (error) {
      console.error('[LogoEditDialog] Error loading tags:', error);
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      {/* Progress Bar */}
      {loading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <LinearProgress />
        </Box>
      )}

      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: loading ? 3 : 2 }}>
        <Edit size={20} />
        <Typography variant="h6" component="span">
          {t('logos.edit')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {/* Logo Name */}
          <TextField
            label={t('logos.form.name')}
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            fullWidth
            error={!!getFieldError('name')}
            helperText={getFieldError('name')}
          />

          {/* Original URL */}
          <TextField
            label={t('logos.form.originalUrl')}
            value={formData.originalUrl}
            onChange={(e) => onFormChange('originalUrl', e.target.value)}
            fullWidth
            error={!!getFieldError('originalUrl')}
            helperText={getFieldError('originalUrl')}
            placeholder="https://example.com/logo.jpg"
          />

          {/* Filename - Read-only */}
          <TextField
            label={t('logos.form.filename')}
            value={formData.filename}
            fullWidth
            disabled
            helperText={t('logos.form.filename') + ' (read-only)'}
          />

          {/* Extension */}
          <TextField
            label={t('logos.form.extension')}
            value={formData.extension}
            onChange={(e) => onFormChange('extension', e.target.value)}
            fullWidth
            error={!!getFieldError('extension')}
            helperText={getFieldError('extension')}
          />

          {/* Tags */}
          <FormControl fullWidth error={!!getFieldError('tags')}>
            <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>
              {t('logos.form.tags')}
            </FormLabel>
            <Select<string[]>
              multiple
              value={formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []}
              onChange={(e) => {
                const value = e.target.value;
                const tagsArray = typeof value === 'string' ? value.split(',') : value;
                onFormChange('tags', tagsArray.join(','));
              }}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                },
              }}
            >
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No tags available for current language
                  </Typography>
                </MenuItem>
              )}
            </Select>
            {getFieldError('tags') && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {getFieldError('tags')}
              </Typography>
            )}
          </FormControl>

          {/* Language */}
          <FormControl fullWidth>
            <FormLabel>{t('logos.form.lang')}</FormLabel>
            <Select
              value={formData.lang}
              onChange={(e) => onFormChange('lang', e.target.value)}
              error={!!getFieldError('lang')}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(`logos.languages.${option.value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Display Order */}
          <TextField
            label={t('logos.form.displayOrder')}
            value={formData.displayOrder}
            onChange={(e) => onFormChange('displayOrder', parseInt(e.target.value) || 0)}
            type="number"
            fullWidth
            error={!!getFieldError('displayOrder')}
            helperText={getFieldError('displayOrder')}
          />

          {/* Active Status */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => onFormChange('isActive', e.target.checked)}
              />
            }
            label={t('logos.form.isActive')}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('logos.actions.cancel')}
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {t('logos.actions.save')}
        </Button>
      </DialogActions>

      {/* Save Progress Backdrop */}
      <Backdrop
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={loading}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: 3,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon size={20} />
              {t('logos.messages.savingLogo')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('logos.messages.pleaseWait')}
            </Typography>
          </Box>
        </Box>
      </Backdrop>
    </Dialog>
  );
};
