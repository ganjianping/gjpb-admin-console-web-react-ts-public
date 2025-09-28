import { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Database,
  Code,
} from 'lucide-react';

// Redux
import { useAppDispatch } from '../hooks/useRedux';
import { setPageTitle } from '../redux/slices/uiSlice';

// Config
import { APP_CONFIG, APP_ENV } from '../../../shared-lib/src/utils/config';

// Firebase Analytics
import { trackPageView } from '../utils/firebaseAnalytics';

const SettingsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  // Set page title
  useEffect(() => {
    dispatch(setPageTitle(t('navigation.settings')));
    
    // Track page view for analytics
    trackPageView('Settings', t('navigation.settings'));
  }, [dispatch, t]);

  // Environment variables (Vite runtime environment variables)
  const envVariables = {
    'DEV': APP_ENV.DEV,
    'PROD': APP_ENV.PROD,
    'MODE': APP_ENV.MODE,
    'API_BASE_URL': APP_ENV.API_BASE_URL,
    'VITE_APP_NAME': import.meta.env.VITE_APP_NAME,
    'VITE_APP_VERSION': import.meta.env.VITE_APP_VERSION,
    'VITE_DEFAULT_LANGUAGE': import.meta.env.VITE_DEFAULT_LANGUAGE,
    'VITE_AVAILABLE_LANGUAGES': import.meta.env.VITE_AVAILABLE_LANGUAGES,
    'VITE_DEFAULT_THEME': import.meta.env.VITE_DEFAULT_THEME,
    'VITE_DEFAULT_COLOR_THEME': import.meta.env.VITE_DEFAULT_COLOR_THEME,
    'VITE_AUTH_LOGIN_URL': import.meta.env.VITE_AUTH_LOGIN_URL,
    'VITE_AUTH_REFRESH_TOKEN_URL': import.meta.env.VITE_AUTH_REFRESH_TOKEN_URL,
    'VITE_AUTH_TOKEN_EXPIRY_BUFFER': import.meta.env.VITE_AUTH_TOKEN_EXPIRY_BUFFER,
    'VITE_FIREBASE_API_KEY': import.meta.env.VITE_FIREBASE_API_KEY ? '***hidden***' : undefined,
    'VITE_FIREBASE_AUTH_DOMAIN': import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    'VITE_FIREBASE_PROJECT_ID': import.meta.env.VITE_FIREBASE_PROJECT_ID,
    'VITE_FIREBASE_STORAGE_BUCKET': import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    'VITE_FIREBASE_MESSAGING_SENDER_ID': import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    'VITE_FIREBASE_APP_ID': import.meta.env.VITE_FIREBASE_APP_ID,
    'VITE_FIREBASE_MEASUREMENT_ID': import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Global variables from APP_CONFIG
  const globalVariables = {
    'APP_NAME': APP_CONFIG.APP_NAME,
    'APP_VERSION': APP_CONFIG.APP_VERSION,
    'COPYRIGHT': APP_CONFIG.COPYRIGHT,
    'DEFAULT_LANGUAGE': APP_CONFIG.DEFAULT_LANGUAGE,
    'AVAILABLE_LANGUAGES': APP_CONFIG.AVAILABLE_LANGUAGES,
    'DEFAULT_PAGE_TITLE': APP_CONFIG.DEFAULT_PAGE_TITLE,
    'DEFAULT_PAGE_TITLE_KEY': APP_CONFIG.DEFAULT_PAGE_TITLE_KEY,
    'TOKEN.ACCESS_TOKEN_KEY': APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY,
    'TOKEN.REFRESH_TOKEN_KEY': APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY,
    'TOKEN.TOKEN_TYPE_KEY': APP_CONFIG.TOKEN.TOKEN_TYPE_KEY,
    'THEME.DEFAULT_THEME': APP_CONFIG.THEME.DEFAULT_THEME,
    'THEME.DEFAULT_COLOR_THEME': APP_CONFIG.THEME.DEFAULT_COLOR_THEME,
    'THEME.STORAGE_KEY': APP_CONFIG.THEME.STORAGE_KEY,
    'ROUTES.HOME': APP_CONFIG.ROUTES.HOME,
    'ROUTES.LOGIN': APP_CONFIG.ROUTES.LOGIN,
    'ROUTES.DASHBOARD': APP_CONFIG.ROUTES.DASHBOARD,
    'ROUTES.UNAUTHORIZED': APP_CONFIG.ROUTES.UNAUTHORIZED,
    'ROUTES.NOT_FOUND': APP_CONFIG.ROUTES.NOT_FOUND,
    'AUTH.LOGIN_URL': APP_CONFIG.AUTH.LOGIN_URL,
    'AUTH.REFRESH_TOKEN_URL': APP_CONFIG.AUTH.REFRESH_TOKEN_URL,
    'AUTH.TOKEN_EXPIRY_BUFFER': APP_CONFIG.AUTH.TOKEN_EXPIRY_BUFFER,
  };

  const renderVariableValue = (value: any) => {
    if (value === undefined) {
      return <Chip label="undefined" size="small" color="default" variant="outlined" />;
    }
    if (value === null) {
      return <Chip label="null" size="small" color="default" variant="outlined" />;
    }
    if (typeof value === 'boolean') {
      return <Chip label={value.toString()} size="small" color={value ? 'success' : 'error'} />;
    }
    if (Array.isArray(value)) {
      return <Chip label={`[${value.join(', ')}]`} size="small" color="info" />;
    }
    if (typeof value === 'number') {
      return <Chip label={value.toString()} size="small" color="primary" />;
    }
    return <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>{value}</Typography>;
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Page heading */}
      <Typography variant="h4" gutterBottom>
        {t('navigation.settings')}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        System environment variables and global configuration settings
      </Typography>
      
      {/* Settings grid */}
      <Grid container component="div" spacing={3}>
        {/* Environment Variables */}
        <Grid size={{ xs: 12, lg: 6 }}>
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
                  <Code size={20} />
                  <span>Environment Variables</span>
                </Box>
              }
              subheader="Runtime environment variables from Vite"
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Variable</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(envVariables).map(([key, value]) => (
                      <TableRow key={key} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {key}
                        </TableCell>
                        <TableCell>
                          {renderVariableValue(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Global Variables */}
        <Grid size={{ xs: 12, lg: 6 }}>
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
                  <Settings size={20} />
                  <span>Global Configuration</span>
                </Box>
              }
              subheader="Application configuration from APP_CONFIG"
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Variable</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(globalVariables).map(([key, value]) => (
                      <TableRow key={key} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {key}
                        </TableCell>
                        <TableCell>
                          {renderVariableValue(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Build Information */}
      <Grid container component="div" spacing={3} sx={{ mt: 1 }}>
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
                  <Database size={20} />
                  <span>Build Information</span>
                </Box>
              }
              subheader="Runtime environment and build details"
            />
            <Divider />
            <CardContent>
              <Grid container component="div" spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Environment
                    </Typography>
                    <Chip 
                      label={APP_ENV.MODE} 
                      size="small" 
                      color={APP_ENV.PROD ? 'success' : 'warning'} 
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Development
                    </Typography>
                    <Chip 
                      label={APP_ENV.DEV ? 'Yes' : 'No'} 
                      size="small" 
                      color={APP_ENV.DEV ? 'info' : 'default'} 
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Production
                    </Typography>
                    <Chip 
                      label={APP_ENV.PROD ? 'Yes' : 'No'} 
                      size="small" 
                      color={APP_ENV.PROD ? 'success' : 'default'} 
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Version
                    </Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                      {APP_CONFIG.APP_VERSION}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
