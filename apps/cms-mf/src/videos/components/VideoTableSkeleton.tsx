import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

interface VideoTableSkeletonProps {
  rows?: number;
}

const VideoTableSkeleton = ({ rows = 5 }: VideoTableSkeletonProps) => (
  <TableContainer component={Paper} variant="outlined">
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Skeleton variant="text" width={200} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="text" width={60} /></TableCell>
          <TableCell><Skeleton variant="text" width={60} /></TableCell>
          <TableCell><Skeleton variant="text" width={80} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(rows)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="rectangular" width={60} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={150} />
              </Box>
            </TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={40} /></TableCell>
            <TableCell><Skeleton variant="text" width={40} /></TableCell>
            <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default VideoTableSkeleton;
