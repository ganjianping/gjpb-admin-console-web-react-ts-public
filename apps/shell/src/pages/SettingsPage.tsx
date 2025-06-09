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
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
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
} from 'lucide-react';

// Redux
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  setPageTitle,
  setThemeMode,
  selectThemeMode,
  selectLanguage,
  setLanguage,
} from '../redux/slices/uiSlice';
import type { ThemeMode, Language } from '../redux/slices/uiSlice';

// Settings sections
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';
import { useState } from 'react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  // Redux state
  const currentTheme = useAppSelector(selectThemeMode);
  const currentLanguage = useAppSelector(selectLanguage);
  
  // Local state for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  
  // Set page title
  useEffect(() => {
    dispatch(setPageTitle(t('navigation.settings')));
  }, [dispatch, t]);
  
  // Handle theme change
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    dispatch(setThemeMode(newTheme as ThemeMode));
    toast.success(t('settings.themeChanged'));
  };
  
  // Handle language change
  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value as Language;
    dispatch(setLanguage(newLang));
    i18n.changeLanguage(newLang);
    toast.success(t('settings.languageChanged'));
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
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('settings.description')}
      </Typography>
      
      {/* Settings grid */}
      <Grid container component="div" spacing={3}>
        {/* Appearance */}
        <Grid item component="div" xs={12} md={6}>
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
                <Grid item component="div" xs={12}>
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
                <Grid item component="div" xs={12}>
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Notifications */}
        <Grid item component="div" xs={12} md={6}>
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
                <Grid item component="div" xs={12}>
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
                <Grid item component="div" xs={12}>
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
        <Grid item component="div" xs={12}>
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
                <Grid item component="div" xs={12} md={6} lg={4}>
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
                <Grid item component="div" xs={12} md={6} lg={4}>
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
                <Grid item component="div" xs={12} md={6} lg={4}>
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
