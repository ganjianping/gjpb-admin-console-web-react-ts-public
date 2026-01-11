import { Box, Skeleton, Card, CardContent } from '@mui/material';

const FillBlankQuestionRuTableSkeleton = () => {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width="20%" height={30} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>

        {/* Table Rows */}
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="text" width="15%" />
            <Skeleton variant="text" width="10%" />
            <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          </Box>
        ))}

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Skeleton variant="text" width="15%" height={30} />
          <Skeleton variant="rectangular" width={200} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FillBlankQuestionRuTableSkeleton;
