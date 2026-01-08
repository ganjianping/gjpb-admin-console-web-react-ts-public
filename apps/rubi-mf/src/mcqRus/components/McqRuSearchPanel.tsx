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
import type { McqRuSearchFormData } from '../types/mcqRu.types';
import { MCQRU_TAG_SETTING_KEY, LANGUAGE_OPTIONS, MCQRU_LANG_SETTING_KEY } from '../constants';

interface McqRuSearchPanelProps {
  searchFormData: McqRuSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof McqRuSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

const McqRuSearchPanel: React.FC<McqRuSearchPanelProps> = ({
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
      const tagSetting = appSettings.find((s) => s.name === MCQRU_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[McqRuSearchPanel] Error loading tags:', err);
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
        appSettings.find((s) => s.name === MCQRU_LANG_SETTING_KEY && s.lang === currentLang) ||
        appSettings.find((s) => s.name === MCQRU_LANG_SETTING_KEY);
      if (!langSetting) return LANGUAGE_OPTIONS;
      return langSetting.value.split(',').map((item) => {
        const [code, label] = item.split(':').map((s) => s.trim());
        if (label) return { value: code, label };
        const fallback = LANGUAGE_OPTIONS.find((o) => o.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (err) {
      console.error('[McqRuSearchPanel] Error loading lang options:', err);
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
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite',
        },
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <Search
            size={20}
            style={{
              marginRight: '8px',
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant='h6'
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('mcqRus.searchFilters')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 2.5,
          }}
        >
          <FormControl fullWidth>
            <FormLabel
              sx={{
                mb: 0.75,
                fontWeight: 600,
                fontSize: '0.813rem',
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              {t('mcqRus.question')}
            </FormLabel>
            <TextField
              size='small'
              placeholder={t('mcqRus.searchByQuestion')}
              value={searchFormData.question || ''}
              onChange={(e) => onFormChange('question', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 2px 12px rgba(25, 118, 210, 0.25)',
                  },
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel
              sx={{
                mb: 0.75,
                fontWeight: 600,
                fontSize: '0.813rem',
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              {t('mcqRus.language')}
            </FormLabel>
            <Select
              size='small'
              value={searchFormData.lang || ''}
              onChange={(e) => onFormChange('lang', e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 12px rgba(25, 118, 210, 0.25)',
                },
              }}
            >
              <MenuItem value=''>
                <em>{t('common.all')}</em>
              </MenuItem>
              {availableLangOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel
              sx={{
                mb: 0.75,
                fontWeight: 600,
                fontSize: '0.813rem',
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              {t('mcqRus.tags')}
            </FormLabel>
            <Select
              size='small'
              value={searchFormData.tags || ''}
              onChange={(e) => onFormChange('tags', e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 12px rgba(25, 118, 210, 0.25)',
                },
              }}
            >
              <MenuItem value=''>
                <em>{t('common.all')}</em>
              </MenuItem>
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  <Chip label={tag} size='small' sx={{ height: 22 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel
              sx={{
                mb: 0.75,
                fontWeight: 600,
                fontSize: '0.813rem',
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              {t('mcqRus.statusLabel')}
            </FormLabel>
            <Select
              size='small'
              value={searchFormData.isActive ?? ''}
              onChange={(e) => onFormChange('isActive', e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 2px 12px rgba(25, 118, 210, 0.25)',
                },
              }}
            >
              <MenuItem value=''>
                <em>{t('common.all')}</em>
              </MenuItem>
              <MenuItem value='true'>{t('common.active')}</MenuItem>
              <MenuItem value='false'>{t('common.inactive')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            variant='outlined'
            onClick={onClear}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
              color: theme.palette.text.secondary,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {t('common.clear')}
          </Button>
          <Button
            variant='contained'
            startIcon={<Search size={16} />}
            onClick={onSearch}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
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

export default McqRuSearchPanel;
