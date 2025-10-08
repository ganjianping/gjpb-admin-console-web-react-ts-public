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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import { Edit, Plus } from 'lucide-react';
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
  const { t } = useTranslation();

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

          {/* Original URL */}
          <TextField
            label={t('logos.form.originalUrl')}
            value={formData.originalUrl}
            onChange={(e) => onFormChange('originalUrl', e.target.value)}
            fullWidth
            error={!!getFieldError('originalUrl')}
            helperText={getFieldError('originalUrl')}
          />

          {/* Tags */}
          <TextField
            label={t('logos.form.tags')}
            value={formData.tags}
            onChange={(e) => onFormChange('tags', e.target.value)}
            fullWidth
            error={!!getFieldError('tags')}
            helperText={getFieldError('tags')}
          />

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
