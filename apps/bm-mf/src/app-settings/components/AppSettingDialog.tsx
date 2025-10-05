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
  Alert,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations'; // Initialize app settings translations
import { Settings, Eye, Edit, Plus } from 'lucide-react';
import type { AppSettingFormData, AppSettingActionType } from '../types/app-setting.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface AppSettingDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: AppSettingActionType;
  formData: AppSettingFormData;
  onFormChange: (field: keyof AppSettingFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

export const AppSettingDialog = ({
  open,
  onClose,
  actionType,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: AppSettingDialogProps) => {
  const { t } = useTranslation();

  const getDialogTitle = () => {
    switch (actionType) {
      case 'view':
        return t('appSettings.view');
      case 'edit':
        return t('appSettings.edit');
      case 'create':
        return t('appSettings.create');
      default:
        return t('appSettings.title');
    }
  };

  const getDialogIcon = () => {
    switch (actionType) {
      case 'view':
        return <Eye size={20} />;
      case 'edit':
        return <Edit size={20} />;
      case 'create':
        return <Plus size={20} />;
      default:
        return <Settings size={20} />;
    }
  };

  const isReadOnly = actionType === 'view';

  const handleFormChange = (field: keyof AppSettingFormData, value: any) => {
    if (!isReadOnly) {
      onFormChange(field, value);
    }
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
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {getDialogIcon()}
        <Typography variant="h6" component="span">
          {getDialogTitle()}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {t('appSettings.form.basicInformation') || 'Basic Information'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Setting Name */}
              <TextField
                label={t('appSettings.form.name')}
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                fullWidth
                variant="outlined"
                placeholder={t('appSettings.form.namePlaceholder')}
                disabled={isReadOnly}
                error={!!getFieldError('name')}
                helperText={getFieldError('name') || (isReadOnly ? '' : 'Enter a unique setting name')}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                }}
              />

              {/* Setting Value */}
              <TextField
                label={t('appSettings.form.value')}
                value={formData.value}
                onChange={(e) => handleFormChange('value', e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder={t('appSettings.form.valuePlaceholder')}
                disabled={isReadOnly}
                error={!!getFieldError('value')}
                helperText={getFieldError('value') || (isReadOnly ? '' : 'Enter the setting value')}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                }}
              />

              {/* Language */}
              <FormControl fullWidth error={!!getFieldError('lang')}>
                <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>
                  {t('appSettings.form.lang')}
                </FormLabel>
                <Select
                  value={formData.lang}
                  onChange={(e) => handleFormChange('lang', e.target.value)}
                  displayEmpty
                  disabled={isReadOnly}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  }}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {getFieldError('lang') && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {getFieldError('lang')}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Box>

          {/* Settings Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {t('appSettings.form.settings') || 'Settings'}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* System Setting Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isSystem}
                    onChange={(e) => handleFormChange('isSystem', e.target.checked)}
                    disabled={isReadOnly}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t('appSettings.form.isSystem')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      System settings are protected and managed by administrators
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', ml: 0 }}
              />

              {/* Public Setting Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={(e) => handleFormChange('isPublic', e.target.checked)}
                    disabled={isReadOnly}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t('appSettings.form.isPublic')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Public settings are visible to all users
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', ml: 0 }}
              />
            </Box>
          </Box>

          {/* Show validation errors */}
          {Object.keys(formErrors).length > 0 && !isReadOnly && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Please correct the following errors:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {Object.entries(formErrors).map(([field, error]) => (
                  <li key={field}>
                    <Typography variant="body2">
                      {Array.isArray(error) ? error.join(', ') : error}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {isReadOnly ? t('common.close') : t('appSettings.actions.cancel')}
        </Button>
        
        {!isReadOnly && (
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 120,
            }}
          >
            {(() => {
              if (loading) {
                return actionType === 'create' ? 'Creating...' : 'Saving...';
              }
              return t('appSettings.actions.save');
            })()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};