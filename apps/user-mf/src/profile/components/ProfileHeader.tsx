import React from 'react';
import { Paper, Avatar, Typography, Box, Grid } from '@mui/material';
import { Mail, Phone, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../users/services/userService';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(({ user }) => {
  const { t } = useTranslation();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, sm: "auto" }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100,
              bgcolor: 'primary.main',
              fontSize: 40,
            }}
          >
            {user.nickname?.[0] || user.username?.[0] || 'U'}
          </Avatar>
        </Grid>
        
        <Grid size={{ xs: 12, sm: "grow" }}>
          <Typography variant="h4" gutterBottom>
            {user.nickname || user.username}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ marginRight: 6 }} />
              <Typography variant="body2" color="text.secondary">
                {user.email || t('profile.noEmailProvided')}
              </Typography>
            </Box>
            
            {user.mobileNumber && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone size={16} style={{ marginRight: 6 }} />
                <Typography variant="body2" color="text.secondary">
                  {user.mobileCountryCode && `+${user.mobileCountryCode}`} {user.mobileNumber}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Shield size={16} style={{ marginRight: 6 }} />
              <Typography variant="body2" color="text.secondary">
                {user.roles?.map(role => role.code || role.name).join(', ') || t('profile.defaultRole')}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
});

ProfileHeader.displayName = 'ProfileHeader';
