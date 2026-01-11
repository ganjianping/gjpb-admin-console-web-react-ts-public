import { Box, Chip, Typography, Avatar } from '@mui/material';
import { Image as LucideImageRu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { ImageRu } from '../types/imageRu.types';
import { useImageRuActionMenu } from '../hooks/useImageRuActionMenu';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';
// import { ImageRuTableSkeleton } from './ImageRuTableSkeleton';
// import { useImageRuActionMenu } from '../hooks';

function NameCell({ info }: { info: any }) {
  const imageRu = info.row.original;
  const imageRuUrl = imageRu.thumbnailFileUrl || imageRu.fileUrl || '';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {imageRuUrl ? (
        <Avatar src={imageRuUrl} alt={info.getValue()} sx={{ width: 32, height: 32 }} variant="rounded" />
      ) : (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} variant="rounded">
          <LucideImageRu size={16} />
        </Avatar>
      )}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{info.getValue()}</Typography>
    </Box>
  );
}

function ExtensionCell({ info }: { info: any }) {
  const value = info.getValue();
  return (
    <Chip
      label={value || '-'}
      size="small"
      variant="outlined"
      sx={{ fontSize: '0.75rem', height: 24 }}
    />
  );
}

function LangCell({ info }: { info: any }) {
  return (
    <Chip
      label={info.getValue()}
      size="small"
      variant="outlined"
      sx={{ fontSize: '0.75rem', height: 24 }}
    />
  );
}

function TagsCell({ info }: { info: any }) {
  const tags = info.getValue();
  return (
    <Typography
      variant="body2"
      sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      title={tags}
    >
      {tags || '-'}
    </Typography>
  );
}

function DisplayOrderCell({ info }: { info: any }) {
  return <Typography variant="body2">{info.getValue()}</Typography>;
}

function IsActiveCell({ info }: { info: any }) {
  const isActive = info.getValue();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {createStatusChip(isActive.toString(), STATUS_MAPS.active)}
    </Box>
  );
}

function UpdatedAtCell({ info }: { info: any }) {
  const date = info.getValue();
  return date ? format(parseISO(date), 'MMM dd, yyyy') : '-';
}

interface ImageRuTableProps {
  imageRus: ImageRu[];
  pagination?: any;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onImageRuAction: (imageRu: ImageRu, action: 'view' | 'edit' | 'delete') => void;
  onCopyFilename?: (imageRu: ImageRu) => void;
  onCopyThumbnail?: (imageRu: ImageRu) => void;
}

const columnHelper = createColumnHelper<ImageRu>();

const ImageRuTable = memo(({ 
  imageRus, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onImageRuAction,
  onCopyFilename,
  onCopyThumbnail,
}: ImageRuTableProps) => {
  const { t } = useTranslation();

  // TODO: Add action menu hook for imageRus
  const actionMenuItems = useImageRuActionMenu({
    onView: (imageRu: ImageRu) => onImageRuAction(imageRu, 'view'),
    onEdit: (imageRu: ImageRu) => onImageRuAction(imageRu, 'edit'),
    onDelete: (imageRu: ImageRu) => onImageRuAction(imageRu, 'delete'),
    onCopyFilename: (imageRu: ImageRu) => onCopyFilename?.(imageRu),
    onCopyThumbnail: (imageRu: ImageRu) => onCopyThumbnail?.(imageRu),
  });

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('imageRus.columns.name'),
      cell: (info) => <NameCell info={info} />,
    }),
    columnHelper.accessor('extension', {
      header: t('imageRus.columns.extension'),
      cell: (info) => <ExtensionCell info={info} />,
    }),
    columnHelper.accessor('lang', {
      header: t('imageRus.columns.lang'),
      cell: (info) => <LangCell info={info} />,
    }),
    columnHelper.accessor('tags', {
      header: t('imageRus.columns.tags'),
      cell: (info) => <TagsCell info={info} />,
    }),
    columnHelper.accessor('displayOrder', {
      header: t('imageRus.columns.displayOrder'),
      cell: (info) => <DisplayOrderCell info={info} />,
    }),
    columnHelper.accessor('isActive', {
      header: t('imageRus.columns.isActive'),
      cell: (info) => <IsActiveCell info={info} />,
    }),
    columnHelper.accessor('updatedAt', {
      header: t('imageRus.columns.updatedAt'),
      cell: (info) => <UpdatedAtCell info={info} />,
    }),
  ], [t]);

  // Show skeleton loader while loading
  // if (loading && !imageRus.length) {
  //   return <ImageRuTableSkeleton rows={5} />;
  // }

  // Show empty state
  if (!imageRus?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <LucideImageRu size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('imageRus.noImageRusFound')}
        </Typography>
      </Box>
    );
  }

  // Sort imageRus by updatedAt desc
  const sortedImageRus = [...imageRus].sort((a, b) => {
    if (!a.updatedAt && !b.updatedAt) return 0;
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <DataTable
      data={sortedImageRus}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(imageRu: ImageRu) => onImageRuAction(imageRu, 'view')}
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
});

ImageRuTable.displayName = 'ImageRuTable';

export default ImageRuTable;
