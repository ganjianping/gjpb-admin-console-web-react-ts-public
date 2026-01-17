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
import type { ExpressionRu } from '../types/expressionRu.types';
import { format, parseISO } from 'date-fns';

interface ExpressionRuViewDialogProps {
  open: boolean;
  expressionRu: ExpressionRu | null;
  onClose: () => void;
}

const ExpressionRuViewDialog: React.FC<ExpressionRuViewDialogProps> = ({
  open,
  expressionRu,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!expressionRu) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('expressionRus.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('expressionRus.form.name')}
            </Typography>
            <Typography variant="h6">{expressionRu.name}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.phonetic')}
              </Typography>
              <Typography>{expressionRu.phonetic || '-'}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.translation')}
              </Typography>
              <Typography>{expressionRu.translation || '-'}</Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('expressionRus.form.explanation')}
            </Typography>
            <Box 
              sx={{ 
                mt: 1, 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1,
                minHeight: '60px'
              }}
              dangerouslySetInnerHTML={{ __html: expressionRu.explanation || '-' }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('expressionRus.form.example')}
            </Typography>
            <Box 
              sx={{ 
                mt: 1, 
                p: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1,
                minHeight: '60px'
              }}
              dangerouslySetInnerHTML={{ __html: expressionRu.example || '-' }}
            />
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.lang')}
              </Typography>
              <Chip label={expressionRu.lang} size="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.difficultyLevel')}
              </Typography>
              <Chip label={expressionRu.difficultyLevel} size="small" variant="outlined" />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.term')}
              </Typography>
              <Chip label={expressionRu.term ? `Term ${expressionRu.term}` : '-'} size="small" color="secondary" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.week')}
              </Typography>
              <Chip label={expressionRu.week ? `Week ${expressionRu.week}` : '-'} size="small" color="info" />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.tags')}
              </Typography>
              <Typography>{expressionRu.tags || '-'}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.displayOrder')}
              </Typography>
              <Typography>{expressionRu.displayOrder ?? '-'}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('expressionRus.form.isActive')}
            </Typography>
            <Chip 
              label={expressionRu.isActive ? t('expressionRus.status.active') : t('expressionRus.status.inactive')}
              color={expressionRu.isActive ? 'success' : 'default'}
              size="small"
            />
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.createdAt')}
              </Typography>
              <Typography variant="body2">
                {expressionRu.createdAt ? format(parseISO(expressionRu.createdAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('expressionRus.form.updatedAt')}
              </Typography>
              <Typography variant="body2">
                {expressionRu.updatedAt ? format(parseISO(expressionRu.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
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

export default ExpressionRuViewDialog;
