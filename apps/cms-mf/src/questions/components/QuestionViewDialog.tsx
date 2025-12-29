import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Question } from '../types/question.types';
import { createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from '../constants';

interface QuestionViewDialogProps {
  open: boolean;
  onClose: () => void;
  question: Question;
}

const QuestionViewDialog = ({ open, onClose, question }: QuestionViewDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('questions.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('questions.fields.question')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {question.question}
            </Typography>
          </Box>
          
          <Divider />
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('questions.fields.answer')}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {question.answer}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('questions.fields.language')}
              </Typography>
              <Typography variant="body2">{question.lang}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('questions.fields.status')}
              </Typography>
              {createStatusChip(String(question.isActive), STATUS_MAPS.active)}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('questions.fields.displayOrder')}
              </Typography>
              <Typography variant="body2">{question.displayOrder}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              {t('questions.fields.tags')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {question.tags?.split(',').map((tag) => (
                <Chip key={tag} label={tag.trim()} size="small" />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionViewDialog;
