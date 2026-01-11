import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';

interface DeleteArticleRuDialogProps {
  open: boolean;
  articleRu?: any;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteArticleRuDialog: React.FC<DeleteArticleRuDialogProps> = ({ open, articleRu, loading, onClose, onConfirm }) => {
  const { t } = useTranslation();
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
      <DialogTitle>{t('articleRus.delete')}</DialogTitle>
      <DialogContent>
        <Typography>{t('articleRus.messages.deleteConfirm')} "{articleRu?.title}"?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('articleRus.actions.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" disabled={loading}>
          {t('articleRus.actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteArticleRuDialog;
