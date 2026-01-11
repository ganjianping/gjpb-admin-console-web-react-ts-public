import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface Props {
  open: boolean;
  audioRu?: any;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAudioRuDialog: React.FC<Props> = ({ open, audioRu, loading, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete "{audioRu?.name}"?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={onConfirm} color="error" disabled={loading}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAudioRuDialog;
