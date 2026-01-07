import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import type { McqRu } from '../types/mcqRu.types';

interface DeleteMcqRuDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mcqRu: McqRu | null;
}

const DeleteMcqRuDialog: React.FC<DeleteMcqRuDialogProps> = ({ open, onClose, onConfirm, mcqRu }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete MCQ</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this MCQ?</Typography>
        {mcqRu && <Typography>{mcqRu.question}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMcqRuDialog;