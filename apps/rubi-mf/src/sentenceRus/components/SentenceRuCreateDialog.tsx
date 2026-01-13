import React, { useMemo } from 'react';
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
  OutlinedInput,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SentenceRuFormData } from '../types/sentenceRu.types';
import { LANGUAGE_OPTIONS, DIFFICULTY_LEVEL_OPTIONS, SENTENCE_RU_TAG_SETTING_KEY, SENTENCE_RU_DIFFICULTY_LEVEL_SETTING_KEY } from '../constants';

interface SentenceRuCreateDialogProps {
  open: boolean;
  formData: SentenceRuFormData;
  loading?: boolean;
  onFormChange: (field: keyof SentenceRuFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

const SentenceRuCreateDialog: React.FC<SentenceRuCreateDialogProps> = ({
  open,
  formData,
  loading,
  onFormChange,
  onSubmit,
  onClose,
}) => {
  const { t, i18n } = useTranslation();

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const tagSetting = appSettings.find((s) => s.name === SENTENCE_RU_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[SentenceRuCreateDialog] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableDifficultyLevels = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const difficultyLevelSetting = appSettings.find((s) => s.name === SENTENCE_RU_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang);
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[SentenceRuCreateDialog] Error loading difficulty levels:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const handleTagsChange = (e: any) => {
    const value = e.target.value as string[];
    onFormChange('tags', value.join(','));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (err) {
      console.error('Failed to create sentence', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('sentenceRus.create')}</DialogTitle>
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
                {(availableDifficultyLevels.length > 0 ? availableDifficultyLevels : DIFFICULTY_LEVEL_OPTIONS.map(opt => opt.value)).map((level) => (
                  <MenuItem key={level} value={level}>
                    {availableDifficultyLevels.length > 0 ? level : t(`sentenceRus.difficultyLevels.${level}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <FormLabel>{t('sentenceRus.form.tags')}</FormLabel>
            <Select
              multiple
              value={formData.tags ? formData.tags.split(',').filter(Boolean) : []}
              onChange={handleTagsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) && selected.map((v) => (
                    <Chip key={v} label={v} size="small" />
                  ))}
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

          <TextField
            label={t('sentenceRus.form.displayOrder')}
            value={formData.displayOrder}
            onChange={(e) => onFormChange('displayOrder', Number(e.target.value))}
            type="number"
            fullWidth
          />

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
          {t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SentenceRuCreateDialog;
