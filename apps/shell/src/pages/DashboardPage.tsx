import { 
  Box, 
  Typography, 
  useTheme,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

// Firebase Performance
import { useFirebasePerformance } from '../hooks/useFirebasePerformance';

// Store
import { useAppSelector } from '../hooks/useRedux';
import { selectCurrentUser } from '../redux/slices/authSlice';

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const user = useAppSelector(selectCurrentUser);
  const theme = useTheme();
  
  // Firebase Performance tracking for dashboard page
  useFirebasePerformance('dashboard', user?.username);
  
  // Helper function to get date-fns locale based on current language
  const getDateLocale = () => {
    return i18n.language.startsWith('zh') ? zhCN : enUS;
  };

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: theme.palette.background.default, 
      minHeight: '100vh', 
      p: { xs: 2, sm: 3, md: 4 },
    }}>
      {/* Welcome Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: { xs: 2, sm: 3, md: 4 },
          p: { xs: 2, sm: 3, md: 4 },
          color: 'white',
          mb: 4,
          boxShadow: {
            xs: '0 4px 16px rgba(0,0,0,0.08)',
            sm: '0 6px 24px rgba(0,0,0,0.1)',
            md: '0 8px 32px rgba(0,0,0,0.12)',
          },
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
          {t('dashboard.welcome')}, {user?.nickname ?? user?.username}! 👋
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

      {/* User Information Section */}
      {user && (
        <Box>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: theme.palette.text.primary 
            }}
          >
            {t('dashboard.userInfo.title', 'User Information')}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3, 
            mb: 3 
          }}>
            {/* Basic Information Card */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ 
                height: '100%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                borderRadius: 2,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: theme.palette.primary.main, 
                      mr: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                    }}>
                      {user.nickname?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user.nickname || user.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('dashboard.userInfo.email', 'Email')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {user.email}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('dashboard.userInfo.mobile', 'Mobile')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        +{user.mobileCountryCode} - {user.mobileNumber}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('dashboard.userInfo.accountStatus', 'Account Status')}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip 
                          label={user.accountStatus} 
                          size="small" 
                          color={user.accountStatus === 'active' ? 'success' : 'default'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Login Information Card */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ 
                height: '100%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                borderRadius: 2,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {t('dashboard.userInfo.loginActivity', 'Login Activity')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('dashboard.userInfo.lastLogin', 'Last Login')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {user.lastLoginAt 
                          ? format(new Date(user.lastLoginAt), 'PPpp', { locale: getDateLocale() })
                          : t('dashboard.userInfo.never', 'Never')
                        }
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('dashboard.userInfo.lastLoginIp', 'Last Login IP')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {user.lastLoginIp || t('dashboard.userInfo.notAvailable', 'Not available')}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('dashboard.userInfo.failedAttempts', 'Failed Login Attempts')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {user.failedLoginAttempts || 0}
                      </Typography>
                    </Box>
                    
                    {user.lastFailedLoginAt && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {t('dashboard.userInfo.lastFailedLogin', 'Last Failed Login')}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {format(new Date(user.lastFailedLoginAt), 'PPpp', { locale: getDateLocale() })}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Roles Information Card */}
          {user.roleCodes && user.roleCodes.length > 0 && (
            <Card sx={{ 
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              borderRadius: 2,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {t('dashboard.userInfo.roles', 'User Roles')}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.roleCodes.map((role) => (
                    <Chip 
                      key={role}
                      label={role} 
                      variant="outlined"
                      color="primary"
                      sx={{ 
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;