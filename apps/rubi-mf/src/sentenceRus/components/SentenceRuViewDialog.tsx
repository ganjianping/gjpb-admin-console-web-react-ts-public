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
import type { SentenceRu } from '../types/sentenceRu.types';
import { format, parseISO } from 'date-fns';

interface SentenceRuViewDialogProps {
  open: boolean;
  sentenceRu: SentenceRu | null;
  onClose: () => void;
}

const SentenceRuViewDialog: React.FC<SentenceRuViewDialogProps> = ({
  open,
  sentenceRu,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!sentenceRu) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('sentenceRus.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('sentenceRus.form.name')}
            </Typography>
            <Typography variant="h6">{sentenceRu.name}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.phonetic')}
              </Typography>
              <Typography>{sentenceRu.phonetic || '-'}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.translation')}
              </Typography>
              <Typography>{sentenceRu.translation || '-'}</Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('sentenceRus.form.explanation')}
            </Typography>
            <Typography>{sentenceRu.explanation || '-'}</Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.lang')}
              </Typography>
              <Chip label={sentenceRu.lang} size="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.difficultyLevel')}
              </Typography>
              <Chip label={sentenceRu.difficultyLevel} size="small" variant="outlined" />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.tags')}
              </Typography>
              <Typography>{sentenceRu.tags || '-'}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.displayOrder')}
              </Typography>
              <Typography>{sentenceRu.displayOrder ?? '-'}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('sentenceRus.form.isActive')}
            </Typography>
            <Chip 
              label={sentenceRu.isActive ? t('sentenceRus.status.active') : t('sentenceRus.status.inactive')}
              color={sentenceRu.isActive ? 'success' : 'default'}
              size="small"
            />
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.createdAt')}
              </Typography>
              <Typography variant="body2">
                {sentenceRu.createdAt ? format(parseISO(sentenceRu.createdAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('sentenceRus.form.updatedAt')}
              </Typography>
              <Typography variant="body2">
                {sentenceRu.updatedAt ? format(parseISO(sentenceRu.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SentenceRuViewDialog;
