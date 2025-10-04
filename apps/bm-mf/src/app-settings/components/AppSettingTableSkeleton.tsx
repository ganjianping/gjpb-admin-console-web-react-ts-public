import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { memo } from 'react';

interface AppSettingTableSkeletonProps {
  rows?: number;
}

export const AppSettingTableSkeleton = memo(({ rows = 5 }: AppSettingTableSkeletonProps) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Name column */}
            <TableCell>
              <Skeleton variant="text" width={120} height={24} />
            </TableCell>
            {/* Value column */}
            <TableCell>
              <Skeleton variant="text" width={100} height={24} />
            </TableCell>
            {/* Language column */}
            <TableCell>
              <Skeleton variant="text" width={80} height={24} />
            </TableCell>
            {/* System column */}
            <TableCell>
              <Skeleton variant="text" width={80} height={24} />
            </TableCell>
            {/* Public column */}
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
            <TableRow key={index}>
              {/* Name with icon */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={16} height={16} />
                  <Skeleton variant="text" width={150} height={20} />
                </Box>
              </TableCell>
              {/* Value */}
              <TableCell>
                <Skeleton variant="text" width={180} height={20} />
              </TableCell>
              {/* Language chip */}
              <TableCell>
                <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 3 }} />
              </TableCell>
              {/* System status */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={14} height={14} />
                  <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 3 }} />
                </Box>
              </TableCell>
              {/* Public status */}
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
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>
    </TableContainer>
  );
});

AppSettingTableSkeleton.displayName = 'AppSettingTableSkeleton';
