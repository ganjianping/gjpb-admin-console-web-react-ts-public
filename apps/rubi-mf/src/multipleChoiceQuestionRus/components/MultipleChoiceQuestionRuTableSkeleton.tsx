import React from 'react';
import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MultipleChoiceQuestionRuTableSkeleton: React.FC = () => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Skeleton width={100} /></TableCell>
            <TableCell><Skeleton width={150} /></TableCell>
            <TableCell><Skeleton width={120} /></TableCell>
            <TableCell><Skeleton width={100} /></TableCell>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={100} /></TableCell>
            <TableCell><Skeleton width={120} /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton width={80} />
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton width={200} />
                <Skeleton width={150} />
              </TableCell>
              <TableCell>
                <Skeleton width={100} />
              </TableCell>
              <TableCell>
                <Skeleton width={60} />
              </TableCell>
              <TableCell>
                <Skeleton width={40} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" width={60} height={24} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rectangular" width={32} height={32} />
                  <Skeleton variant="rectangular" width={32} height={32} />
                  <Skeleton variant="rectangular" width={32} height={32} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MultipleChoiceQuestionRuTableSkeleton;