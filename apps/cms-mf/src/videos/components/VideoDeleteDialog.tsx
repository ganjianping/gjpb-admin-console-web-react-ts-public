import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Video } from '../types/video.types';

type Props = {
  open: boolean;
  video: Video | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

const VideoDeleteDialog: React.FC<Props> = ({ open, video, loading = false, onClose, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      aria-labelledby="video-delete-dialog-title"
    >
      <DialogTitle id="video-delete-dialog-title">{t('videos.delete')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('videos.messages.deleteConfirm')}
        </DialogContentText>
        {video && (
          <DialogContentText sx={{ mt: 2, fontWeight: 600 }}>
            {video.name} ({video.filename || '-'})
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{t('videos.actions.cancel')}
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
          {t('videos.actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoDeleteDialog;
