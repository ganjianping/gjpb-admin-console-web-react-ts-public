import { Box, Typography, Avatar } from '@mui/material';
import { Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Article } from '../types/article.types';
import { useArticleActionMenu } from '../hooks/useArticleActionMenu';
import { STATUS_MAPS } from '../constants';
import { getFullArticleCoverImageUrl } from '../utils/getFullArticleImageUrl';

function TitleCell({ info }: Readonly<{ info: any }>) {
  const article = info.row.original as Article;
  const coverUrl = getFullArticleCoverImageUrl(`/${article.coverImageFilename}`);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar src={coverUrl} alt={article.title} sx={{ width: 60, height: 40 }} variant="rounded">
        {!coverUrl && <Newspaper size={20} />}
      </Avatar>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {info.getValue()}
        </Typography>
        {article.summary && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {article.summary.slice(0, 80)}
            {article.summary.length > 80 ? '…' : ''}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

const columnHelper = createColumnHelper<Article>();

const ArticleTable = memo(
  ({
    articles,
    pagination,
    onPageChange,
    onPageSizeChange,
    onArticleAction,
    onCopyCoverImage,
    onCopyOriginalUrl,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useArticleActionMenu({
      onView: (article: Article) => onArticleAction(article, 'view'),
      onEdit: (article: Article) => onArticleAction(article, 'edit'),
      onDelete: (article: Article) => onArticleAction(article, 'delete'),
      onCopyCoverImage: onCopyCoverImage ? (article: Article) => onCopyCoverImage(article) : undefined,
      onCopyOriginalUrl: onCopyOriginalUrl ? (article: Article) => onCopyOriginalUrl(article) : undefined,
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor('title', {
          header: t('articles.columns.title'),
          cell: (info) => <TitleCell info={info} />,
          size: 320,
        }),
        columnHelper.accessor('tags', {
          header: t('articles.columns.tags'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('lang', {
          header: t('articles.columns.lang'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('displayOrder', {
          header: t('articles.columns.displayOrder'),
          cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('isActive', {
          header: t('articles.columns.isActive'),
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
          header: t('articles.columns.updatedAt'),
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

    if (!articles?.length) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <Newspaper size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
            {t('articles.noArticlesFound')}
          </Typography>
        </Box>
      );
    }

    const sorted = [...articles].sort((a: any, b: any) => {
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
        onRowDoubleClick={(article: Article) => onArticleAction(article, 'view')}
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

ArticleTable.displayName = 'ArticleTable';

export default ArticleTable;
