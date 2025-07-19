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
  Chip,
  OutlinedInput,
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

// Common permissions for roles
const availablePermissions = [
  'READ_USERS',
  'WRITE_USERS', 
  'DELETE_USERS',
  'MANAGE_ROLES',
  'SYSTEM_CONFIG',
  'VIEW_REPORTS',
  'MANAGE_SETTINGS',
  'AUDIT_LOGS',
];

export const RoleSearchPanel: React.FC<RoleSearchPanelProps> = ({
  searchFormData,
  loading,
  onFormChange,
  onSearch,
  onClear,
}) => {
  const { t } = useTranslation();

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 50%, rgba(241, 245, 249, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'rgba(25, 118, 210, 0.15)',
        mb: 2,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
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
          background: 'radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.02) 0%, transparent 50%)',
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
                background: 'linear-gradient(145deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(145deg, #1565c0 0%, #1976d2 100%)',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'rgba(25, 118, 210, 0.3)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  }
                }
              }}
            />
          </FormControl>

          {/* Permissions Field */}
          <FormControl>
            <FormLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>
              {t('roles.permissions')}
            </FormLabel>
            <Select
              multiple
              size="small"
              value={searchFormData.permissions}
              onChange={(e) => onFormChange('permissions', e.target.value)}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
                </Box>
              )}
              sx={{
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                }
              }}
            >
              {availablePermissions.map((permission) => (
                <MenuItem key={permission} value={permission}>
                  {permission}
                </MenuItem>
              ))}
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
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
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
