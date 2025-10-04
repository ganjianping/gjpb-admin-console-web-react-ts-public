import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const UserPreferencesCard = () => {
  const { t } = useTranslation();
  
  // State for localStorage values
  const [localStorageData, setLocalStorageData] = useState({
    language: '',
    colorTheme: '',
    themeMode: '',
  });

  // Load localStorage values on mount
  useEffect(() => {
    const loadLocalStorageData = () => {
      setLocalStorageData({
        language: localStorage.getItem('gjpb_language') || 'Not set',
        colorTheme: localStorage.getItem('gjpb_color_theme') || 'Not set',
        themeMode: localStorage.getItem('gjpb_theme') || 'Not set',
      });
    };

    loadLocalStorageData();
  }, []);

  // Helper function to format language display
  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case 'en': return 'English';
      case 'zh': return '中文 (Chinese)';
      default: return lang;
    }
  };

  // Helper function to format color theme display
  const getColorThemeDisplay = (theme: string) => {
    switch (theme) {
      case 'blue': return '🔵 Blue';
      case 'green': return '🟢 Green';
      case 'purple': return '🟣 Purple';
      case 'orange': return '🟠 Orange';
      case 'red': return '🔴 Red';
      default: return theme;
    }
  };

  // Helper function to format theme mode display
  const getThemeModeDisplay = (mode: string) => {
    switch (mode) {
      case 'light': return '☀️ Light Mode';
      case 'dark': return '🌙 Dark Mode';
      case 'system': return '💻 System Default';
      default: return mode;
    }
  };

  return (
    <Card sx={{ 
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      borderRadius: 2,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {t('dashboard.userInfo.userPreferences', 'User Preferences')}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('dashboard.userInfo.language', 'Language')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {getLanguageDisplay(localStorageData.language)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('dashboard.userInfo.colorTheme', 'Color Theme')}
            </Typography>
            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {getColorThemeDisplay(localStorageData.colorTheme)}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('dashboard.userInfo.themeMode', 'Theme Mode')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {getThemeModeDisplay(localStorageData.themeMode)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserPreferencesCard;
