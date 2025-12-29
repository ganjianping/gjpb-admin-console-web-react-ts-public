import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { Search } from 'lucide-react';
import type { QuestionSearchFormData } from '../types/question.types';
import { LANGUAGE_OPTIONS, QUESTION_TAG_SETTING_KEY } from '../constants';

interface QuestionSearchPanelProps {
  searchFormData: QuestionSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof QuestionSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

const QuestionSearchPanel: React.FC<QuestionSearchPanelProps> = ({
  searchFormData,
  loading,
  onFormChange,
  onSearch,
  onClear,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

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
      console.error('[QuestionSearchPanel] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#fff',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
          <FormControl fullWidth size='small'>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('questions.fields.question')}</FormLabel>
            <TextField
              size='small'
              placeholder={t('questions.placeholders.searchQuestion')}
              value={searchFormData.question || ''}
              onChange={(e) => onFormChange('question', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </FormControl>

          <FormControl fullWidth size='small'>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('questions.fields.language')}</FormLabel>
            <Select
              value={searchFormData.lang || ''}
              onChange={(e) => onFormChange('lang', e.target.value)}
              displayEmpty
              sx={{ borderRadius: 1.5 }}
            >
              <MenuItem value=''>{t('common.all')}</MenuItem>
              {LANGUAGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size='small'>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('questions.fields.tags')}</FormLabel>
            <Select
              value={searchFormData.tags || ''}
              onChange={(e) => onFormChange('tags', e.target.value)}
              displayEmpty
              sx={{ borderRadius: 1.5 }}
            >
              <MenuItem value=''>{t('common.all')}</MenuItem>
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size='small'>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('questions.fields.status')}</FormLabel>
            <Select
              value={searchFormData.isActive ?? ''}
              onChange={(e) => onFormChange('isActive', e.target.value)}
              displayEmpty
              sx={{ borderRadius: 1.5 }}
            >
              <MenuItem value=''>{t('common.all')}</MenuItem>
              <MenuItem value='true'>{t('common.active')}</MenuItem>
              <MenuItem value='false'>{t('common.inactive')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant='outlined'
            onClick={onClear}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            {t('common.clear')}
          </Button>
          <Button
            variant='contained'
            onClick={onSearch}
            disabled={loading}
            startIcon={<Search size={18} />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
            }}
          >
            {loading ? t('common.searching') : t('common.search')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionSearchPanel;
