import React from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'; // Initialize role translations
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
import type { RoleSearchFormData } from '../types/role.types';

interface RoleSearchPanelProps {
  searchFormData: RoleSearchFormData;
  loading: boolean;
  onFormChange: (field: keyof RoleSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const RoleSearchPanel: React.FC<RoleSearchPanelProps> = ({
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
            {t('roles.filterBy')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button 
              variant="contained" 
              startIcon={<Search size={16} />}
              onClick={onSearch}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 2.5,
                py: 0.8,
                backgroundColor: 'primary.main',
                boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}30`,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}40`,
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  backgroundColor: 'primary.main',
                  opacity: 0.3,
                  boxShadow: 'none',
                  transform: 'none',
                }
              }}
            >
              {loading ? t('common.loading') : t('common.search')}
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={onClear}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 2.5,
                py: 0.8,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  borderColor: 'primary.dark',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              {t('common.clear')}
            </Button>
          </Box>
        </Box>

        {/* Search Form */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
          {/* Role Name Field */}
          <FormControl>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
              {t('roles.name')}
            </FormLabel>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder={`${t('common.search')} ${t('roles.name').toLowerCase()}...`}
              value={searchFormData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 1)',
                  }
                }
              }}
            />
          </FormControl>

          {/* System Role Field */}
          <FormControl>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
              {t('roles.systemRole')}
            </FormLabel>
            <Select
              size="small"
              value={searchFormData.systemRole ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                let systemRole: boolean | undefined;
                if (value === 'true') {
                  systemRole = true;
                } else if (value === 'false') {
                  systemRole = false;
                } else {
                  systemRole = undefined;
                }
                onFormChange('systemRole', systemRole);
              }}
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.9)',
                },
                '&.Mui-focused': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 1)',
                }
              }}
            >
              <MenuItem value="">
                <Typography color="textSecondary">{t('common.all')}</Typography>
              </MenuItem>
              <MenuItem value="true">{t('roles.systemRoleOnly')}</MenuItem>
              <MenuItem value="false">{t('roles.customRoleOnly')}</MenuItem>
            </Select>
          </FormControl>

          {/* Status Field */}
          <FormControl>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
              {t('roles.status')}
            </FormLabel>
            <Select
              size="small"
              value={searchFormData.status}
              onChange={(e) => onFormChange('status', e.target.value)}
              displayEmpty
              sx={{
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.9)',
                },
                '&.Mui-focused': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 1)',
                }
              }}
            >
              <MenuItem value="">
                <em>{t('common.all')}</em>
              </MenuItem>
              <MenuItem value="active">{t('roles.statusValues.active')}</MenuItem>
              <MenuItem value="inactive">{t('roles.statusValues.inactive')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};
