import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionPageHeaderProps {
  onCreateQuestion: () => void;
  searchPanelOpen: boolean;
  onToggleSearchPanel: () => void;
}

const QuestionPageHeader: React.FC<QuestionPageHeaderProps> = ({
  onCreateQuestion,
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
            {t('questions.pageTitle')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t('questions.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant='outlined'
            startIcon={<Search size={18} />}
            endIcon={searchPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            onClick={onToggleSearchPanel}
            sx={{
              height: 40,
              px: 2.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: searchPanelOpen ? 'primary.main' : 'divider',
              backgroundColor: getSearchButtonBgColor(),
              color: searchPanelOpen ? 'primary.main' : 'text.secondary',
              boxShadow: searchPanelOpen ? '0 2px 8px rgba(25, 118, 210, 0.15)' : 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {searchPanelOpen ? t('common.hideSearch') : t('common.showSearch')}
          </Button>
          <Button
            variant='contained'
            startIcon={<Plus size={18} />}
            onClick={onCreateQuestion}
            sx={{
              height: 40,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {t('questions.create')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionPageHeader;
