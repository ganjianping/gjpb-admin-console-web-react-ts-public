import { Box, Chip, Typography, Avatar } from '@mui/material';
import { Video as LucideVideo } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Video } from '../types/video.types';
import { useVideoActionMenu } from '../hooks/useVideoActionMenu';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';
import { getFullVideoUrl } from '../utils/getFullVideoUrl';


function NameCell({ info }: { info: any }) {
  const video = info.row.original as Video;
  const coverUrl = video.coverImageFilename ? `${getFullVideoUrl('/cover-image')}/${video.coverImageFilename}` : '';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar src={coverUrl} alt={video.name} sx={{ width: 60, height: 40 }} variant="rounded">
        {!coverUrl && <LucideVideo size={20} />}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{info.getValue()}</Typography>
    </Box>
  );
}

const columnHelper = createColumnHelper<Video>();

const VideoTable = memo(({ images, pagination, onPageChange, onPageSizeChange, onImageAction, onCopyFilename, onCopyThumbnail }: any) => {
  const { t } = useTranslation();

  const actionMenuItems = useVideoActionMenu({
    onView: (video: Video) => onImageAction(video, 'view'),
    onEdit: (video: Video) => onImageAction(video, 'edit'),
    onDelete: (video: Video) => onImageAction(video, 'delete'),
    onCopyFilename: (video: Video) => onCopyFilename?.(video),
    onCopyThumbnail: (video: Video) => onCopyThumbnail?.(video),
  });


  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('videos.columns.name'),
      cell: (info) => <NameCell info={info} />,
      size: 300, // Set width to 300px (DataTable uses size prop)
    }),
    columnHelper.accessor('tags', {
      header: t('videos.columns.tags'),
      cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
    }),
    columnHelper.accessor('lang', {
      header: t('videos.columns.lang'),
      cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
    }),
    columnHelper.accessor('displayOrder', {
      header: t('videos.columns.displayOrder'),
      cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('isActive', {
      header: t('videos.columns.isActive'),
      cell: (info) => <Typography variant="body2">{info.getValue() ? 'Active' : 'Inactive'}</Typography>,
    }),
    columnHelper.accessor('updatedAt', {
      header: t('videos.columns.updatedAt'),
      cell: (info) => {
        const value = info.getValue();
        if (!value) return <Typography variant="body2">-</Typography>;
        // Try to parse and format as YYYY-MM-DD only
        let dateStr = '-';
        if (typeof value === 'string') {
          // Handles ISO and datetime strings
          const match = value.match(/\d{4}-\d{2}-\d{2}/);
          dateStr = match ? match[0] : value;
        } else if (value instanceof Date) {
          dateStr = value.toISOString().split('T')[0];
        }
        return <Typography variant="body2">{dateStr}</Typography>;
      },
    }),
  ], [t]);

  if (!images?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <LucideVideo size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('videos.noVideosFound')}
        </Typography>
      </Box>
    );
  }

  const sorted = [...images].sort((a: any, b: any) => {
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
      onRowDoubleClick={(video: Video) => onImageAction(video, 'view')}
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

VideoTable.displayName = 'VideoTable';

export default VideoTable;
