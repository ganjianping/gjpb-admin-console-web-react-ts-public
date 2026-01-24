import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { VideoRu } from '../types/videoRu.types';
import { format, parseISO } from 'date-fns';

interface VideoRuViewDialogProps {
  open: boolean;
  videoRu: VideoRu | null;
  onClose: () => void;
}

const VideoRuViewDialog: React.FC<VideoRuViewDialogProps> = ({
  open,
  videoRu,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!videoRu) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('videoRus.view') || 'View Video'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Video Player */}
          {videoRu.fileUrl && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {t('videoRus.form.video') || 'Video'}
              </Typography>
              <video
                controls
                style={{ width: '100%', maxHeight: '400px', borderRadius: '8px' }}
                poster={videoRu.coverImageFileUrl || undefined}
              >
                <source src={videoRu.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}

          <Divider />

          {/* Basic Information */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('videoRus.form.name') || 'Name'}
            </Typography>
            <Typography>{videoRu.name}</Typography>
          </Box>

          {videoRu.description && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('videoRus.form.description') || 'Description'}
              </Typography>
              <Typography>{videoRu.description}</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('videoRus.form.filename') || 'Filename'}
              </Typography>
              <Typography variant="body2">{videoRu.filename || '-'}</Typography>
            </Box>
            {videoRu.sizeBytes && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('videoRus.form.fileSize') || 'File Size'}
                </Typography>
                <Typography variant="body2">
                  {(videoRu.sizeBytes / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            )}
          </Box>

          {videoRu.coverImageFilename && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('videoRus.form.coverImageFilename') || 'Cover Image Filename'}
              </Typography>
              <Typography variant="body2">{videoRu.coverImageFilename}</Typography>
            </Box>
          )}

          {videoRu.coverImageFileUrl && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {t('videoRus.form.coverImage') || 'Cover Image'}
              </Typography>
              <img
                src={videoRu.coverImageFileUrl}
                alt={videoRu.name}
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
              />
            </Box>
          )}

          <Divider />

          {/* Source Information */}
          {(videoRu.sourceName || videoRu.originalUrl) && (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {videoRu.sourceName && (
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('videoRus.form.sourceName') || 'Source Name'}
                    </Typography>
                    <Typography variant="body2">{videoRu.sourceName}</Typography>
                  </Box>
                )}
              </Box>

              {videoRu.originalUrl && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('videoRus.form.originalUrl') || 'Original URL'}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="a"
                    href={videoRu.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {videoRu.originalUrl}
                  </Typography>
                </Box>
              )}
              <Divider />
            </>
          )}

          {/* Classification */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('videoRus.form.lang') || 'Language'}
              </Typography>
              <Chip label={videoRu.lang} size="small" />
            </Box>
            {videoRu.tags && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('videoRus.form.tags') || 'Tags'}
                </Typography>
                <Typography variant="body2">{videoRu.tags}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {videoRu.term && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('videoRus.form.term') || 'Term'}
                </Typography>
                <Typography variant="body2">{videoRu.term}</Typography>
              </Box>
            )}
            {videoRu.week && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('videoRus.form.week') || 'Week'}
                </Typography>
                <Typography variant="body2">{videoRu.week}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('videoRus.form.displayOrder') || 'Display Order'}
              </Typography>
              <Typography variant="body2">{videoRu.displayOrder}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('videoRus.form.isActive') || 'Status'}
              </Typography>
              <Chip
                label={videoRu.isActive ? t('videoRus.status.active') || 'Active' : t('videoRus.status.inactive') || 'Inactive'}
                color={videoRu.isActive ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Box>

          <Divider />

          {/* Timestamps */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {videoRu.createdAt && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('videoRus.form.createdAt') || 'Created At'}
                </Typography>
                <Typography variant="body2">
                  {format(parseISO(videoRu.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
              </Box>
            )}
            {videoRu.updatedAt && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('videoRus.form.updatedAt') || 'Updated At'}
                </Typography>
                <Typography variant="body2">
                  {format(parseISO(videoRu.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          {t('common.close') || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoRuViewDialog;
