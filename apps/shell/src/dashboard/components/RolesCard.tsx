import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface RolesCardProps {
  roleCodes: string[];
}

const RolesCard = ({ roleCodes }: RolesCardProps) => {
  const { t } = useTranslation();

  if (!roleCodes || roleCodes.length === 0) {
    return null;
  }

  return (
    <Card sx={{ 
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      borderRadius: 2,
      mb: 3,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {t('dashboard.userInfo.roles', 'User Roles')}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {roleCodes.map((role) => (
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
  );
};

export default RolesCard;
