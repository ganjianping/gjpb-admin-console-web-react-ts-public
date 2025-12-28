import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

interface ImageTableSkeletonProps {
  rows?: number;
}

const ImageTableSkeleton = ({ rows = 5 }: ImageTableSkeletonProps) => (
  <TableContainer component={Paper} variant="outlined">
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="text" width={60} /></TableCell>
          <TableCell><Skeleton variant="text" width={40} /></TableCell>
          <TableCell><Skeleton variant="text" width={80} /></TableCell>
          <TableCell><Skeleton variant="text" width={40} /></TableCell>
          <TableCell><Skeleton variant="text" width={60} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(rows)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={120} />
              </Box>
            </TableCell>
            <TableCell><Skeleton variant="rounded" width={50} height={24} /></TableCell>
            <TableCell><Skeleton variant="rounded" width={40} height={24} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={30} /></TableCell>
            <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ImageTableSkeleton;
