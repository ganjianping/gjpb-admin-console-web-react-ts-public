import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { memo } from 'react';

interface AuditLogTableSkeletonProps {
  rows?: number;
}

export const AuditLogTableSkeleton = memo(({ rows = 5 }: AuditLogTableSkeletonProps) => {
  const skeletonRows = Array.from({ length: rows }, (_, i) => `skeleton-${i}`);
  
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Timestamp column */}
            <TableCell>
              <Skeleton variant="text" width={100} height={24} />
            </TableCell>
            {/* Request column */}
            <TableCell>
              <Skeleton variant="text" width={120} height={24} />
            </TableCell>
            {/* Response Time column */}
            <TableCell>
              <Skeleton variant="text" width={100} height={24} />
            </TableCell>
            {/* Result column */}
            <TableCell>
              <Skeleton variant="text" width={80} height={24} />
            </TableCell>
            {/* Username column */}
            <TableCell>
              <Skeleton variant="text" width={100} height={24} />
            </TableCell>
            {/* IP Address column */}
            <TableCell>
              <Skeleton variant="text" width={100} height={24} />
            </TableCell>
            {/* Actions column */}
            <TableCell>
              <Skeleton variant="text" width={60} height={24} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skeletonRows.map((key) => (
            <TableRow key={key}>
              {/* Timestamp with date and time */}
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Skeleton variant="text" width={100} height={18} />
                  <Skeleton variant="text" width={70} height={14} />
                </Box>
              </TableCell>
              {/* Request with method chip and endpoint */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="rounded" width={42} height={20} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="text" width={200} height={20} />
                </Box>
              </TableCell>
              {/* Response time */}
              <TableCell>
                <Skeleton variant="text" width={60} height={20} />
              </TableCell>
              {/* Result status */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={16} height={16} />
                  <Skeleton variant="text" width={70} height={20} />
                </Box>
              </TableCell>
              {/* Username with icon */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={16} height={16} />
                  <Skeleton variant="text" width={100} height={20} />
                </Box>
              </TableCell>
              {/* IP Address */}
              <TableCell>
                <Skeleton variant="text" width={110} height={20} />
              </TableCell>
              {/* Actions menu */}
              <TableCell>
                <Skeleton variant="circular" width={32} height={32} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination skeleton */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Skeleton variant="text" width={120} height={24} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </TableContainer>
  );
});

AuditLogTableSkeleton.displayName = 'AuditLogTableSkeleton';
