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
import type { LogoSearchFormData } from '../types/logo.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface LogoSearchPanelProps {
  searchFormData: LogoSearchFormData;
  loading: boolean;
  onFormChange: (field: keyof LogoSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const LogoSearchPanel: React.FC<LogoSearchPanelProps> = ({
  searchFormData,
  loading,
  onFormChange,
  onSearch,
  onClear,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // Get logo tags from local storage filtered by current language
  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [];

      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      
      const logoTagsSetting = appSettings.find(
        (setting) => setting.name === 'logo_tags' && setting.lang === currentLang
      );

      if (!logoTagsSetting) return [];

      return logoTagsSetting.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    } catch (error) {
      console.error('[LogoSearchPanel] Error loading tags:', error);
      return [];
    }
  }, [i18n.language]);
  
  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 3, 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(32, 32, 32, 0.98) 50%, rgba(24, 24, 24, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 50%, rgba(241, 245, 249, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.12)' 
          : 'rgba(25, 118, 210, 0.15)',
        mb: 2,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
          : '0 4px 20px rgba(25, 118, 210, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
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
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.06) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.02) 0%, transparent 50%)',
          zIndex: 0,
          pointerEvents: 'none',
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 2, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 600,
              color: 'primary.main',
              fontSize: '1rem',
              '& svg': {
                color: 'primary.main',
              }
            }}
          >
            <Search size={18} />
            {t('logos.search')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
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
              {t('logos.clearFilters')}
            </Button>
            
            <Button
              variant="contained"
              size="small"
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

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          }, 
          gap: 2.5 
        }}>
          {/* Name */}
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('logos.form.name')}
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              value={searchFormData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder={t('logos.filters.searchByName')}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                },
              }}
            />
          </Box>

          {/* Language */}
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('logos.form.lang')}
            </FormLabel>
            <FormControl fullWidth size="small">
              <Select
                value={searchFormData.lang}
                onChange={(e) => onFormChange('lang', e.target.value)}
                disabled={loading}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <MenuItem value="">{t('logos.filters.all')}</MenuItem>
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(`logos.languages.${option.value}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Tags */}
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('logos.form.tags')}
            </FormLabel>
            <FormControl fullWidth size="small">
              <Select<string[]>
                multiple
                value={searchFormData.tags ? searchFormData.tags.split(',').map(t => t.trim()).filter(Boolean) : []}
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
                    return (
                      <Typography variant="body2" color="text.disabled">
                        {t('logos.filters.all')}
                      </Typography>
                    );
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  );
                }}
                sx={{
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                }}
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
                      No tags available
                    </Typography>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Status */}
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('logos.form.status') || 'Status'}
            </FormLabel>
            <FormControl fullWidth size="small">
              <Select
                value={searchFormData.isActive}
                onChange={(e) => onFormChange('isActive', e.target.value)}
                disabled={loading}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <MenuItem value="">{t('logos.filters.all')}</MenuItem>
                <MenuItem value="true">{t('logos.status.active')}</MenuItem>
                <MenuItem value="false">{t('logos.status.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
