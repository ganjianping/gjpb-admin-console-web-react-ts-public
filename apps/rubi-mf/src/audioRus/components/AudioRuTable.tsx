import { Box, Typography, Avatar } from '@mui/material';
import { Music as LucideMusic } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { AudioRu } from '../types/audioRu.types';
import { useAudioRuActionMenu } from '../hooks/useAudioRuActionMenu';
// date-fns not needed here
import { STATUS_MAPS } from '../constants';


function NameCell({ info }: Readonly<{ info: any }>) {
  const audioRu = info.row.original as AudioRu;
  const coverUrl = audioRu.coverImageFileUrl || '';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar src={coverUrl} alt={audioRu.name} sx={{ width: 60, height: 40 }} variant="rounded">
        {!coverUrl && <LucideMusic size={20} />}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{info.getValue()}</Typography>
    </Box>
  );
}

const columnHelper = createColumnHelper<AudioRu>();

const AudioRuTable = memo(({ audioRus, pagination, onPageChange, onPageSizeChange, onAudioRuAction, onCopyFilename, onCopyThumbnail }: any) => {
  const { t } = useTranslation();

  const actionMenuItems = useAudioRuActionMenu({
    onView: (audioRu: AudioRu) => onAudioRuAction(audioRu, 'view'),
    onEdit: (audioRu: AudioRu) => onAudioRuAction(audioRu, 'edit'),
    onDelete: (audioRu: AudioRu) => onAudioRuAction(audioRu, 'delete'),
    onCopyFilename: (audioRu: AudioRu) => onCopyFilename?.(audioRu),
    onCopyThumbnail: (audioRu: AudioRu) => onCopyThumbnail?.(audioRu),
  });


  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('audioRus.columns.name'),
      cell: (info) => <NameCell info={info} />,
      size: 300,
    }),
    columnHelper.accessor('artist', {
      header: t('audioRus.columns.artist'),
      cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
    }),
    columnHelper.accessor('tags', {
      header: t('audioRus.columns.tags'),
      cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
    }),
    columnHelper.accessor('lang', {
      header: t('audioRus.columns.lang'),
      cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
    }),
    columnHelper.accessor('displayOrder', {
      header: t('audioRus.columns.displayOrder'),
      cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
    }),
    columnHelper.accessor('isActive', {
      header: t('audioRus.columns.isActive'),
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
      header: t('audioRus.columns.updatedAt'),
      cell: (info) => {
        const value = info.getValue();
        if (!value) return <Typography variant="body2">-</Typography>;
        let dateStr = '-';
        if (typeof value === 'string') {
          const match = value.match(/\d{4}-\d{2}-\d{2}/);
          dateStr = match ? match[0] : value;
        } else if (value && typeof value === 'object' && 'toISOString' in value) {
          // value looks like a Date-like object
          // @ts-ignore
          dateStr = value.toISOString().split('T')[0];
        }
        return <Typography variant="body2">{dateStr}</Typography>;
      },
    }),
  ], [t]);

  if (!audioRus?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
  <LucideMusic size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('audioRus.noAudioRusFound')}
        </Typography>
      </Box>
    );
  }

  const sorted = [...audioRus].sort((a: any, b: any) => {
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
      onRowDoubleClick={(audioRu: AudioRu) => onAudioRuAction(audioRu, 'view')}
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

AudioRuTable.displayName = 'AudioRuTable';

export default AudioRuTable;
