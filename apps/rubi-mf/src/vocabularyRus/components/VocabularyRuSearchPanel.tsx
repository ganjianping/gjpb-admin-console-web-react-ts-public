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
  Chip,
} from '@mui/material';
import { Search } from 'lucide-react';
import type { VocabularyRuSearchFormData } from '../types/vocabularyRu.types';
import { VOCABULARY_TAG_SETTING_KEY, LANGUAGE_OPTIONS, VOCABULARY_LANG_SETTING_KEY, DIFFICULTY_LEVEL_OPTIONS } from '../constants';

interface VocabularyRuSearchPanelProps {
  searchFormData: VocabularyRuSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof VocabularyRuSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

const VocabularyRuSearchPanel: React.FC<VocabularyRuSearchPanelProps> = ({
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
      const tagSetting = appSettings.find((s) => s.name === VOCABULARY_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[VocabularyRuSearchPanel] Error loading tags:', err);
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
        appSettings.find((s) => s.name === VOCABULARY_LANG_SETTING_KEY && s.lang === currentLang) ||
        appSettings.find((s) => s.name === VOCABULARY_LANG_SETTING_KEY);
      if (!langSetting) return LANGUAGE_OPTIONS;
      return langSetting.value.split(',').map((item) => {
        const [code, label] = item.split(':').map((s) => s.trim());
        if (label) return { value: code, label };
        const fallback = LANGUAGE_OPTIONS.find((o) => o.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (err) {
      console.error('[VocabularyRuSearchPanel] Error loading lang options:', err);
      return LANGUAGE_OPTIONS;
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
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.06) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.02) 0%, transparent 50%)',
          zIndex: 0,
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 2, p: 3 }}>
        <Typography variant='h6' sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search size={18} />
          {t('vocabularyRus.search')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr' }, gap: 2, mb: 2.5 }}>
          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('vocabularyRus.form.word')}</FormLabel>
            <TextField
              placeholder={t('vocabularyRus.filters.searchByWord')}
              value={searchFormData.word || ''}
              onChange={(e) => onFormChange('word', e.target.value)}
              variant='outlined'
              size='small'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
              }}
            />
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('vocabularyRus.form.lang')}</FormLabel>
            <Select
              value={searchFormData.lang || ''}
              onChange={(e) => onFormChange('lang', e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 1.5,
              }}
            >
              <MenuItem value=''>{t('vocabularyRus.filters.all')}</MenuItem>
              {availableLangOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('vocabularyRus.form.difficultyLevel')}</FormLabel>
            <Select
              value={searchFormData.difficultyLevel || ''}
              onChange={(e) => onFormChange('difficultyLevel', e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 1.5,
              }}
            >
              <MenuItem value=''>{t('vocabularyRus.filters.all')}</MenuItem>
              {DIFFICULTY_LEVEL_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {t(`vocabularyRus.difficultyLevels.${opt.value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('vocabularyRus.form.tags')}</FormLabel>
            <Select
              value={searchFormData.tags || ''}
              onChange={(e) => onFormChange('tags', e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 1.5,
              }}
            >
              <MenuItem value=''>{t('vocabularyRus.filters.all')}</MenuItem>
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  <Chip label={tag} size='small' variant='outlined' />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('vocabularyRus.form.isActive')}</FormLabel>
            <Select
              value={searchFormData.isActive ?? ''}
              onChange={(e) => onFormChange('isActive', e.target.value || null)}
              displayEmpty
              sx={{
                borderRadius: 1.5,
              }}
            >
              <MenuItem value=''>{t('vocabularyRus.filters.all')}</MenuItem>
              <MenuItem value='true'>{t('vocabularyRus.status.active')}</MenuItem>
              <MenuItem value='false'>{t('vocabularyRus.status.inactive')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            variant='outlined'
            onClick={onClear}
            disabled={loading}
            sx={{
              borderRadius: 1.5,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('vocabularyRus.clearFilters')}
          </Button>
          <Button
            variant='contained'
            onClick={onSearch}
            disabled={loading}
            startIcon={<Search size={14} />}
            sx={{
              borderRadius: 1.5,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('common.search')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VocabularyRuSearchPanel;
