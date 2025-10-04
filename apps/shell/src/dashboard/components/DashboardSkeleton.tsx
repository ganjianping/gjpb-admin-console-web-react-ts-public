import { Box, Card, CardContent, Skeleton } from '@mui/material';
import { memo } from 'react';

// Welcome Card Skeleton
export const WelcomeCardSkeleton = memo(() => {
  return (
    <Box
      sx={{
        borderRadius: { xs: 2, sm: 3, md: 4 },
        p: { xs: 2, sm: 3, md: 4 },
        mb: 4,
        boxShadow: {
          xs: '0 4px 16px rgba(0,0,0,0.08)',
          sm: '0 6px 24px rgba(0,0,0,0.1)',
          md: '0 8px 32px rgba(0,0,0,0.12)',
        },
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Skeleton 
        variant="text" 
        width="60%" 
        height={60}
        sx={{ 
          fontSize: { 
            xs: '1.5rem', 
            sm: '1.75rem', 
            md: '2.25rem', 
            lg: '2.5rem'
          },
          mb: { xs: 1, sm: 1.5 },
        }}
      />
      <Skeleton 
        variant="text" 
        width="40%" 
        height={32}
        sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}
      />
    </Box>
  );
});

WelcomeCardSkeleton.displayName = 'WelcomeCardSkeleton';

// Info Card Skeleton (for Basic Info and Login Activity)
export const InfoCardSkeleton = memo(() => {
  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      borderRadius: 2,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: 5 }, (_, i) => `info-${i}-${Date.now()}`).map((key) => (
            <Box key={key}>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mt: 0.5 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
});

InfoCardSkeleton.displayName = 'InfoCardSkeleton';

// Roles Card Skeleton
export const RolesCardSkeleton = memo(() => {
  return (
    <Card sx={{ 
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      borderRadius: 2,
      mb: 3,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Array.from({ length: 3 }, (_, i) => `role-${i}-${Date.now()}`).map((key) => (
            <Skeleton 
              key={key}
              variant="rounded" 
              width={100} 
              height={32} 
              sx={{ borderRadius: 4 }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
});

RolesCardSkeleton.displayName = 'RolesCardSkeleton';

// User Preferences Card Skeleton
export const UserPreferencesCardSkeleton = memo(() => {
  return (
    <Card sx={{ 
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      borderRadius: 2,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: 3 }, (_, i) => `pref-${i}-${Date.now()}`).map((key) => (
            <Box key={key}>
              <Skeleton variant="text" width="35%" height={20} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mt: 0.5 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
});

UserPreferencesCardSkeleton.displayName = 'UserPreferencesCardSkeleton';

// Complete Dashboard Skeleton
export const DashboardSkeleton = memo(() => {
  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      p: { xs: 1, sm: 1, md: 1 },
    }}>
      {/* Welcome Section Skeleton */}
      <WelcomeCardSkeleton />

      {/* User Information Section Skeleton */}
      <Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          mb: 3 
        }}>
          <Box sx={{ flex: 1 }}>
            <InfoCardSkeleton />
          </Box>
          <Box sx={{ flex: 1 }}>
            <InfoCardSkeleton />
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          mb: 3 
        }}>
          <Box sx={{ flex: 1 }}>
            <UserPreferencesCardSkeleton />
          </Box>
          <Box sx={{ flex: 1 }}>
            <RolesCardSkeleton />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

DashboardSkeleton.displayName = 'DashboardSkeleton';
