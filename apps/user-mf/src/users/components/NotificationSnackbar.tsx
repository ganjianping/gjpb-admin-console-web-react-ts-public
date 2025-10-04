import { Snackbar, Alert } from '@mui/material';
import type { SnackbarState } from '../../../../shared-lib/src/data-management';

interface NotificationSnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

export const NotificationSnackbar = ({ snackbar, onClose }: NotificationSnackbarProps) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
