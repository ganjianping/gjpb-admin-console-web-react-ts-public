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
  Typography,
  useTheme,
} from '@mui/material';
import { Search } from 'lucide-react';
import type { FillBlankQuestionRuSearchFormData } from '../types/fillBlankQuestionRu.types';
import { 
  FILL_BLANK_QUESTION_TAG_SETTING_KEY, 
  LANGUAGE_OPTIONS, 
  DIFFICULTY_LEVEL_OPTIONS,
  FILL_BLANK_QUESTION_LANG_SETTING_KEY,
  FILL_BLANK_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY
} from '../constants';

interface FillBlankQuestionRuSearchPanelProps {
  searchFormData: FillBlankQuestionRuSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof FillBlankQuestionRuSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

const FillBlankQuestionRuSearchPanel: React.FC<FillBlankQuestionRuSearchPanelProps> = ({
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
      const tagSetting = appSettings.find((s) => s.name === FILL_BLANK_QUESTION_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[FillBlankQuestionRuSearchPanel] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableLangOptions = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return LANGUAGE_OPTIONS;
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const langSetting =
        appSettings.find((s) => s.name === FILL_BLANK_QUESTION_LANG_SETTING_KEY && s.lang === currentLang) ||
        appSettings.find((s) => s.name === FILL_BLANK_QUESTION_LANG_SETTING_KEY);
      if (!langSetting) return LANGUAGE_OPTIONS;
      return langSetting.value.split(',').map((item) => {
        const [code, label] = item.split(':').map((s) => s.trim());
        if (label) return { value: code, label };
        const fallback = LANGUAGE_OPTIONS.find((o) => o.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (err) {
      console.error('[FillBlankQuestionRuSearchPanel] Error loading lang options:', err);
      return LANGUAGE_OPTIONS;
    }
  }, [i18n.language]);

  const availableDifficultyOptions = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return DIFFICULTY_LEVEL_OPTIONS;
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const difficultySetting =
        appSettings.find((s) => s.name === FILL_BLANK_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang) ||
        appSettings.find((s) => s.name === FILL_BLANK_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY);
      if (!difficultySetting) return DIFFICULTY_LEVEL_OPTIONS;
      return difficultySetting.value.split(',').map((item) => {
        const [code, label] = item.split(':').map((s) => s.trim());
        if (label) return { value: code, label };
        const fallback = DIFFICULTY_LEVEL_OPTIONS.find((o) => o.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (err) {
      console.error('[FillBlankQuestionRuSearchPanel] Error loading difficulty options:', err);
      return DIFFICULTY_LEVEL_OPTIONS;
    }
  }, [i18n.language]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(32, 32, 32, 0.98) 50%, rgba(24, 24, 24, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 50%, rgba(241, 245, 249, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(25, 118, 210, 0.15)',
        mb: 2,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(25,118,210,0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: 'primary.main',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #64b5f6 0%, #42a5f5 50%, #1976d2 100%)'
            : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.primary',
          }}
        >
          <Search size={20} />
          {t('fillBlankQuestionRus.search')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              {t('fillBlankQuestionRus.filters.searchByQuestion')}
            </FormLabel>
            <TextField
              size="small"
              placeholder={t('fillBlankQuestionRus.filters.searchByQuestion')}
              value={searchFormData.question || ''}
              onChange={(e) => onFormChange('question', e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)',
                  },
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              {t('fillBlankQuestionRus.form.lang')}
            </FormLabel>
            <Select
              size="small"
              value={searchFormData.lang || ''}
              onChange={(e) => onFormChange('lang', e.target.value)}
              disabled={loading}
              displayEmpty
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)',
                },
              }}
            >
              <MenuItem value="">{t('fillBlankQuestionRus.filters.all')}</MenuItem>
              {availableLangOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              {t('fillBlankQuestionRus.form.tags')}
            </FormLabel>
            <Select
              size="small"
              value={searchFormData.tags || ''}
              onChange={(e) => onFormChange('tags', e.target.value)}
              disabled={loading}
              displayEmpty
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)',
                },
              }}
            >
              <MenuItem value="">{t('fillBlankQuestionRus.filters.all')}</MenuItem>
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              {t('fillBlankQuestionRus.form.difficultyLevel')}
            </FormLabel>
            <Select
              size="small"
              value={searchFormData.difficultyLevel || ''}
              onChange={(e) => onFormChange('difficultyLevel', e.target.value)}
              disabled={loading}
              displayEmpty
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)',
                },
              }}
            >
              <MenuItem value="">{t('fillBlankQuestionRus.filters.all')}</MenuItem>
              {availableDifficultyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
              {t('fillBlankQuestionRus.form.status')}
            </FormLabel>
            <Select
              size="small"
              value={searchFormData.isActive || ''}
              onChange={(e) => onFormChange('isActive', e.target.value)}
              disabled={loading}
              displayEmpty
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 12px rgba(25, 118, 210, 0.15)',
                },
              }}
            >
              <MenuItem value="">{t('fillBlankQuestionRus.filters.all')}</MenuItem>
              <MenuItem value="true">{t('fillBlankQuestionRus.status.active')}</MenuItem>
              <MenuItem value="false">{t('fillBlankQuestionRus.status.inactive')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onClear}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {t('fillBlankQuestionRus.clearFilters')}
          </Button>
          <Button
            variant="contained"
            startIcon={<Search size={16} />}
            onClick={onSearch}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              },
            }}
          >
            {t('common.search')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FillBlankQuestionRuSearchPanel;
