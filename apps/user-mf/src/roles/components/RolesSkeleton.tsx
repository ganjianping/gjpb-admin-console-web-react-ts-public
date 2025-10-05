import { Box, Card, CardContent, Skeleton } from '@mui/material';
import { memo } from 'react';

// Roles Table Skeleton
export const RolesTableSkeleton = memo(() => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={150} height={40} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rounded" width={120} height={40} />
            <Skeleton variant="rounded" width={120} height={40} />
          </Box>
        </Box>

        {/* Search panel skeleton */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width="100%" height={60} />
        </Box>

        {/* Table skeleton */}
        <Box>
          {/* Table header */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}>
            <Skeleton variant="text" width={40} height={24} />
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="text" width={200} height={24} />
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={80} height={24} />
          </Box>

          {/* Table rows */}
          {Array.from({ length: 5 }, (_, i) => `role-row-${i}-${Date.now()}`).map((key) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Skeleton variant="text" width={40} height={20} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={130} height={20} />
              </Box>
              <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: 3 }} />
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: 3 }} />
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          ))}
        </Box>

        {/* Pagination skeleton */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}>
          <Skeleton variant="text" width={150} height={24} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

RolesTableSkeleton.displayName = 'RolesTableSkeleton';

// Complete Roles Page Skeleton
export const RolesPageSkeleton = memo(() => {
  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      {/* Page header skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={200} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={350} height={24} />
      </Box>

      {/* Error alert skeleton (optional) */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="rounded" width="100%" height={60} />
      </Box>

      {/* Table skeleton */}
      <RolesTableSkeleton />
    </Box>
  );
});

RolesPageSkeleton.displayName = 'RolesPageSkeleton';
