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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import '../i18n/translations';
import { Save } from 'lucide-react';
import type { FileFormData } from '../types/file.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface FileEditDialogProps {
  open: boolean;
  onClose: () => void;
  formData: FileFormData;
  onFormChange: (field: keyof FileFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

const FileEditDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: FileEditDialogProps) => {
  const { t, i18n } = useTranslation();

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const fileTagsSetting = appSettings.find(
        (setting) => setting.name === 'file_tags' && setting.lang === currentLang
      );
      if (!fileTagsSetting) return [];
      return fileTagsSetting.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    } catch (error) {
      console.error('[FileEditDialog] Error loading tags:', error);
      return [];
    }
  }, [i18n.language]);

  const availableLangOptions = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return LANGUAGE_OPTIONS;
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const langSetting =
        appSettings.find((s) => s.name === 'lang' && s.lang === currentLang) ||
        appSettings.find((s) => s.name === 'lang');
      if (!langSetting) return LANGUAGE_OPTIONS;
      return langSetting.value.split(',').map((item) => {
        const [code, label] = item.split(':').map((s) => s.trim());
        if (label) return { value: code, label };
        const fallback = LANGUAGE_OPTIONS.find((opt) => opt.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (error) {
      console.error('[FileEditDialog] Error loading lang options:', error);
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

  const [localSaving, setLocalSaving] = useState(false);

  useEffect(() => {
    if (!loading) setLocalSaving(false);
  }, [loading]);

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
      {loading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <LinearProgress />
        </Box>
      )}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: loading ? 3 : 2 }}>
        <Save size={20} />
        <Typography variant="h6" component="span">
          {t('files.edit')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            label={t('files.form.name')}
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            fullWidth
            error={!!getFieldError('name')}
            helperText={getFieldError('name')}
          />
          <TextField
            label={t('files.form.sourceName')}
            value={formData.sourceName}
            onChange={(e) => onFormChange('sourceName', e.target.value)}
            fullWidth
            error={!!getFieldError('sourceName')}
            helperText={getFieldError('sourceName')}
          />
          {/* filename, extension, mime type and size are shown below as read-only metadata */}
          <TextField
            label={t('files.form.originalUrl')}
            value={formData.originalUrl}
            onChange={(e) => onFormChange('originalUrl', e.target.value)}
            fullWidth
            error={!!getFieldError('originalUrl')}
            helperText={getFieldError('originalUrl')}
          />
          <FormControl fullWidth error={!!getFieldError('tags')}>
            <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>
              {t('files.form.tags')}
            </FormLabel>
            <Select<string[]>
              multiple
              value={formData.tags ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []}
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
              sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '2px' } }}
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
                    {t('files.form.noTags')}
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
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>
              {t('files.form.lang')}
            </FormLabel>
            <Select
              value={formData.lang}
              onChange={(e) => onFormChange('lang', e.target.value)}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              {availableLangOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label={t('files.form.displayOrder')}
              type="number"
              value={formData.displayOrder}
              onChange={(e) => onFormChange('displayOrder', Number(e.target.value))}
              sx={{ flex: 1, minWidth: 160 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => onFormChange('isActive', e.target.checked)}
                />
              }
              label={t('files.form.isActive')}
            />
          </Box>

          {/* Read-only file metadata moved below editable fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            <TextField
              label={t('files.form.filename')}
              value={formData.filename}
              disabled
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('files.form.extension')}
                value={formData.extension}
                disabled
                sx={{ flex: 1, minWidth: 160 }}
              />
              <TextField
                label={t('files.form.mimeType')}
                value={formData.mimeType}
                disabled
                sx={{ flex: 1, minWidth: 160 }}
              />
            </Box>
            <TextField
              label={t('files.form.sizeBytes')}
              type="number"
              value={formData.sizeBytes}
              disabled
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => {
            onClose();
          }}
          disabled={loading}
        >
          {t('files.actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setLocalSaving(true);
            onSubmit();
          }}
          disabled={loading}
        >
          {localSaving ? t('files.messages.savingFile') : t('files.actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileEditDialog;
