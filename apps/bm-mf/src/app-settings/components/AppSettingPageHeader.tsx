import { useTranslation } from 'react-i18next';
import '../i18n/i18n.config'; // Initialize app settings translations
import {
  Box,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface AppSettingPageHeaderProps {
  onCreateAppSetting: () => void;
  searchPanelOpen: boolean;
  onToggleSearchPanel: () => void;
}

export const AppSettingPageHeader: React.FC<AppSettingPageHeaderProps> = ({
  onCreateAppSetting,
  searchPanelOpen,
  onToggleSearchPanel,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)'
                : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: theme.palette.mode === 'dark' ? 'transparent' : 'inherit',
            }}
          >
            {t('appSettings.title')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {/* Search Panel Toggle */}
          <Button
            variant="outlined"
            size="medium"
            onClick={onToggleSearchPanel}
            startIcon={<Search size={18} />}
            endIcon={searchPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 1,
              backgroundColor: searchPanelOpen 
                ? 'rgba(25, 118, 210, 0.08)' 
                : 'transparent',
              borderColor: searchPanelOpen ? 'primary.main' : 'divider',
              color: searchPanelOpen ? 'primary.main' : 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
              },
            }}
          >
            {t('common.search')}
          </Button>

          {/* Create Setting Button */}
          <Button
            variant="contained"
            size="medium"
            onClick={onCreateAppSetting}
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              py: 1,
              boxShadow: 'none',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {t('appSettings.create')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
