import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import type { SentenceRu } from '../types/sentenceRu.types';
import { STATUS_MAPS } from '../constants';
import { format, parseISO } from 'date-fns';

interface SentenceRuTableProps {
  sentences: SentenceRu[];
  loading?: boolean;
  onAction: (sentence: SentenceRu, action: 'view' | 'edit' | 'delete') => void;
}

const SentenceRuTable: React.FC<SentenceRuTableProps> = ({
  sentences,
  loading,
  onAction,
}) => {
  const { t } = useTranslation();

  if (sentences.length === 0 && !loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {t('sentenceRus.noSentencesFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('sentenceRus.columns.name')}</TableCell>
            <TableCell>{t('sentenceRus.columns.phonetic')}</TableCell>
            <TableCell>{t('sentenceRus.columns.translation')}</TableCell>
            <TableCell>{t('sentenceRus.columns.lang')}</TableCell>
            <TableCell>{t('sentenceRus.columns.tags')}</TableCell>
            <TableCell>{t('sentenceRus.columns.displayOrder')}</TableCell>
            <TableCell>{t('sentenceRus.columns.isActive')}</TableCell>
            <TableCell>{t('sentenceRus.columns.updatedAt')}</TableCell>
            <TableCell align="right">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sentences.map((sentence) => {
            const activeStatus = sentence.isActive ? 'true' : 'false';
            const statusConfig = STATUS_MAPS.active[activeStatus];
            
            return (
              <TableRow key={sentence.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {sentence.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {sentence.phonetic || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {sentence.translation || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={sentence.lang} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {sentence.tags || '-'}
                  </Typography>
                </TableCell>
                <TableCell>{sentence.displayOrder ?? '-'}</TableCell>
                <TableCell>
                  <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {sentence.updatedAt ? format(parseISO(sentence.updatedAt), 'yyyy-MM-dd HH:mm') : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title={t('sentenceRus.actions.view')}>
                      <IconButton
                        size="small"
                        onClick={() => onAction(sentence, 'view')}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('sentenceRus.actions.edit')}>
                      <IconButton
                        size="small"
                        onClick={() => onAction(sentence, 'edit')}
                      >
                        <Edit2 size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('sentenceRus.actions.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onAction(sentence, 'delete')}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SentenceRuTable;
