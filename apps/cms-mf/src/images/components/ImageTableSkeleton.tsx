import { Skeleton, Box } from '@mui/material';

interface ImageTableSkeletonProps {
  rows?: number;
}

const ImageTableSkeleton = ({ rows = 5 }: ImageTableSkeletonProps) => (
  <Box>
    {[...Array(rows)].map((_, i) => (
      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
        <Skeleton variant="rectangular" width={32} height={32} />
        <Skeleton variant="text" width={120} />
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={40} />
        <Skeleton variant="text" width={80} />
      </Box>
    ))}
  </Box>
);

export default ImageTableSkeleton;
