import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { memo } from 'react';

interface LogoTableSkeletonProps {
  rows?: number;
}

export const LogoTableSkeleton = memo(({ rows = 5 }: LogoTableSkeletonProps) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Name column */}
            <TableCell>
              <Skeleton variant="text" width={120} height={24} />
            </TableCell>
            {/* Filename column */}
            <TableCell>
              <Skeleton variant="text" width={100} height={24} />
            </TableCell>
            {/* Language column */}
            <TableCell>
              <Skeleton variant="text" width={80} height={24} />
            </TableCell>
            {/* Tags column */}
            <TableCell>
              <Skeleton variant="text" width={80} height={24} />
            </TableCell>
            {/* Display Order column */}
            <TableCell>
              <Skeleton variant="text" width={80} height={24} />
            </TableCell>
            {/* Status column */}
            <TableCell>
              <Skeleton variant="text" width={80} height={24} />
            </TableCell>
            {/* Updated At column */}
            <TableCell>
              <Skeleton variant="text" width={120} height={24} />
            </TableCell>
            {/* Actions column */}
            <TableCell>
              <Skeleton variant="text" width={60} height={24} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={`skeleton-row-${index}`}>
              {/* Name with avatar */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="rounded" width={32} height={32} />
                  <Skeleton variant="text" width={150} height={20} />
                </Box>
              </TableCell>
              {/* Filename */}
              <TableCell>
                <Skeleton variant="text" width={180} height={20} />
              </TableCell>
              {/* Language chip */}
              <TableCell>
                <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 3 }} />
              </TableCell>
              {/* Tags */}
              <TableCell>
                <Skeleton variant="text" width={100} height={20} />
              </TableCell>
              {/* Display Order */}
              <TableCell>
                <Skeleton variant="text" width={40} height={20} />
              </TableCell>
              {/* Status */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={14} height={14} />
                  <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 3 }} />
                </Box>
              </TableCell>
              {/* Updated at */}
              <TableCell>
                <Skeleton variant="text" width={140} height={20} />
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
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>
    </TableContainer>
  );
});

LogoTableSkeleton.displayName = 'LogoTableSkeleton';
