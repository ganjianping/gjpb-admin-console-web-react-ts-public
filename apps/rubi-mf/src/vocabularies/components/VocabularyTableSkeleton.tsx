import { Skeleton, Box } from '@mui/material';
import { memo } from 'react';

const VocabularyTableSkeleton = memo(() => {
  return (
    <Box sx={{ p: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} sx={{ mb: 2, display: 'flex', gap: 1.5 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          <Skeleton variant="rectangular" width={80} height={20} />
          <Skeleton variant="rectangular" width={80} height={20} />
          <Skeleton variant="rectangular" width={100} height={20} />
        </Box>
      ))}
    </Box>
  );
});

VocabularyTableSkeleton.displayName = 'VocabularyTableSkeleton';

export default VocabularyTableSkeleton;
