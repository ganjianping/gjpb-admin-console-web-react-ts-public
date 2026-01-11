import { Box, Typography, Avatar } from '@mui/material';
import { Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { ArticleRu } from '../types/articleRu.types';
import { useArticleRuActionMenu } from '../hooks/useArticleRuActionMenu';
import { STATUS_MAPS } from '../constants';

function TitleCell({ info }: Readonly<{ info: any }>) {
  const articleRu = info.row.original as ArticleRu;
  const coverUrl = articleRu.coverImageFileUrl || '';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar src={coverUrl} alt={articleRu.title} sx={{ width: 60, height: 40 }} variant="rounded">
        {!coverUrl && <Newspaper size={20} />}
      </Avatar>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {info.getValue()}
        </Typography>
      </Box>
    </Box>
  );
}

const columnHelper = createColumnHelper<ArticleRu>();

const ArticleRuTable = memo(
  ({
    articleRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onArticleRuAction,
    onCopyCoverImage,
    onCopyOriginalUrl,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useArticleRuActionMenu({
      onView: (articleRu: ArticleRu) => onArticleRuAction(articleRu, 'view'),
      onEdit: (articleRu: ArticleRu) => onArticleRuAction(articleRu, 'edit'),
      onDelete: (articleRu: ArticleRu) => onArticleRuAction(articleRu, 'delete'),
      onCopyCoverImage: onCopyCoverImage ? (articleRu: ArticleRu) => onCopyCoverImage(articleRu) : undefined,
      onCopyOriginalUrl: onCopyOriginalUrl ? (articleRu: ArticleRu) => onCopyOriginalUrl(articleRu) : undefined,
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor('title', {
          header: t('articleRus.columns.title'),
          cell: (info) => <TitleCell info={info} />,
          size: 320,
        }),
        columnHelper.accessor('tags', {
          header: t('articleRus.columns.tags'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('lang', {
          header: t('articleRus.columns.lang'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('displayOrder', {
          header: t('articleRus.columns.displayOrder'),
          cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('isActive', {
          header: t('articleRus.columns.isActive'),
          cell: (info) => {
            const isActive = info.getValue();
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {createStatusChip(isActive?.toString?.() ?? String(!!isActive), STATUS_MAPS.active)}
              </Box>
            );
          },
        }),
        columnHelper.accessor('updatedAt', {
          header: t('articleRus.columns.updatedAt'),
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
        }),
      ],
      [t],
    );

    if (!articleRus?.length) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <Newspaper size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
            {t('articleRus.noArticleRusFound')}
          </Typography>
        </Box>
      );
    }

    const sorted = [...articleRus].sort((a: any, b: any) => {
      if (!a.updatedAt && !b.updatedAt) return 0;
      if (!a.updatedAt) return 1;
      if (!b.updatedAt) return -1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return (
      <DataTable
        data={sorted}
        columns={columns}
        showSearch={false}
        onRowDoubleClick={(articleRu: ArticleRu) => onArticleRuAction(articleRu, 'view')}
        manualPagination={!!pagination}
        pageCount={pagination?.totalPages || 0}
        currentPage={pagination?.page || 0}
        pageSize={pagination?.size || 20}
        totalRows={pagination?.totalElements || 0}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        actionMenuItems={actionMenuItems}
      />
    );
  },
);

ArticleRuTable.displayName = 'ArticleRuTable';

export default ArticleRuTable;
