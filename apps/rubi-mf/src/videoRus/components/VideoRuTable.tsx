import { Box, Typography, Avatar } from '@mui/material';
import { Video as LucideVideoRu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { VideoRu } from '../types/videoRu.types';
import { useVideoRuActionMenu } from '../hooks/useVideoRuActionMenu';
// date-fns not required for simple YYYY-MM-DD extraction here
import { STATUS_MAPS } from '../constants';


function NameCell({ info }: { info: any }) {
  const videoRu = info.row.original as VideoRu;
  const coverUrl = videoRu.coverImageFileUrl || '';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar src={coverUrl} alt={videoRu.name} sx={{ width: 60, height: 40 }} variant="rounded">
        {!coverUrl && <LucideVideoRu size={20} />}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{info.getValue()}</Typography>
    </Box>
  );
}

const columnHelper = createColumnHelper<VideoRu>();

const VideoRuTable = memo(({ images, pagination, onPageChange, onPageSizeChange, onImageAction, onCopyFilename, onCopyThumbnail }: any) => {
  const { t } = useTranslation();

  const actionMenuItems = useVideoRuActionMenu({
    onView: (videoRu: VideoRu) => onImageAction(videoRu, 'view'),
    onEdit: (videoRu: VideoRu) => onImageAction(videoRu, 'edit'),
    onDelete: (videoRu: VideoRu) => onImageAction(videoRu, 'delete'),
    onCopyFilename: (videoRu: VideoRu) => onCopyFilename?.(videoRu),
    onCopyThumbnail: (videoRu: VideoRu) => onCopyThumbnail?.(videoRu),
  });


  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('videoRus.columns.name'),
      cell: (info) => <NameCell info={info} />,
      size: 300, // Set width to 300px (DataTable uses size prop)
    }),
    columnHelper.accessor('tags', {
      header: t('videoRus.columns.tags'),
      cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
    }),
    columnHelper.accessor('lang', {
      header: t('videoRus.columns.lang'),
      cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
    }),
    columnHelper.accessor('displayOrder', {
      header: t('videoRus.columns.displayOrder'),
      cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('isActive', {
      header: t('videoRus.columns.isActive'),
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
      header: t('videoRus.columns.updatedAt'),
      cell: (info) => {
        const value = info.getValue();
        if (!value) return <Typography variant="body2">-</Typography>;
        // Try to parse and format as YYYY-MM-DD only
        let dateStr = '-';
        if (typeof value === 'string') {
          // Handles ISO and datetime strings
          const match = value.match(/\d{4}-\d{2}-\d{2}/);
          dateStr = match ? match[0] : value;
        } else {
          // If it's not a string, attempt to convert to Date safely
          try {
            const d = new Date(value as any);
            if (!Number.isNaN(d.getTime())) dateStr = d.toISOString().split('T')[0];
          } catch (error_) {
            // leave as '-'
          }
        }
        return <Typography variant="body2">{dateStr}</Typography>;
      },
    }),
  ], [t]);

  if (!images?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <LucideVideoRu size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('videoRus.noVideoRusFound')}
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
      onRowDoubleClick={(videoRu: VideoRu) => onImageAction(videoRu, 'view')}
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

VideoRuTable.displayName = 'VideoRuTable';

export default VideoRuTable;
