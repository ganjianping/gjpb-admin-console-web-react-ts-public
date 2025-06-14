import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface RefreshWarningDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  actionButtonText: string;
}

/**
 * Confirmation dialog that warns users about losing their login session
 */
export const RefreshWarningDialog: React.FC<RefreshWarningDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  message,
  actionButtonText
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            padding: 1
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        pb: 2
      }}>
        <Warning color="warning" fontSize="large" />
        <Typography variant="h6" component="span">
          Warning: You will be logged out
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
        
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'warning.light', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Warning color="warning" fontSize="small" />
          <Typography variant="body2" color="warning.dark">
            <strong>Important:</strong> You will need to sign in again after this action.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button 
          onClick={onCancel} 
          color="primary"
          variant="outlined"
          size="large"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="warning" 
          variant="contained"
          size="large"
          startIcon={<Warning />}
        >
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefreshWarningDialog;
