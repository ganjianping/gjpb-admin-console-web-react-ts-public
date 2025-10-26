import React from 'react';
import { Box, Skeleton } from '@mui/material';

const ArticleTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Box>
    {Array.from({ length: rows }).map((_, idx) => (
      <Skeleton key={`article-skeleton-${rows}-${idx}`} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
    ))}
  </Box>
);

export default ArticleTableSkeleton;
