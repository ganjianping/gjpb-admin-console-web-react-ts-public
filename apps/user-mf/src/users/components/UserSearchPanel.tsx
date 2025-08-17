import React from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'; // Initialize user translations
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
} from '@mui/material';
import { Search } from 'lucide-react';
import type { SearchFormData } from '../types/user.types';
import { rolesService } from '../../roles/services/rolesCacheService';

interface UserSearchPanelProps {
  searchFormData: SearchFormData;
  loading: boolean;
  onFormChange: (field: keyof SearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const UserSearchPanel: React.FC<UserSearchPanelProps> = ({
  searchFormData,
  loading,
  onFormChange,
  onSearch,
  onClear,
}) => {
  const { t } = useTranslation();
  
  // Get cached roles for the roles dropdown
  const cachedRoles = rolesService.getCachedRoles();
  
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
                {t('common.searchFilters')}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Search size={16} />}
                  onClick={onSearch}
                  disabled={loading}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 0.8,
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    },
                    '&:disabled': {
                      backgroundColor: 'grey.400',
                      color: 'white',
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? t('common.searching') : t('common.search')}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={onClear}
                  disabled={loading}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 0.8,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                    },
                    '&:disabled': {
                      borderColor: 'grey.300',
                      color: 'grey.400',
                      transform: 'none',
                    },
                  }}
                >
                  {t('common.clear')}
                </Button>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: 2, 
              mt: 1,
              '& .MuiFormLabel-root': {
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              },
              '& .MuiTextField-root': {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                },
              },
            }}>
              <Box>
                <FormLabel>{t('users.username')}</FormLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t('users.placeholders.searchByUsername')}
                  value={searchFormData.username}
                  onChange={(e) => onFormChange('username', e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>{t('users.email')}</FormLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t('users.placeholders.searchByEmail')}
                  value={searchFormData.email}
                  onChange={(e) => onFormChange('email', e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>{t('users.mobile')}</FormLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={t('users.placeholders.searchByMobile')}
                  value={searchFormData.mobile}
                  onChange={(e) => onFormChange('mobile', e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>{t('users.status')}</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchFormData.accountStatus}
                    onChange={(e) => onFormChange('accountStatus', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <MenuItem value="">{t('users.statusOptions.all')}</MenuItem>
                    <MenuItem value="active">{t('users.statusOptions.active')}</MenuItem>
                    <MenuItem value="locked">{t('users.statusOptions.locked')}</MenuItem>
                    <MenuItem value="suspend">{t('users.statusOptions.suspended')}</MenuItem>
                    <MenuItem value="pending_verification">{t('users.statusOptions.pendingVerification')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormLabel>{t('users.roles')}</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchFormData.roleCode}
                    onChange={(e) => onFormChange('roleCode', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <MenuItem value="">{t('users.roleOptions.all')}</MenuItem>
                    {cachedRoles.map((role) => (
                      <MenuItem key={role.code} value={role.code}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormLabel>{t('common.active')}</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchFormData.active}
                    onChange={(e) => onFormChange('active', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <MenuItem value="">{t('common.all')}</MenuItem>
                    <MenuItem value="true">{t('common.yes')}</MenuItem>
                    <MenuItem value="false">{t('common.no')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
        </Card>
  );
};
