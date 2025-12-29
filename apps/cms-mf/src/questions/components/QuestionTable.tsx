import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Question } from '../types/question.types';
import { useQuestionActionMenu } from '../hooks/useQuestionActionMenu';
import { STATUS_MAPS } from '../constants';

const columnHelper = createColumnHelper<Question>();

const QuestionTable = memo(
  ({
    questions,
    pagination,
    onPageChange,
    onPageSizeChange,
    onQuestionAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useQuestionActionMenu({
      onView: (question: Question) => onQuestionAction(question, 'view'),
      onEdit: (question: Question) => onQuestionAction(question, 'edit'),
      onDelete: (question: Question) => onQuestionAction(question, 'delete'),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor('question', {
          header: t('questions.fields.question'),
          cell: (info) => (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {info.getValue()}
            </Typography>
          ),
          size: 300,
        }),
        
        columnHelper.accessor('tags', {
          header: t('questions.fields.tags'),
          cell: (info) => info.getValue(),
          size: 150,
        }),
        columnHelper.accessor('displayOrder', {
          header: t('questions.fields.displayOrder'),
          cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
          size: 100,
        }),
        columnHelper.accessor('lang', {
          header: t('questions.fields.language'),
          cell: (info) => info.getValue(),
          size: 100,
        }),
        columnHelper.accessor('isActive', {
          header: t('questions.fields.status'),
          cell: (info) => createStatusChip(String(info.getValue()), STATUS_MAPS.active),
          size: 100,
        }),
        columnHelper.accessor('updatedAt', {
            header: t('questions.fields.updatedAt'),
            cell: (info) => {
                const value = info.getValue();
                if (!value) return <Typography variant="body2">-</Typography>;
                let dateStr = '-';
                if (typeof value === 'string') {
                    const match = value.match(/\d{4}-\d{2}-\d{2}/);
                    dateStr = match ? match[0] : value;
                } else if (value && typeof value === 'object' && 'toISOString' in value) {
                    dateStr = (value as Date).toISOString().split('T')[0];
                }
                return <Typography variant="body2">{dateStr}</Typography>;
            },
            size: 100,
        }),
      ],
      [t]
    );

    return (
      <DataTable
        data={questions}
        columns={columns}
        manualPagination
        pageCount={pagination?.totalPages}
        totalRows={pagination?.totalElements}
        currentPage={pagination?.number}
        pageSize={pagination?.size}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(row) => onQuestionAction(row, 'view')}
      />
    );
  }
);

export default QuestionTable;
