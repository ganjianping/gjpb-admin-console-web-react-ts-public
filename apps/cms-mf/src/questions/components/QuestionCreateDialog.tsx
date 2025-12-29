import { useState, useMemo } from 'react';
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { QuestionFormData } from '../types/question.types';
import { LANGUAGE_OPTIONS, QUESTION_TAG_SETTING_KEY } from '../constants';
import { questionService } from '../services/questionService';
import TiptapTextEditor from '../../../../shared-lib/src/ui-components/rich-text/tiptap/tiptapTextEditor';

interface QuestionCreateDialogProps {
  open: boolean;
  onClose: () => void;
  formData: QuestionFormData;
  onFormChange: (field: keyof QuestionFormData, value: any) => void;
  loading?: boolean;
  formErrors?: Record<string, string[] | string>;
  onReset?: () => void;
  onCreated?: () => Promise<void> | void;
}

const QuestionCreateDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  loading,
  onReset,
  onCreated,
}: QuestionCreateDialogProps) => {
  const { t, i18n } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const tagSetting = appSettings.find((s) => s.name === QUESTION_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[QuestionCreateDialog] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const handleTagsChange = (e: any) => {
    const value = e.target.value as string[];
    onFormChange('tags', value.join(','));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await questionService.createQuestion(formData);
      if (onCreated) await onCreated();
      if (onReset) onReset();
      onClose();
    } catch (error) {
      console.error('Failed to create question', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('questions.create')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label={t('questions.fields.question')}
            value={formData.question}
            onChange={(e) => onFormChange('question', e.target.value)}
            fullWidth
            required
            multiline
            rows={2}
          />
          <TiptapTextEditor
            value={formData.answer}
            onChange={(html: string) => onFormChange('answer', html)}
            placeholder={t('questions.fields.answer')}
          />
          <FormControl fullWidth>
            <Typography variant="caption" sx={{ mb: 0.5 }}>{t('questions.fields.tags')}</Typography>
            <Select
              multiple
              value={formData.tags ? formData.tags.split(',').filter(Boolean) : []}
              onChange={handleTagsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) && selected.map((v) => <Chip key={v} label={v} size="small" />)}
                </Box>
              )}
            >
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No tags</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Typography variant="caption" sx={{ mb: 0.5 }}>{t('questions.fields.language')}</Typography>
            <Select
              value={formData.lang}
              onChange={(e) => onFormChange('lang', e.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('questions.fields.displayOrder')}
            type="number"
            value={formData.displayOrder}
            onChange={(e) => onFormChange('displayOrder', Number(e.target.value))}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => onFormChange('isActive', e.target.checked)}
              />
            }
            label={t('questions.fields.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting || loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || loading}>
          {t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionCreateDialog;
