import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import type { McqRu } from '../types/mcqRu.types';

interface McqRuTableProps {
  mcqRus: McqRu[];
  onMcqRuAction: (mcqRu: McqRu, action: 'view' | 'edit') => void;
  pagination?: any;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const McqRuTable: React.FC<McqRuTableProps> = ({ mcqRus, onMcqRuAction }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Option A</TableCell>
            <TableCell>Option B</TableCell>
            <TableCell>Option C</TableCell>
            <TableCell>Option D</TableCell>
            <TableCell>Correct Answers</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mcqRus.map((mcqRu) => (
            <TableRow key={mcqRu.id}>
              <TableCell>{mcqRu.question}</TableCell>
              <TableCell>{mcqRu.optionA}</TableCell>
              <TableCell>{mcqRu.optionB}</TableCell>
              <TableCell>{mcqRu.optionC}</TableCell>
              <TableCell>{mcqRu.optionD}</TableCell>
              <TableCell>{mcqRu.correctAnswers}</TableCell>
              <TableCell>
                <Button onClick={() => onMcqRuAction(mcqRu, 'view')}>View</Button>
                <Button onClick={() => onMcqRuAction(mcqRu, 'edit')}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default McqRuTable;