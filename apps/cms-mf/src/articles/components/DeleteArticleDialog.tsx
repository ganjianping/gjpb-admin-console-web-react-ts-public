import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';

interface DeleteArticleDialogProps {
  open: boolean;
  article?: any;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteArticleDialog: React.FC<DeleteArticleDialogProps> = ({ open, article, loading, onClose, onConfirm }) => {
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
      <DialogTitle>{t('articles.delete')}</DialogTitle>
      <DialogContent>
        <Typography>{t('articles.messages.deleteConfirm')} "{article?.title}"?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('articles.actions.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" disabled={loading}>
          {t('articles.actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteArticleDialog;
