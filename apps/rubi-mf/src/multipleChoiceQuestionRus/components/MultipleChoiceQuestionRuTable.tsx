import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { MultipleChoiceQuestionRu } from '../types/multipleChoiceQuestionRu.types';
import { useMultipleChoiceQuestionRuActionMenu } from '../hooks/useMultipleChoiceQuestionRuActionMenu';
import { STATUS_MAPS, LANGUAGES } from '../constants';

const columnHelper = createColumnHelper<MultipleChoiceQuestionRu>();

// Utility function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html: string, maxLength: number = 60): string => {
  if (!html) return '-';
  
  // Strip HTML tags
  const stripped = html.replace(/<[^>]*>/g, '');
  
  // Truncate to maxLength characters
  if (stripped.length <= maxLength) return stripped;
  
  return stripped.substring(0, maxLength) + '...';
};

interface MultipleChoiceQuestionRuTableProps {
  multipleChoiceQuestionRus: MultipleChoiceQuestionRu[];
  pagination?: any;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onMultipleChoiceQuestionRuAction: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu, action: 'view' | 'edit' | 'delete') => void;
}

const MultipleChoiceQuestionRuTable = memo(
  ({
    multipleChoiceQuestionRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onMultipleChoiceQuestionRuAction,
  }: MultipleChoiceQuestionRuTableProps) => {
    const { t } = useTranslation();

    const actionMenuItems = useMultipleChoiceQuestionRuActionMenu({
      onView: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => onMultipleChoiceQuestionRuAction(multipleChoiceQuestionRu, 'view'),
      onEdit: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => onMultipleChoiceQuestionRuAction(multipleChoiceQuestionRu, 'edit'),
      onDelete: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => onMultipleChoiceQuestionRuAction(multipleChoiceQuestionRu, 'delete'),
    });

    const getLanguageLabel = (value: string) => {
      const lang = LANGUAGES.find(l => l.value === value);
      return lang ? lang.label : value;
    };

    const columns = useMemo(
      () => [
        columnHelper.accessor('question', {
          header: t('multipleChoiceQuestionRus.columns.question'),
          cell: (info) => {
            const question = info.getValue();
            const displayText = stripHtmlAndTruncate(question);
            return <Typography variant="body2">{displayText}</Typography>;
          },
          size: 300,
        }),
        columnHelper.accessor('tags', {
          header: t('multipleChoiceQuestionRus.columns.tags'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('lang', {
          header: t('multipleChoiceQuestionRus.columns.lang'),
          cell: (info) => <Typography variant="body2">{getLanguageLabel(info.getValue() || '') || '-'}</Typography>,
        }),
        columnHelper.accessor('displayOrder', {
          header: t('multipleChoiceQuestionRus.columns.displayOrder'),
          cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('successCount', {
          header: t('multipleChoiceQuestionRus.columns.successCount'),
          cell: (info) => <Typography variant="body2">{info.getValue() || 0}</Typography>,
        }),
        columnHelper.accessor('failCount', {
          header: t('multipleChoiceQuestionRus.columns.failCount'),
          cell: (info) => <Typography variant="body2">{info.getValue() || 0}</Typography>,
        }),
        columnHelper.accessor('isActive', {
          header: t('multipleChoiceQuestionRus.columns.isActive'),
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

    if (!multipleChoiceQuestionRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('multipleChoiceQuestionRus.noMultipleChoiceQuestionRusFound')}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={multipleChoiceQuestionRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => onMultipleChoiceQuestionRuAction(multipleChoiceQuestionRu, 'view')}
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

MultipleChoiceQuestionRuTable.displayName = 'MultipleChoiceQuestionRuTable';

export default MultipleChoiceQuestionRuTable;