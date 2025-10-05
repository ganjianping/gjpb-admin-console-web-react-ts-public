import { Box, Paper, Card, CardContent, Skeleton } from '@mui/material';
import { memo } from 'react';

// Profile Header Skeleton
export const ProfileHeaderSkeleton = memo(() => {
  return (
    <Paper
      sx={{
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Avatar skeleton */}
        <Skeleton 
          variant="circular" 
          width={100} 
          height={100}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
        />
        
        {/* User info skeleton */}
        <Box sx={{ flex: 1 }}>
          <Skeleton 
            variant="text" 
            width={200} 
            height={48}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
          />
          <Skeleton 
            variant="text" 
            width={150} 
            height={24}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mt: 1 }}
          />
        </Box>
      </Box>
    </Paper>
  );
});

ProfileHeaderSkeleton.displayName = 'ProfileHeaderSkeleton';

// Profile Tabs Skeleton
export const ProfileTabsSkeleton = memo(() => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="rectangular" width={120} height={48} />
        <Skeleton variant="rectangular" width={150} height={48} />
      </Box>
    </Box>
  );
});

ProfileTabsSkeleton.displayName = 'ProfileTabsSkeleton';

// Profile Form Skeleton
export const ProfileFormSkeleton = memo(() => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Form fields skeleton - 2 columns on larger screens */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {Array.from({ length: 4 }, (_, i) => `form-field-${i}-${Date.now()}`).map((key) => (
              <Box key={key}>
                <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="100%" height={56} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Action buttons skeleton */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Skeleton variant="rounded" width={100} height={40} />
          <Skeleton variant="rounded" width={100} height={40} />
        </Box>
      </CardContent>
    </Card>
  );
});

ProfileFormSkeleton.displayName = 'ProfileFormSkeleton';

// Password Form Skeleton
export const PasswordFormSkeleton = memo(() => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Password fields skeleton */}
          {Array.from({ length: 3 }, (_, i) => `password-field-${i}-${Date.now()}`).map((key) => (
            <Box key={key}>
              <Skeleton variant="text" width={150} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" width="100%" height={56} />
            </Box>
          ))}
        </Box>

        {/* Action buttons skeleton */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Skeleton variant="rounded" width={120} height={40} />
          <Skeleton variant="rounded" width={150} height={40} />
        </Box>
      </CardContent>
    </Card>
  );
});

PasswordFormSkeleton.displayName = 'PasswordFormSkeleton';

// Complete Profile Page Skeleton
export const ProfilePageSkeleton = memo(() => {
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Profile header skeleton */}
      <ProfileHeaderSkeleton />

      {/* Tabs skeleton */}
      <ProfileTabsSkeleton />

      {/* Tab content skeleton */}
      <Box sx={{ mb: 3 }}>
        <ProfileFormSkeleton />
      </Box>
    </Box>
  );
});

ProfilePageSkeleton.displayName = 'ProfilePageSkeleton';
