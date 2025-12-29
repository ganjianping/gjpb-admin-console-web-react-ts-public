import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Question } from '../types/question.types';

interface DeleteQuestionDialogProps {
  open: boolean;
  question?: Question | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteQuestionDialog: React.FC<DeleteQuestionDialogProps> = ({ open, question, loading, onClose, onConfirm }) => {
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
      <DialogTitle>{t('questions.delete')}</DialogTitle>
      <DialogContent>
        <Typography>{t('questions.messages.deleteConfirm')} "{question?.question}"?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" disabled={loading}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteQuestionDialog;
