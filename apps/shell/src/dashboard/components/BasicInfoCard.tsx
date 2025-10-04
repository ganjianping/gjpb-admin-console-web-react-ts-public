import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface User {
  username: string;
  nickname?: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  accountStatus: string;
}

interface BasicInfoCardProps {
  user: User;
}

const BasicInfoCard = ({ user }: BasicInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      borderRadius: 2,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {t('dashboard.userInfo.basicInfo', 'Basic Information')}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('dashboard.userInfo.displayName', 'Display Name')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {user.nickname || user.username}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('dashboard.userInfo.username', 'Username')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              @{user.username}
            </Typography>
          </Box>
          
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
  );
};

export default BasicInfoCard;
