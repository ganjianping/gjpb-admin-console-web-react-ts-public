import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/i18n.config'; // Initialize app settings translations
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
import type { AppSettingSearchFormData } from '../types/app-setting.types';

interface AppSettingSearchPanelProps {
  searchFormData: AppSettingSearchFormData;
  loading: boolean;
  onFormChange: (field: keyof AppSettingSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const AppSettingSearchPanel: React.FC<AppSettingSearchPanelProps> = ({
  searchFormData,
  loading,
  onFormChange,
  onSearch,
  onClear,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
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
            {t('appSettings.search')}
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
              {t('appSettings.clearFilters')}
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
          {/* Setting Name */}
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('appSettings.form.name')}
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              value={searchFormData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder={t('appSettings.filters.searchByName')}
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
              {t('appSettings.form.lang')}
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              value={searchFormData.lang}
              onChange={(e) => onFormChange('lang', e.target.value)}
              placeholder={t('appSettings.filters.language')}
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

          {/* System Setting */}
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('appSettings.filters.systemSettings')}
            </FormLabel>
            <FormControl fullWidth size="small">
              <Select
                value={searchFormData.isSystem}
                onChange={(e) => onFormChange('isSystem', e.target.value)}
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
                <MenuItem value="">{t('appSettings.filters.all')}</MenuItem>
                <MenuItem value="true">{t('appSettings.filters.systemOnly')}</MenuItem>
                <MenuItem value="false">{t('appSettings.filters.nonSystem')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Public Setting */}
          <Box>
            <FormLabel sx={{ fontWeight: 500, color: 'text.primary', mb: 1, display: 'block' }}>
              {t('appSettings.filters.publicSettings')}
            </FormLabel>
            <FormControl fullWidth size="small">
              <Select
                value={searchFormData.isPublic}
                onChange={(e) => onFormChange('isPublic', e.target.value)}
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
                <MenuItem value="">{t('appSettings.filters.all')}</MenuItem>
                <MenuItem value="true">{t('appSettings.filters.publicOnly')}</MenuItem>
                <MenuItem value="false">{t('appSettings.filters.private')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
