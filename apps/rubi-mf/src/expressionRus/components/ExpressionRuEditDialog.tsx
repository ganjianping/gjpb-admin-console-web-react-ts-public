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
import { TiptapTextEditor } from '../../../../shared-lib/src/ui-components';
import type { ExpressionRuFormData } from '../types/expressionRu.types';
import { LANGUAGE_OPTIONS, DIFFICULTY_LEVEL_OPTIONS, EXPRESSION_RU_TAG_SETTING_KEY, EXPRESSION_RU_DIFFICULTY_LEVEL_SETTING_KEY } from '../constants';

interface ExpressionRuEditDialogProps {
  open: boolean;
  formData: ExpressionRuFormData;
  loading?: boolean;
  onFormChange: (field: keyof ExpressionRuFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

const ExpressionRuEditDialog: React.FC<ExpressionRuEditDialogProps> = ({
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
      const tagSetting = appSettings.find((s) => s.name === EXPRESSION_RU_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[ExpressionRuEditDialog] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableDifficultyLevels = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const difficultyLevelSetting = appSettings.find((s) => s.name === EXPRESSION_RU_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang);
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[ExpressionRuEditDialog] Error loading difficulty levels:', err);
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
      console.error('Failed to update expression', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('expressionRus.edit')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('expressionRus.form.name')}
            value={formData.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('expressionRus.form.phonetic')}
              value={formData.phonetic}
              onChange={(e) => onFormChange('phonetic', e.target.value)}
              fullWidth
            />
            <TextField
              label={t('expressionRus.form.translation')}
              value={formData.translation}
              onChange={(e) => onFormChange('translation', e.target.value)}
              fullWidth
            />
          </Box>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('expressionRus.form.explanation')}</FormLabel>
            <TiptapTextEditor
              value={formData.explanation}
              onChange={(value) => onFormChange('explanation', value)}
              placeholder={t('expressionRus.form.explanation')}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('expressionRus.form.example')}</FormLabel>
            <TiptapTextEditor
              value={formData.example}
              onChange={(value) => onFormChange('example', value)}
              placeholder={t('expressionRus.form.example')}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel>{t('expressionRus.form.lang')}</FormLabel>
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
              <FormLabel>{t('expressionRus.form.difficultyLevel')}</FormLabel>
              <Select
                value={formData.difficultyLevel}
                onChange={(e) => onFormChange('difficultyLevel', e.target.value)}
              >
                {(availableDifficultyLevels.length > 0 ? availableDifficultyLevels : DIFFICULTY_LEVEL_OPTIONS.map(opt => opt.value)).map((level) => (
                  <MenuItem key={level} value={level}>
                    {availableDifficultyLevels.length > 0 ? level : t(`expressionRus.difficultyLevels.${level}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>{t('expressionRus.form.term')}</FormLabel>
              <Select
                value={formData.term}
                onChange={(e) => onFormChange('term', Number(e.target.value))}
              >
                {[1, 2, 3, 4].map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>{t('expressionRus.form.week')}</FormLabel>
              <Select
                value={formData.week}
                onChange={(e) => onFormChange('week', Number(e.target.value))}
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((week) => (
                  <MenuItem key={week} value={week}>
                    {week}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <FormLabel>{t('expressionRus.form.tags')}</FormLabel>
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
            label={t('expressionRus.form.displayOrder')}
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
            label={t('expressionRus.form.isActive')}
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

export default ExpressionRuEditDialog;
