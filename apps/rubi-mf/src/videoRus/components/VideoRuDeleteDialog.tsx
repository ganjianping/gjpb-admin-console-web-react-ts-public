import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { VideoRu } from '../types/videoRu.types';

type Props = {
  open: boolean;
  videoRu: VideoRu | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

const VideoRuDeleteDialog: React.FC<Props> = ({ open, videoRu, loading = false, onClose, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      aria-labelledby="videoRu-delete-dialog-title"
    >
      <DialogTitle id="videoRu-delete-dialog-title">{t('videoRus.delete')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('videoRus.messages.deleteConfirm')}
        </DialogContentText>
        {videoRu && (
          <DialogContentText sx={{ mt: 2, fontWeight: 600 }}>
            {videoRu.name} ({videoRu.filename || '-'})
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{t('videoRus.actions.cancel')}
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
          {t('videoRus.actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoRuDeleteDialog;
