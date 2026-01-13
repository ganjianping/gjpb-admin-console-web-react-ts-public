import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SentenceRuFormData } from '../types/sentenceRu.types';
import { LANGUAGE_OPTIONS, DIFFICULTY_LEVEL_OPTIONS } from '../constants';

interface SentenceRuEditDialogProps {
  open: boolean;
  formData: SentenceRuFormData;
  loading?: boolean;
  onFormChange: (field: keyof SentenceRuFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

const SentenceRuEditDialog: React.FC<SentenceRuEditDialogProps> = ({
  open,
  formData,
  loading,
  onFormChange,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (err) {
      console.error('Failed to update sentence', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('sentenceRus.edit')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('sentenceRus.form.name')}
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('sentenceRus.form.phonetic')}
              value={formData.phonetic}
              onChange={(e) => onFormChange('phonetic', e.target.value)}
              fullWidth
            />
            <TextField
              label={t('sentenceRus.form.translation')}
              value={formData.translation}
              onChange={(e) => onFormChange('translation', e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label={t('sentenceRus.form.explanation')}
            value={formData.explanation}
            onChange={(e) => onFormChange('explanation', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel>{t('sentenceRus.form.lang')}</FormLabel>
              <Select
                value={formData.lang}
                onChange={(e) => onFormChange('lang', e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>{t('sentenceRus.form.difficultyLevel')}</FormLabel>
              <Select
                value={formData.difficultyLevel}
                onChange={(e) => onFormChange('difficultyLevel', e.target.value)}
              >
                {DIFFICULTY_LEVEL_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('sentenceRus.form.tags')}
              value={formData.tags}
              onChange={(e) => onFormChange('tags', e.target.value)}
              fullWidth
            />
            <TextField
              label={t('sentenceRus.form.displayOrder')}
              value={formData.displayOrder}
              onChange={(e) => onFormChange('displayOrder', Number(e.target.value))}
              type="number"
              fullWidth
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={(e) => onFormChange('isActive', e.target.checked)}
              />
            }
            label={t('sentenceRus.form.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SentenceRuEditDialog;
