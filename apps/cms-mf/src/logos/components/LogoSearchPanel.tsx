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
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Info Text */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            💡 Filters are applied instantly as you type. Click "Search from API" to fetch fresh data from server.
          </Typography>

          {/* Search Fields Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            {/* Name Search */}
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                {t('logos.filters.searchByName')}
              </FormLabel>
              <TextField
                size="small"
                placeholder={t('logos.filters.searchByName')}
                value={searchFormData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                disabled={loading}
              />
            </FormControl>

            {/* Language Filter */}
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                {t('logos.filters.language')}
              </FormLabel>
              <Select
                size="small"
                value={searchFormData.lang}
                onChange={(e) => onFormChange('lang', e.target.value)}
                disabled={loading}
                displayEmpty
              >
                <MenuItem value="">{t('logos.filters.all')}</MenuItem>
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Tags Filter */}
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                {t('logos.filters.tags')}
              </FormLabel>
              <Select
                size="small"
                value={searchFormData.tags}
                onChange={(e) => onFormChange('tags', e.target.value)}
                disabled={loading}
                displayEmpty
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>{t('logos.filters.all')}</em>;
                  }
                  return <Chip label={selected} size="small" />;
                }}
              >
                <MenuItem value="">{t('logos.filters.all')}</MenuItem>
                {availableTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                {t('logos.filters.status')}
              </FormLabel>
              <Select
                size="small"
                value={searchFormData.isActive}
                onChange={(e) => onFormChange('isActive', e.target.value)}
                disabled={loading}
                displayEmpty
              >
                <MenuItem value="">{t('logos.filters.all')}</MenuItem>
                <MenuItem value="true">{t('logos.filters.activeOnly')}</MenuItem>
                <MenuItem value="false">{t('logos.filters.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onClear}
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 2,
              }}
            >
              {t('logos.clearFilters')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Search size={16} />}
              onClick={onSearch}
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Search from API
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
