import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { Search, Filter, User, Activity, Calendar, X, Info } from 'lucide-react';
import type { AuditLogSearchFormData } from '../types';
import { HTTP_METHOD_OPTIONS, RESULT_STATUS_OPTIONS } from '../constants';

interface AuditLogSearchPanelProps {
  searchFormData: AuditLogSearchFormData;
  loading: boolean;
  activeFiltersCount: number;
  onFormChange: (field: keyof AuditLogSearchFormData, value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
}

export const AuditLogSearchPanel: React.FC<AuditLogSearchPanelProps> = ({
  searchFormData,
  loading,
  activeFiltersCount,
  onFormChange,
  onSearch,
  onClear,
  onKeyPress,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        mb: 3,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.9)' 
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.12)' 
          : 'rgba(25, 118, 210, 0.1)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Filter size={20} style={{ color: theme.palette.primary.main }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {t('common.searchFilters')}
            </Typography>
            <Tooltip 
              title={t('auditLogs.smartFilteringTooltip')}
              placement="top"
              arrow
            >
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <Info size={16} style={{ color: theme.palette.primary.main, opacity: 0.7 }} />
              </IconButton>
            </Tooltip>
            {activeFiltersCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  ml: 1
                }}
              >
                {activeFiltersCount} {t('auditLogs.active')}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {activeFiltersCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={onClear}
                startIcon={<X size={14} />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'warning.main',
                  color: 'warning.main',
                  '&:hover': {
                    borderColor: 'warning.dark',
                    backgroundColor: 'warning.light',
                  },
                }}
              >
                {t('common.clearAll')}
              </Button>
            )}
            
            <Button
              variant="contained"
              size="small"
              onClick={onSearch}
              startIcon={<Search size={16} />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                color: 'white',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              {t('common.search')}
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: 2, 
          mt: 2,
        }}>
          {/* Search by username */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              {t('auditLogs.columns.username')}
            </Typography>
            <TextField
              value={searchFormData.username}
              onChange={(e) => onFormChange('username', e.target.value)}
              onKeyDown={onKeyPress}
              size="small"
              fullWidth
              placeholder={t('auditLogs.filters.searchByUsername')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={16} style={{ opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>

          {/* Endpoint filter */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              {t('auditLogs.columns.endpoint')}
            </Typography>
            <TextField
              value={searchFormData.endpoint}
              onChange={(e) => onFormChange('endpoint', e.target.value)}
              onKeyDown={onKeyPress}
              size="small"
              fullWidth
              placeholder={t('auditLogs.filters.endpoint')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} style={{ opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>

          {/* HTTP Method filter */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              {t('auditLogs.filters.httpMethod')}
            </Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={searchFormData.httpMethod}
                onChange={(e) => onFormChange('httpMethod', e.target.value)}
                displayEmpty
              >
                {HTTP_METHOD_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Result filter */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              {t('auditLogs.columns.result')}
            </Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={searchFormData.result}
                onChange={(e) => onFormChange('result', e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <Activity size={16} style={{ opacity: 0.6 }} />
                  </InputAdornment>
                }
              >
                {RESULT_STATUS_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* IP Address filter */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              {t('auditLogs.columns.ipAddress')}
            </Typography>
            <TextField
              value={searchFormData.ipAddress}
              onChange={(e) => onFormChange('ipAddress', e.target.value)}
              onKeyDown={onKeyPress}
              size="small"
              fullWidth
              placeholder={t('auditLogs.filters.ipAddress')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} style={{ opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>

          {/* Response Time filter */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              {t('auditLogs.filters.responseTime')}
            </Typography>
            <TextField
              value={searchFormData.responseTime}
              onChange={(e) => onFormChange('responseTime', e.target.value)}
              onKeyDown={onKeyPress}
              size="small"
              fullWidth
              type="number"
              placeholder={t('auditLogs.filters.responseTime')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Activity size={16} style={{ opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>

          {/* Start Date filter */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              Start Date
            </Typography>
            <TextField
              type="date"
              value={searchFormData.startDate}
              onChange={(e) => onFormChange('startDate', e.target.value)}
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar size={16} style={{ opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>

          {/* End Date filter */}
          <Box>
            <Typography 
              component="label" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              }}
            >
              End Date
            </Typography>
            <TextField
              type="date"
              value={searchFormData.endDate}
              onChange={(e) => onFormChange('endDate', e.target.value)}
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar size={16} style={{ opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
