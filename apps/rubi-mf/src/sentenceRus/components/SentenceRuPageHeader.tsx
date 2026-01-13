import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface SentenceRuPageHeaderProps {
  onCreateSentenceRu: () => void;
  searchPanelOpen: boolean;
  onToggleSearchPanel: () => void;
}

const SentenceRuPageHeader: React.FC<SentenceRuPageHeaderProps> = ({
  onCreateSentenceRu,
  searchPanelOpen,
  onToggleSearchPanel,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const getSearchButtonBgColor = () => {
    if (searchPanelOpen) return 'rgba(25, 118, 210, 0.08)';
    return theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)';
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography
            variant='h4'
            component='h1'
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)'
                  : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: theme.palette.mode === 'dark' ? 'transparent' : 'inherit',
            }}
          >
            {t('sentenceRus.pageTitle')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t('sentenceRus.subtitle')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button
            variant='outlined'
            startIcon={<Search size={16} />}
            endIcon={searchPanelOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
              boxShadow: searchPanelOpen ? '0 2px 8px rgba(25, 118, 210, 0.15)' : '0 1px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: searchPanelOpen ? 'rgba(25, 118, 210, 0.12)' : 'rgba(25, 118, 210, 0.04)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              },
              '& .MuiButton-endIcon': {
                marginLeft: 1,
                transition: 'transform 0.2s ease',
                transform: searchPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              },
            }}
          >
            {searchPanelOpen ? t('common.hideSearch') : t('common.showSearch')}
          </Button>

          <Button
            variant='contained'
            startIcon={<Plus size={16} />}
            onClick={onCreateSentenceRu}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              backgroundColor: 'primary.main',
              color: 'white',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
              },
            }}
          >
            {t('sentenceRus.create')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SentenceRuPageHeader;
