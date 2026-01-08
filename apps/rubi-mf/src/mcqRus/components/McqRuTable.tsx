import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { McqRu } from '../types/mcqRu.types';
import { useMcqRuActionMenu } from '../hooks/useMcqRuActionMenu';
import { STATUS_MAPS } from '../constants';

const columnHelper = createColumnHelper<McqRu>();

interface McqRuTableProps {
  mcqRus: McqRu[];
  pagination?: any;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onMcqRuAction: (mcqRu: McqRu, action: 'view' | 'edit' | 'delete') => void;
}

const McqRuTable = memo(
  ({
    mcqRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onMcqRuAction,
  }: McqRuTableProps) => {
    const { t } = useTranslation();

    const actionMenuItems = useMcqRuActionMenu({
      onView: (mcqRu: McqRu) => onMcqRuAction(mcqRu, 'view'),
      onEdit: (mcqRu: McqRu) => onMcqRuAction(mcqRu, 'edit'),
      onDelete: (mcqRu: McqRu) => onMcqRuAction(mcqRu, 'delete'),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor('question', {
          header: t('mcqRus.columns.question'),
          cell: (info) => {
            const question = info.getValue() as string;
            if (!question) return <Typography variant="body2">-</Typography>;
            
            const words = question.split(/\s+/);
            const displayText = words.length > 20 
              ? words.slice(0, 20).join(' ') + '...'
              : question;
            
            return <Typography variant="body2">{displayText}</Typography>;
          },
          size: 300,
        }),
        columnHelper.accessor('isMultipleCorrect', {
          header: t('mcqRus.columns.isMultipleCorrect'),
          cell: (info) => (
            <Typography variant="body2">
              {info.getValue() ? t('mcqRus.multipleChoice') : t('mcqRus.singleChoice')}
            </Typography>
          ),
        }),
        columnHelper.accessor('tags', {
          header: t('mcqRus.columns.tags'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('lang', {
          header: t('mcqRus.columns.lang'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('displayOrder', {
          header: t('mcqRus.columns.displayOrder'),
          cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('isActive', {
          header: t('mcqRus.columns.isActive'),
          cell: (info) => {
            const isActive = info.getValue();
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {createStatusChip(isActive?.toString?.() ?? String(!!isActive), STATUS_MAPS.active)}
              </Box>
            );
          },
        }),
      ],
      [t],
    );

    if (!mcqRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('mcqRus.noMcqRusFound')}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={mcqRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(mcqRu: McqRu) => onMcqRuAction(mcqRu, 'view')}
        manualPagination={!!pagination}
        pageCount={pagination?.totalPages || 0}
        currentPage={pagination?.page || 0}
        pageSize={pagination?.size || 20}
        totalRows={pagination?.totalElements || 0}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  },
);

McqRuTable.displayName = 'McqRuTable';

export default McqRuTable;