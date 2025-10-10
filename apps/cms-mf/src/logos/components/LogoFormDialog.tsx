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
  RadioGroup,
  Radio,
  Alert,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import '../i18n/translations';
import { Edit, Plus, Upload } from 'lucide-react';
import type { LogoFormData } from '../types/logo.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface LogoFormDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: 'create' | 'edit';
  formData: LogoFormData;
  onFormChange: (field: keyof LogoFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

export const LogoFormDialog = ({
  open,
  onClose,
  actionType,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: LogoFormDialogProps) => {
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
      console.error('[LogoFormDialog] Error loading tags:', error);
      return [];
    }
  }, [i18n.language]);

  const getDialogTitle = () => {
    return actionType === 'create' ? t('logos.create') : t('logos.edit');
  };

  const getDialogIcon = () => {
    return actionType === 'create' ? <Plus size={20} /> : <Edit size={20} />;
  };

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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {getDialogIcon()}
        <Typography variant="h6" component="span">
          {getDialogTitle()}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Logo Name */}
          <TextField
            label={t('logos.form.name')}
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            fullWidth
            error={!!getFieldError('name')}
            helperText={getFieldError('name')}
          />

          {/* Upload Method Selection - Only show for create mode */}
          {actionType === 'create' && (
            <FormControl component="fieldset">
              <FormLabel component="legend">Upload Method</FormLabel>
              <RadioGroup
                row
                value={formData.uploadMethod}
                onChange={(e) => onFormChange('uploadMethod', e.target.value as 'url' | 'file')}
              >
                <FormControlLabel 
                  value="url" 
                  control={<Radio />} 
                  label="By URL" 
                />
                <FormControlLabel 
                  value="file" 
                  control={<Radio />} 
                  label="Upload File" 
                />
              </RadioGroup>
            </FormControl>
          )}

          {/* File Upload - Only show when uploadMethod is 'file' and in create mode */}
          {actionType === 'create' && formData.uploadMethod === 'file' && (
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload size={20} />}
                fullWidth
                sx={{ mb: 1 }}
              >
                {formData.file ? formData.file.name : 'Choose File'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onFormChange('file', file);
                    }
                  }}
                />
              </Button>
              {formData.file && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Selected file: {formData.file.name} ({(formData.file.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
              {getFieldError('file') && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {getFieldError('file')}
                </Alert>
              )}
            </Box>
          )}

          {/* Original URL - Only show when uploadMethod is 'url' or in edit mode */}
          {(actionType === 'edit' || formData.uploadMethod === 'url') && (
            <TextField
              label={t('logos.form.originalUrl')}
              value={formData.originalUrl}
              onChange={(e) => onFormChange('originalUrl', e.target.value)}
              fullWidth
              error={!!getFieldError('originalUrl')}
              helperText={getFieldError('originalUrl')}
              placeholder="https://example.com/logo.jpg"
            />
          )}

          {/* Show these fields only in edit mode */}
          {actionType === 'edit' && (
            <>
              {/* Logo URL */}
              <TextField
                label={t('logos.form.logoUrl')}
                value={formData.logoUrl}
                onChange={(e) => onFormChange('logoUrl', e.target.value)}
                fullWidth
                error={!!getFieldError('logoUrl')}
                helperText={getFieldError('logoUrl')}
              />

              {/* Filename */}
              <TextField
                label={t('logos.form.filename')}
                value={formData.filename}
                onChange={(e) => onFormChange('filename', e.target.value)}
                fullWidth
                error={!!getFieldError('filename')}
                helperText={getFieldError('filename')}
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
            </>
          )}

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
                  {option.label}
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
    </Dialog>
  );
};
