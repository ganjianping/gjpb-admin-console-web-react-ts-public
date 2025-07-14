import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface UserPageHeaderProps {
  onCreateUser: () => void;
  searchPanelOpen: boolean;
  onToggleSearchPanel: () => void;
}

export const UserPageHeader = ({ 
  onCreateUser, 
  searchPanelOpen, 
  onToggleSearchPanel 
}: UserPageHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        {t('users.pageTitle')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button 
          variant="outlined"
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
            backgroundColor: searchPanelOpen 
              ? 'rgba(25, 118, 210, 0.08)' 
              : 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: searchPanelOpen 
              ? '0 2px 8px rgba(25, 118, 210, 0.15)' 
              : '0 1px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: searchPanelOpen 
                ? 'rgba(25, 118, 210, 0.12)' 
                : 'rgba(25, 118, 210, 0.04)',
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
          {searchPanelOpen ? t('users.hideSearch') : t('users.showSearch')}
        </Button>
        
        <Button 
          variant="contained" 
          startIcon={<Plus size={16} />} 
          onClick={onCreateUser}
          sx={{
            borderRadius: 2,
            px: 3,
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
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
            },
            '&:active': {
              backgroundColor: 'primary.dark',
              transform: 'translateY(0px)',
            },
          }}
        >
          {t('users.actions.createUser')}
        </Button>
      </Box>
    </Box>
  );
};
