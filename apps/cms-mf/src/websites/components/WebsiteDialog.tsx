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
  Chip,
  Divider,
  Card,
  CardContent,
  Link,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations'; // Initialize websites translations
import { Settings, Eye, Edit, Plus, Globe, Tag, Hash, CheckCircle2, XCircle } from 'lucide-react';
import type { WebsiteFormData, WebsiteActionType } from '../types/website.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface WebsiteDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: WebsiteActionType;
  formData: WebsiteFormData;
  onFormChange: (field: keyof WebsiteFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

export const WebsiteDialog = ({
  open,
  onClose,
  actionType,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: WebsiteDialogProps) => {
  const { t } = useTranslation();

  const getDialogTitle = () => {
    switch (actionType) {
      case 'view':
        return t('websites.view');
      case 'edit':
        return t('websites.edit');
      case 'create':
        return t('websites.create');
      default:
        return t('websites.title');
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

  const handleFormChange = (field: keyof WebsiteFormData, value: any) => {
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
        {isReadOnly ? (
          /* View Mode - Beautiful Card Layout */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Card with Logo and Name */}
            <Card 
              elevation={0}
              sx={{ 
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {formData.logoUrl ? (
                    <Avatar
                      src={formData.logoUrl}
                      alt={formData.name}
                      sx={{ width: 64, height: 64 }}
                      variant="rounded"
                    />
                  ) : (
                    <Avatar
                      sx={{ 
                        width: 64, 
                        height: 64,
                        bgcolor: 'primary.main',
                      }}
                      variant="rounded"
                    >
                      <Globe size={32} />
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {formData.name}
                    </Typography>
                    <Link
                      href={formData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      <Globe size={14} />
                      <Typography variant="body2">{formData.url}</Typography>
                    </Link>
                  </Box>
                  <Chip
                    icon={formData.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    label={formData.isActive ? t('websites.status.active') : t('websites.status.inactive')}
                    color={formData.isActive ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Description Card */}
            {formData.description && (
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                    {formData.description}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Details Grid */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                  Details
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                  {/* Language */}
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                      Language
                    </Typography>
                    <Chip 
                      label={LANGUAGE_OPTIONS.find(opt => opt.value === formData.lang)?.label || formData.lang} 
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {/* Display Order */}
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                      Display Order
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Hash size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.displayOrder}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tags */}
                  {formData.tags && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {formData.tags.split(',').map((tag) => {
                          const trimmedTag = tag.trim();
                          return (
                            <Chip
                              key={trimmedTag}
                              icon={<Tag size={14} />}
                              label={trimmedTag}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          /* Edit/Create Mode - Form Layout */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information Section */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                {t('websites.form.basicInformation') || 'Basic Information'}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Website Name */}
                <TextField
                  label={t('websites.form.name')}
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder={t('websites.form.namePlaceholder')}
                  error={!!getFieldError('name')}
                  helperText={getFieldError('name') || 'Enter a unique website name'}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  }}
                />

                {/* Website URL */}
                <TextField
                  label={t('websites.form.url')}
                  value={formData.url}
                  onChange={(e) => handleFormChange('url', e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder={t('websites.form.urlPlaceholder')}
                  error={!!getFieldError('url')}
                  helperText={getFieldError('url') || 'Enter the website URL'}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  }}
                />

                {/* Logo URL */}
                <TextField
                  label={t('websites.form.logoUrl')}
                  value={formData.logoUrl}
                  onChange={(e) => handleFormChange('logoUrl', e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder={t('websites.form.logoUrlPlaceholder')}
                  error={!!getFieldError('logoUrl')}
                  helperText={getFieldError('logoUrl') || 'Enter the logo URL (optional)'}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  }}
                />

                {/* Description */}
                <TextField
                  label={t('websites.form.description')}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder={t('websites.form.descriptionPlaceholder')}
                  error={!!getFieldError('description')}
                  helperText={getFieldError('description') || 'Enter website description'}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  }}
                />

                {/* Tags */}
                <TextField
                  label={t('websites.form.tags')}
                  value={formData.tags}
                  onChange={(e) => handleFormChange('tags', e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder={t('websites.form.tagsPlaceholder')}
                  error={!!getFieldError('tags')}
                  helperText={getFieldError('tags') || 'Enter tags separated by commas'}
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
                    {t('websites.form.lang')}
                  </FormLabel>
                  <Select
                    value={formData.lang}
                    onChange={(e) => handleFormChange('lang', e.target.value)}
                    displayEmpty
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      {t('websites.form.langPlaceholder')}
                    </MenuItem>
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

                {/* Display Order */}
                <TextField
                  label={t('websites.form.displayOrder')}
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => handleFormChange('displayOrder', parseInt(e.target.value) || 0)}
                  fullWidth
                  variant="outlined"
                  placeholder={t('websites.form.displayOrderPlaceholder')}
                  error={!!getFieldError('displayOrder')}
                  helperText={getFieldError('displayOrder') || 'Enter display order (default: 0)'}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider />

            {/* Settings Section */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                {t('websites.form.settings') || 'Settings'}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Active Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {t('websites.form.isActive')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Active websites are visible to users
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', ml: 0 }}
                />
              </Box>
            </Box>

            {/* Show validation errors */}
            {Object.keys(formErrors).length > 0 && (
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
        )}
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
          {isReadOnly ? t('common.close') : t('websites.actions.cancel')}
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
              return t('websites.actions.save');
            })()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};