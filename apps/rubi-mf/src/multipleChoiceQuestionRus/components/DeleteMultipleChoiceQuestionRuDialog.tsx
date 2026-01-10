import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { DeleteForever as DeleteIcon } from '@mui/icons-material';
import type { MultipleChoiceQuestionRu } from '../types/multipleChoiceQuestionRu.types';

interface DeleteMultipleChoiceQuestionRuDialogProps {
  open: boolean;
  multipleChoiceQuestionRu: MultipleChoiceQuestionRu | null;
  onClose: () => void;
  onConfirm: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => Promise<void>;
}

const DeleteMultipleChoiceQuestionRuDialog: React.FC<DeleteMultipleChoiceQuestionRuDialogProps> = ({
  open,
  multipleChoiceQuestionRu,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    if (!multipleChoiceQuestionRu) return;

    setLoading(true);
    setError(null);

    try {
      await onConfirm(multipleChoiceQuestionRu);
    } catch (err) {
      setError(t('multipleChoiceQuestionRus.deleteDialog.error'));
      console.error('Failed to delete multipleChoiceQuestionRu', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!multipleChoiceQuestionRu) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6" component="div">
            {t('multipleChoiceQuestionRus.deleteDialog.title')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('multipleChoiceQuestionRus.deleteDialog.confirmMessage')}
          </Typography>

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {t('multipleChoiceQuestionRus.deleteDialog.warningMessage')}
            </Typography>
          </Alert>

          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('multipleChoiceQuestionRus.form.question')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {multipleChoiceQuestionRu.question}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {t('multipleChoiceQuestionRus.form.correctAnswers')}
            </Typography>
            <Typography variant="body2">
              {multipleChoiceQuestionRu.correctAnswers}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('multipleChoiceQuestionRus.common.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={<DeleteIcon />}
        >
          {loading ? t('multipleChoiceQuestionRus.common.pleaseWait') : t('multipleChoiceQuestionRus.deleteDialog.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMultipleChoiceQuestionRuDialog;