import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'; // Initialize user translations
import { AlertTriangle, User as UserIcon } from 'lucide-react';
import type { User } from '../services/userService';

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: () => void;
  loading: boolean;
}

export const DeleteUserDialog = ({
  open,
  onClose,
  user,
  onConfirm,
  loading,
}: DeleteUserDialogProps) => {
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <AlertTriangle size={24} />
        {t('users.actions.deleteUser')}
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            {t('users.deleteWarning')}
          </Typography>
        </Alert>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <UserIcon size={24} />
          <Box>
            <Typography variant="h6">{user.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email || t('users.noEmail')}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {t('users.deleteConfirmation', { username: user.username })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
