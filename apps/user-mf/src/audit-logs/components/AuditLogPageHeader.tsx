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
          <Box
            onClick={onToggleSearchPanel}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              py: 1,
              px: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: searchPanelExpanded ? 'primary.main' : 'rgba(25, 118, 210, 0.3)',
              backgroundColor: searchPanelExpanded 
                ? 'rgba(25, 118, 210, 0.08)' 
                : theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
              },
            }}
          >
            <Search size={18} style={{ color: theme.palette.primary.main }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: searchPanelExpanded ? 'primary.main' : 'text.primary',
              }}
            >
              {searchPanelExpanded ? t('common.hideSearch') : t('common.showSearch')}
            </Typography>
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
                  ml: 0.5
                }}
              >
                {activeFiltersCount}
              </Box>
            )}
            {searchPanelExpanded ? (
              <ChevronUp size={18} style={{ color: theme.palette.primary.main }} />
            ) : (
              <ChevronDown size={18} style={{ color: theme.palette.primary.main }} />
            )}
          </Box>

          {/* Refresh Button */}
          <Button
            variant="outlined"
            size="medium"
            onClick={onRefresh}
            disabled={loading}
            startIcon={
              <RefreshCw 
                size={16} 
                style={{ 
                  animation: loading ? 'spin 1s linear infinite' : undefined 
                }} 
              />
            }
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 1,
            }}
          >
            {t('common.refresh')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
