import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface Props {
  open: boolean;
  audio?: any;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAudioDialog: React.FC<Props> = ({ open, audio, loading, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete "{audio?.name}"?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={onConfirm} color="error" disabled={loading}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAudioDialog;
