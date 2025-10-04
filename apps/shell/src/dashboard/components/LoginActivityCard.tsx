import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

interface User {
  lastLoginAt?: string | null;
  lastLoginIp?: string | null;
  failedLoginAttempts?: number;
  lastFailedLoginAt?: string | null;
}

interface LoginActivityCardProps {
  user: User;
}

const LoginActivityCard = ({ user }: LoginActivityCardProps) => {
  const { t, i18n } = useTranslation();

  // Helper function to get date-fns locale based on current language
  const getDateLocale = () => {
    return i18n.language.startsWith('zh') ? zhCN : enUS;
  };

  return (
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
  );
};

export default LoginActivityCard;
