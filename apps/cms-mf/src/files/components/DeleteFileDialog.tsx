import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import { AlertTriangle } from 'lucide-react';
import type { CmsFile } from '../types/file.types';

interface DeleteFileDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  file: CmsFile | null;
  loading: boolean;
}

const DeleteFileDialog = ({
  open,
  onClose,
  onConfirm,
  file,
  loading,
}: DeleteFileDialogProps) => {
  const { t } = useTranslation();
  if (!file) return null;
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main' }}>
        <AlertTriangle size={24} />
        {t('files.delete')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning">{t('files.messages.deleteWarning')}</Alert>
          <Typography variant="body1">{t('files.messages.deleteConfirm')}</Typography>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">{t('files.columns.name')}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{file.name}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{t('files.actions.cancel')}</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>{t('files.actions.delete')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFileDialog;
