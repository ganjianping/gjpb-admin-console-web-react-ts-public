import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Search, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface AuditLogPageHeaderProps {
  searchPanelExpanded: boolean;
  activeFiltersCount: number;
  loading: boolean;
  onToggleSearchPanel: () => void;
  onRefresh: () => void;
}

export const AuditLogPageHeader: React.FC<AuditLogPageHeaderProps> = ({
  searchPanelExpanded,
  activeFiltersCount,
  loading,
  onToggleSearchPanel,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const getSearchButtonBgColor = () => {
    if (searchPanelExpanded) return 'rgba(25, 118, 210, 0.08)';
    return theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.9)';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 700,
          }}
        >
          {t('auditLogs.title')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {/* Search Panel Toggle Button */}
          <Button
            variant="outlined"
            startIcon={<Search size={16} />}
            endIcon={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {activeFiltersCount > 0 && (
                  <Box
                    sx={{
                      backgroundColor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {activeFiltersCount}
                  </Box>
                )}
                {searchPanelExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Box>
            }
            onClick={onToggleSearchPanel}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              borderColor: 'primary.main',
              color: 'primary.main',
              backgroundColor: getSearchButtonBgColor(),
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: searchPanelExpanded 
                ? '0 2px 8px rgba(25, 118, 210, 0.15)' 
                : '0 1px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: searchPanelExpanded 
                  ? 'rgba(25, 118, 210, 0.12)' 
                  : 'rgba(25, 118, 210, 0.04)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              },
              '& .MuiButton-endIcon': {
                marginLeft: 1,
                transition: 'transform 0.2s ease',
                transform: searchPanelExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              },
            }}
          >
            {searchPanelExpanded ? t('common.hideSearch') : t('common.showSearch')}
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outlined"
            startIcon={
              <RefreshCw 
                size={16} 
                style={{ 
                  animation: loading ? 'spin 1s linear infinite' : undefined 
                }} 
              />
            }
            onClick={onRefresh}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              borderColor: 'primary.main',
              color: 'primary.main',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {t('common.refresh')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
