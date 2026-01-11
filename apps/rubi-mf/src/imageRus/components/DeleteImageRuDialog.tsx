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
import type { ImageRu } from '../types/imageRu.types';

interface DeleteImageRuDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageRu: ImageRu | null;
  loading: boolean;
}

const DeleteImageRuDialog = ({
  open,
  onClose,
  onConfirm,
  imageRu,
  loading,
}: DeleteImageRuDialogProps) => {
  const { t } = useTranslation();
  if (!imageRu) return null;
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
        {t('imageRus.delete')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning">{t('imageRus.messages.deleteWarning')}</Alert>
          <Typography variant="body1">{t('imageRus.messages.deleteConfirm')}</Typography>
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">{t('imageRus.columns.name')}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{imageRu.name}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{t('imageRus.actions.cancel')}</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>{t('imageRus.actions.delete')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteImageRuDialog;
