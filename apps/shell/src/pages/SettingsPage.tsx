import { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Moon,
  Sun,
  Globe,
  Monitor,
  Bell,
  Eye,
  Shield,
  Cookie,
  Lock,
  Palette,
} from 'lucide-react';

// Redux
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  setPageTitle,
  setThemeMode,
  selectThemeMode,
  selectLanguage,
  selectColorTheme,
  setLanguage,
  setColorTheme,
} from '../redux/slices/uiSlice';
import type { ThemeMode, Language, ColorTheme } from '../redux/slices/uiSlice';

// Settings sections
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Firebase Analytics
import { trackPageView, trackEvent } from '../utils/firebaseAnalytics';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // Redux state
  const currentTheme = useAppSelector(selectThemeMode);
  const currentLanguage = useAppSelector(selectLanguage);
  const currentColorTheme = useAppSelector(selectColorTheme);
  
  // Local state for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);

  // Helper functions for color theme
  const getColorThemeColor = (colorTheme: ColorTheme): string => {
    const colors = {
      blue: '#1976d2',
      purple: '#9c27b0',
      green: '#4caf50',
      orange: '#ff9800',
      red: '#f44336',
    };
    return colors[colorTheme];
  };

  const getColorThemeLabel = (colorTheme: ColorTheme): string => {
    const labels = {
      blue: t('theme.colors.blue', 'Blue'),
      purple: t('theme.colors.purple', 'Purple'),
      green: t('theme.colors.green', 'Green'),
      orange: t('theme.colors.orange', 'Orange'),
      red: t('theme.colors.red', 'Red'),
    };
    return labels[colorTheme];
  };
  
  // Set page title
  useEffect(() => {
    dispatch(setPageTitle(t('navigation.settings')));
    
    // Track page view for analytics
    trackPageView('Settings', t('navigation.settings'));
  }, [dispatch, t]);
  
  // Handle theme change
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    dispatch(setThemeMode(newTheme as ThemeMode));
    
    // Track theme change
    trackEvent('change_theme', { 
      newTheme,
      previousTheme: currentTheme 
    });
    
    toast.success(t('settings.themeChanged'));
  };
  
  // Handle language change
  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value as Language;
    dispatch(setLanguage(newLang));
    i18n.changeLanguage(newLang);
    
    // Track language change
    trackEvent('change_language', { 
      newLanguage: newLang,
      previousLanguage: currentLanguage 
    });
    
    toast.success(t('settings.languageChanged'));
  };

  // Handle color theme change
  const handleColorThemeChange = (event: SelectChangeEvent) => {
    const newColorTheme = event.target.value as ColorTheme;
    dispatch(setColorTheme(newColorTheme));
    
    // Track color theme change
    trackEvent('change_color_theme', { 
      newColorTheme,
      previousColorTheme: currentColorTheme 
    });
    
    toast.success(t('settings.colorThemeChanged'));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsEnabled(event.target.checked);
    toast.success(t('settings.settingsUpdated'));
  };
  
  // Handle email notifications toggle
  const handleEmailNotificationsToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotifications(event.target.checked);
    toast.success(t('settings.settingsUpdated'));
  };
  
  // Handle security alerts toggle
  const handleSecurityAlertsToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityAlerts(event.target.checked);
    toast.success(t('settings.settingsUpdated'));
  };
  
  // Handle cookie consent toggle
  const handleCookieConsentToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCookieConsent(event.target.checked);
    toast.success(t('settings.settingsUpdated'));
  };
  
  // Handle auto logout toggle
  const handleAutoLogoutToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoLogout(event.target.checked);
    toast.success(t('settings.settingsUpdated'));
  };
  
  // Reset all settings
  const handleResetSettings = () => {
    // Reset theme
    dispatch(setThemeMode(APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode));
    
    // Reset color theme
    dispatch(setColorTheme('blue' as ColorTheme));
    
    // Reset language
    dispatch(setLanguage(APP_CONFIG.DEFAULT_LANGUAGE as Language));
    i18n.changeLanguage(APP_CONFIG.DEFAULT_LANGUAGE);
    
    // Reset local settings
    setNotificationsEnabled(true);
    setEmailNotifications(true);
    setSecurityAlerts(true);
    setCookieConsent(true);
    setAutoLogout(true);
    
    toast.success(t('settings.settingsReset'));
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Page heading */}
      <Typography variant="h4" gutterBottom>
        {t('navigation.settings')}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {t('settings.description')}
      </Typography>
      
      {/* Settings grid */}
      <Grid container component="div" spacing={3}>
        {/* Appearance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Eye size={20} />
                  <span>{t('settings.appearance.title')}</span>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Grid container component="div" spacing={3}>
                {/* Theme mode */}
                <Grid size={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {currentTheme === 'dark' ? (
                          <Moon size={16} />
                        ) : (
                          <Sun size={16} />
                        )}
                        <Typography variant="subtitle1" fontWeight={500}>
                          {t('settings.appearance.theme')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {currentTheme === 'dark'
                          ? t('settings.appearance.darkMode')
                          : t('settings.appearance.lightMode')}
                      </Typography>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={currentTheme === 'dark'}
                          onChange={handleThemeChange}
                          color="primary"
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            ml: 0.5,
                          }}
                        >
                          <Sun size={14} style={{ color: alpha(theme.palette.warning.main, 0.8) }} />
                          <Monitor size={14} />
                          <Moon size={14} style={{ color: alpha(theme.palette.info.main, 0.8) }} />
                        </Box>
                      }
                      labelPlacement="start"
                      sx={{
                        ml: 0,
                        mr: 0,
                      }}
                    />
                  </Paper>
                </Grid>
                
                {/* Language */}
                <Grid size={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Globe size={16} />
                        <Typography variant="subtitle1" fontWeight={500}>
                          {t('settings.appearance.language')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('settings.appearance.languageDescription')}
                      </Typography>
                    </Box>
                    
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="language-select-label">
                        {t('settings.appearance.selectLanguage')}
                      </InputLabel>
                      <Select
                        labelId="language-select-label"
                        id="language-select"
                        value={currentLanguage}
                        label={t('settings.appearance.selectLanguage')}
                        onChange={handleLanguageChange}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="zh">中文</MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>

                {/* Color Theme */}
                <Grid size={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Palette size={16} />
                        <Typography variant="subtitle1" fontWeight={500}>
                          {t('settings.appearance.colorTheme', 'Color Theme')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('settings.appearance.colorThemeDescription', 'Choose your preferred color scheme')}
                      </Typography>
                    </Box>
                    
                    <FormControl sx={{ minWidth: 140 }} size="small">
                      <InputLabel id="color-theme-select-label">
                        {t('settings.appearance.selectColorTheme', 'Select Color')}
                      </InputLabel>
                      <Select
                        labelId="color-theme-select-label"
                        id="color-theme-select"
                        value={currentColorTheme}
                        label={t('settings.appearance.selectColorTheme', 'Select Color')}
                        onChange={handleColorThemeChange}
                        renderValue={(value) => (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: getColorThemeColor(value as ColorTheme),
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                            {getColorThemeLabel(value as ColorTheme)}
                          </Box>
                        )}
                      >
                        <MenuItem value="blue">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: '#1976d2',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                            {t('theme.colors.blue', 'Blue')}
                          </Box>
                        </MenuItem>
                        <MenuItem value="purple">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: '#9c27b0',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                            {t('theme.colors.purple', 'Purple')}
                          </Box>
                        </MenuItem>
                        <MenuItem value="green">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                            {t('theme.colors.green', 'Green')}
                          </Box>
                        </MenuItem>
                        <MenuItem value="orange">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: '#ff9800',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                            {t('theme.colors.orange', 'Orange')}
                          </Box>
                        </MenuItem>
                        <MenuItem value="red">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: '#f44336',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            />
                            {t('theme.colors.red', 'Red')}
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Notifications */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bell size={20} />
                  <span>{t('settings.notifications.title')}</span>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Grid container component="div" spacing={3}>
                {/* Push notifications */}
                <Grid size={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {t('settings.notifications.pushNotifications')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('settings.notifications.pushDescription')}
                      </Typography>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationsEnabled}
                          onChange={handleNotificationToggle}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Paper>
                </Grid>
                
                {/* Email notifications */}
                <Grid size={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {t('settings.notifications.emailNotifications')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('settings.notifications.emailDescription')}
                      </Typography>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={emailNotifications}
                          onChange={handleEmailNotificationsToggle}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Security */}
        <Grid size={12}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Shield size={20} />
                  <span>{t('settings.security.title')}</span>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Grid container component="div" spacing={3}>
                {/* Security alerts */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {t('settings.security.securityAlerts')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('settings.security.alertsDescription')}
                      </Typography>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securityAlerts}
                          onChange={handleSecurityAlertsToggle}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Paper>
                </Grid>
                
                {/* Cookie consent */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Cookie size={16} />
                        <Typography variant="subtitle1" fontWeight={500}>
                          {t('settings.security.cookieConsent')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('settings.security.cookieDescription')}
                      </Typography>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={cookieConsent}
                          onChange={handleCookieConsentToggle}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Paper>
                </Grid>
                
                {/* Auto logout */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Lock size={16} />
                        <Typography variant="subtitle1" fontWeight={500}>
                          {t('settings.security.autoLogout')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('settings.security.autoLogoutDescription')}
                      </Typography>
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoLogout}
                          onChange={handleAutoLogoutToggle}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Reset settings */}
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button 
          variant="outlined" 
          color="warning" 
          onClick={handleResetSettings}
          sx={{ px: 3, py: 1 }}
        >
          {t('settings.resetAll')}
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
