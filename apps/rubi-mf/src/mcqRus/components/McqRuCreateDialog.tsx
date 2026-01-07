import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import type { McqRuFormData } from '../types/mcqRu.types';

interface McqRuCreateDialogProps {
  open: boolean;
  onClose: () => void;
  formData: McqRuFormData;
  setFormData: (data: McqRuFormData) => void;
  loading: boolean;
  onSubmit: () => void;
}

const McqRuCreateDialog: React.FC<McqRuCreateDialogProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  loading,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create MCQ</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Question"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Option A"
          value={formData.optionA}
          onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Option B"
          value={formData.optionB}
          onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Option C"
          value={formData.optionC}
          onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Option D"
          value={formData.optionD}
          onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Correct Answers"
          value={formData.correctAnswers}
          onChange={(e) => setFormData({ ...formData, correctAnswers: e.target.value })}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} disabled={loading}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default McqRuCreateDialog;