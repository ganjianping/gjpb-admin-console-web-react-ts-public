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
import type { ExpressionRu } from '../types/expressionRu.types';
import { STATUS_MAPS } from '../constants';
import { format, parseISO } from 'date-fns';

interface ExpressionRuTableProps {
  expressions: ExpressionRu[];
  loading?: boolean;
  onAction: (expression: ExpressionRu, action: 'view' | 'edit' | 'delete') => void;
}

const ExpressionRuTable: React.FC<ExpressionRuTableProps> = ({
  expressions,
  loading,
  onAction,
}) => {
  const { t } = useTranslation();

  if (expressions.length === 0 && !loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {t('expressionRus.noExpressionsFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('expressionRus.columns.name')}</TableCell>
            <TableCell>{t('expressionRus.columns.phonetic')}</TableCell>
            <TableCell>{t('expressionRus.columns.translation')}</TableCell>
            <TableCell>{t('expressionRus.columns.lang')}</TableCell>
            <TableCell>{t('expressionRus.columns.tags')}</TableCell>
            <TableCell>{t('expressionRus.columns.displayOrder')}</TableCell>
            <TableCell>{t('expressionRus.columns.isActive')}</TableCell>
            <TableCell>{t('expressionRus.columns.updatedAt')}</TableCell>
            <TableCell align="right">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expressions.map((expression) => {
            const activeStatus = expression.isActive ? 'true' : 'false';
            const statusConfig = STATUS_MAPS.active[activeStatus];
            
            return (
              <TableRow key={expression.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {expression.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {expression.phonetic || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {expression.translation || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={expression.lang} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {expression.tags || '-'}
                  </Typography>
                </TableCell>
                <TableCell>{expression.displayOrder ?? '-'}</TableCell>
                <TableCell>
                  <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {expression.updatedAt ? format(parseISO(expression.updatedAt), 'yyyy-MM-dd HH:mm') : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title={t('expressionRus.actions.view')}>
                      <IconButton
                        size="small"
                        onClick={() => onAction(expression, 'view')}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('expressionRus.actions.edit')}>
                      <IconButton
                        size="small"
                        onClick={() => onAction(expression, 'edit')}
                      >
                        <Edit2 size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('expressionRus.actions.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onAction(expression, 'delete')}
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

export default ExpressionRuTable;
