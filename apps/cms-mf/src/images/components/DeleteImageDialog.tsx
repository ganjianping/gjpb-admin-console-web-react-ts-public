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
import type { Image } from '../types/image.types';

interface DeleteImageDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  image: Image | null;
  loading: boolean;
}

const DeleteImageDialog = ({
  open,
  onClose,
  onConfirm,
  image,
  loading,
}: DeleteImageDialogProps) => {
  const { t } = useTranslation();
  if (!image) return null;
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
        {t('images.delete')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning">{t('images.messages.deleteWarning')}</Alert>
          <Typography variant="body1">{t('images.messages.deleteConfirm')}</Typography>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">{t('images.columns.name')}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{image.name}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{t('images.actions.cancel')}</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>{t('images.actions.delete')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteImageDialog;
