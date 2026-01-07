import { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import type { VocabularyRu } from '../types/vocabularyRu.types';

interface DeleteVocabularyRuDialogProps {
  open: boolean;
  vocabularyRu: VocabularyRu | null;
  onClose: () => void;
  onConfirm: (vocabularyRu: VocabularyRu) => Promise<void>;
}

const DeleteVocabularyRuDialog = ({ open, vocabularyRu, onClose, onConfirm }: DeleteVocabularyRuDialogProps) => {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!vocabularyRu) return;
    setDeleting(true);
    try {
      await onConfirm(vocabularyRu);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <AlertTriangle size={20} color="error" />
        <Typography variant="h6" component="span">
          {t('vocabularyRus.delete')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning">{t('vocabularyRus.messages.deleteConfirmation')}</Alert>
          {vocabularyRu && (
            <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {vocabularyRu.word}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vocabularyRu.definition || '-'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={deleting}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" loading={deleting}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteVocabularyRuDialog;
