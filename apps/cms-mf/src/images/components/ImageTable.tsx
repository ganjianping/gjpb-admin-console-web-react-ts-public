import { Box, Chip, Typography, Avatar } from '@mui/material';
import { Image as LucideImage } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Image } from '../types/image.types';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';
import { getFullImageUrl } from '../utils/getFullImageUrl';
// import { ImageTableSkeleton } from './ImageTableSkeleton';
// import { useImageActionMenu } from '../hooks';

function NameCell({ info }: { info: any }) {
  const image = info.row.original;
  const imageUrl = getFullImageUrl(image.thumbnailFilename || image.filename || '');
  console.log('Image URL:', imageUrl); // Debug log
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {imageUrl ? (
        <Avatar src={imageUrl} alt={info.getValue()} sx={{ width: 32, height: 32 }} variant="rounded" />
      ) : (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} variant="rounded">
          <LucideImage size={16} />
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

interface ImageTableProps {
  images: Image[];
  loading?: boolean;
  pagination?: any;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onImageAction: (image: Image, action: 'view' | 'edit' | 'delete') => void;
  onCopyFilename?: (image: Image) => void;
}

const columnHelper = createColumnHelper<Image>();

const ImageTable = memo(({ 
  images, 
  loading = false, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onImageAction,
  onCopyFilename 
}: ImageTableProps) => {
  const { t } = useTranslation();

  // TODO: Add action menu hook for images
  // const actionMenuItems = useImageActionMenu({
  //   onView: (image: Image) => onImageAction(image, 'view'),
  //   onEdit: (image: Image) => onImageAction(image, 'edit'),
  //   onDelete: (image: Image) => onImageAction(image, 'delete'),
  //   onCopyFilename: (image: Image) => onCopyFilename?.(image),
  // });

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('images.columns.name'),
      cell: (info) => <NameCell info={info} />,
    }),
    columnHelper.accessor('extension', {
      header: t('images.columns.extension'),
      cell: (info) => <ExtensionCell info={info} />,
    }),
    columnHelper.accessor('lang', {
      header: t('images.columns.lang'),
      cell: (info) => <LangCell info={info} />,
    }),
    columnHelper.accessor('tags', {
      header: t('images.columns.tags'),
      cell: (info) => <TagsCell info={info} />,
    }),
    columnHelper.accessor('displayOrder', {
      header: t('images.columns.displayOrder'),
      cell: (info) => <DisplayOrderCell info={info} />,
    }),
    columnHelper.accessor('isActive', {
      header: t('images.columns.isActive'),
      cell: (info) => <IsActiveCell info={info} />,
    }),
    columnHelper.accessor('updatedAt', {
      header: t('images.columns.updatedAt'),
      cell: (info) => <UpdatedAtCell info={info} />,
    }),
  ], [t]);

  // Show skeleton loader while loading
  // if (loading && !images.length) {
  //   return <ImageTableSkeleton rows={5} />;
  // }

  // Show empty state
  if (!images?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <LucideImage size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('images.noImagesFound')}
        </Typography>
      </Box>
    );
  }

  // Sort images by updatedAt desc
  const sortedImages = [...images].sort((a, b) => {
    if (!a.updatedAt && !b.updatedAt) return 0;
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <DataTable
      data={sortedImages}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(image: Image) => onImageAction(image, 'view')}
      manualPagination={!!pagination}
      pageCount={pagination?.totalPages || 0}
      currentPage={pagination?.page || 0}
      pageSize={pagination?.size || 20}
      totalRows={pagination?.totalElements || 0}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      // actionMenuItems={actionMenuItems}
    />
  );
});

ImageTable.displayName = 'ImageTable';

export default ImageTable;
