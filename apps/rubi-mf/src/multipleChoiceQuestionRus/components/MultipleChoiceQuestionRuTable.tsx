import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { MultipleChoiceQuestionRu } from '../types/multipleChoiceQuestionRu.types';
import { useMultipleChoiceQuestionRuActionMenu } from '../hooks/useMultipleChoiceQuestionRuActionMenu';
import { STATUS_MAPS, DIFFICULTY_LEVELS, LANGUAGES } from '../constants';

const columnHelper = createColumnHelper<MultipleChoiceQuestionRu>();

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

    const getDifficultyLevelLabel = (value: string) => {
      const level = DIFFICULTY_LEVELS.find(l => l.value === value);
      return level ? t(`multipleChoiceQuestionRus.difficultyLevels.${level.value}`) : value;
    };

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
            if (!question) return <Typography variant="body2">-</Typography>;

            const displayText = question.length > 70
              ? question.substring(0, 70) + '...'
              : question;

            return <Typography variant="body2">{displayText}</Typography>;
          },
          size: 300,
        }),
        columnHelper.accessor('difficultyLevel', {
          header: t('multipleChoiceQuestionRus.columns.difficultyLevel'),
          cell: (info) => <Typography variant="body2">{getDifficultyLevelLabel(info.getValue() || '') || '-'}</Typography>,
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