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
  OutlinedInput,
} from '@mui/material';
import { Search } from 'lucide-react';
import type { ArticleRuSearchFormData } from '../types/articleRu.types';
import { ARTICLE_TAG_SETTING_KEY, LANGUAGE_OPTIONS, ARTICLE_LANG_SETTING_KEY } from '../constants';

interface ArticleRuSearchPanelProps {
  searchFormData: ArticleRuSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof ArticleRuSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

const ArticleRuSearchPanel: React.FC<ArticleRuSearchPanelProps> = ({
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
      const tagSetting = appSettings.find((s) => s.name === ARTICLE_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[ArticleRuSearchPanel] Error loading tags:', err);
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
        appSettings.find((s) => s.name === ARTICLE_LANG_SETTING_KEY && s.lang === currentLang) ||
        appSettings.find((s) => s.name === ARTICLE_LANG_SETTING_KEY);
      if (!langSetting) return LANGUAGE_OPTIONS;
      return langSetting.value.split(',').map((item) => {
        const [code, label] = item.split(':').map((s) => s.trim());
        if (label) return { value: code, label };
        const fallback = LANGUAGE_OPTIONS.find((o) => o.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (err) {
      console.error('[ArticleRuSearchPanel] Error loading lang options:', err);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant='subtitle1'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 600,
              color: 'primary.main',
              fontSize: '1rem',
              '& svg': { color: 'primary.main' },
            }}
          >
            <Search size={18} />
            {t('articleRus.search')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant='outlined'
              size='small'
              onClick={onClear}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                fontSize: '0.875rem',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              {t('articleRus.clearFilters')}
            </Button>
            <Button
              variant='contained'
              size='small'
              onClick={onSearch}
              disabled={loading}
              startIcon={<Search size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 2.5,
                py: 0.75,
                fontSize: '0.875rem',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                },
              }}
            >
              {t('common.search')}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2.5,
          }}
        >
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('articleRus.form.title')}
            </FormLabel>
            <TextField
              fullWidth
              size='small'
              value={searchFormData.title || ''}
              onChange={(e) => onFormChange('title', e.target.value)}
              placeholder={t('articleRus.filters.searchByTitle')}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('articleRus.form.lang')}
            </FormLabel>
            <FormControl fullWidth size='small'>
              <Select
                value={searchFormData.lang || ''}
                onChange={(e) => onFormChange('lang', e.target.value)}
                disabled={loading}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=''>{t('articleRus.filters.all')}</MenuItem>
                {availableLangOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(`articleRus.languages.${option.value}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('articleRus.form.tags')}
            </FormLabel>
            <FormControl fullWidth size='small'>
              <Select<string[]>
                multiple
                value={searchFormData.tags ? searchFormData.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []}
                onChange={(e) => {
                  const value = e.target.value;
                  const tagsArray = typeof value === 'string' ? value.split(',') : value;
                  onFormChange('tags', tagsArray.join(','));
                }}
                input={<OutlinedInput />}
                displayEmpty
                disabled={loading}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography variant='body2' color='text.disabled'>{t('articleRus.filters.all')}</Typography>;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((v) => (
                        <Chip key={v} label={v} size='small' />
                      ))}
                    </Box>
                  );
                }}
                sx={{ borderRadius: 2 }}
              >
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <Typography variant='body2' color='text.secondary'>
                      No tags available
                    </Typography>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('articleRus.form.status')}
            </FormLabel>
            <FormControl fullWidth size='small'>
              <Select
                value={searchFormData.isActive || ''}
                onChange={(e) => onFormChange('isActive', e.target.value)}
                disabled={loading}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=''>{t('articleRus.filters.all')}</MenuItem>
                <MenuItem value='true'>{t('articleRus.status.active')}</MenuItem>
                <MenuItem value='false'>{t('articleRus.status.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ArticleRuSearchPanel;
