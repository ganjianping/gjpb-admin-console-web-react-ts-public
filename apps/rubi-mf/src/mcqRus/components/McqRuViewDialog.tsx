import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import type { McqRu } from '../types/mcqRu.types';

interface McqRuViewDialogProps {
  open: boolean;
  onClose: () => void;
  mcqRu: McqRu | null;
}

const McqRuViewDialog: React.FC<McqRuViewDialogProps> = ({ open, onClose, mcqRu }) => {
  if (!mcqRu) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>View MCQ</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Question:</Typography>
        <Typography>{mcqRu.question}</Typography>
        <Typography variant="h6">Options:</Typography>
        <Typography>A: {mcqRu.optionA}</Typography>
        <Typography>B: {mcqRu.optionB}</Typography>
        <Typography>C: {mcqRu.optionC}</Typography>
        <Typography>D: {mcqRu.optionD}</Typography>
        <Typography variant="h6">Correct Answers:</Typography>
        <Typography>{mcqRu.correctAnswers}</Typography>
        <Typography variant="h6">Explanation:</Typography>
        <Typography>{mcqRu.explanation}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default McqRuViewDialog;