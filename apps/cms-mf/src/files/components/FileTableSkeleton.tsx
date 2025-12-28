import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface FileTableSkeletonProps {
  rows?: number;
}

const FileTableSkeleton = ({ rows = 5 }: FileTableSkeletonProps) => (
  <TableContainer component={Paper} variant="outlined">
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="text" width={150} /></TableCell>
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
            <TableCell><Skeleton variant="text" width={120} /></TableCell>
            <TableCell><Skeleton variant="text" width={180} /></TableCell>
            <TableCell><Skeleton variant="text" width={60} /></TableCell>
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

export default FileTableSkeleton;
