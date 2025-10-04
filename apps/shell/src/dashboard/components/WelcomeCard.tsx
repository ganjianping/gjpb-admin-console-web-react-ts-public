import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

interface WelcomeCardProps {
  displayName: string;
}

const WelcomeCard = ({ displayName }: WelcomeCardProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // Helper function to get date-fns locale based on current language
  const getDateLocale = () => {
    return i18n.language.startsWith('zh') ? zhCN : enUS;
  };

  return (
    <Box
      sx={{
        background: theme.palette.mode === 'light' 
          ? '#ffffff'
          : theme.palette.background.paper,
        borderRadius: { xs: 2, sm: 3, md: 4 },
        p: { xs: 2, sm: 3, md: 4 },
        color: theme.palette.mode === 'light' ? theme.palette.text.primary : 'white',
        mb: 4,
        boxShadow: {
          xs: '0 4px 16px rgba(0,0,0,0.08)',
          sm: '0 6px 24px rgba(0,0,0,0.1)',
          md: '0 8px 32px rgba(0,0,0,0.12)',
        },
        border: theme.palette.mode === 'light' ? '1px solid' : 'none',
        borderColor: theme.palette.mode === 'light' ? 'divider' : 'transparent',
      }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          fontWeight: 700, 
          mb: { xs: 1, sm: 1.5 },
          fontSize: { 
            xs: '1.5rem', 
            sm: '1.75rem', 
            md: '2.25rem', 
            lg: '2.5rem'
          },
          lineHeight: { xs: 1.3, sm: 1.4 },
        }}
      >
        {t('dashboard.welcome')}, {displayName}! 👋
      </Typography>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 400, 
          opacity: 0.9, 
          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
        }}
      >
        📅 {format(new Date(), 'EEEE, MMMM d, yyyy', { locale: getDateLocale() })}
      </Typography>
    </Box>
  );
};

export default WelcomeCard;
