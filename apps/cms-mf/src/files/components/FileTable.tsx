import { Box, Chip, Typography } from '@mui/material';
import { File as LucideFile } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { CmsFile } from '../types/file.types';
import { useFileActionMenu } from '../hooks/useFileActionMenu';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';
// import { FileTableSkeleton } from './FileTableSkeleton';

function NameCell({ info }: { info: any }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{info.getValue()}</Typography>
    </Box>
  );
}

// ExtensionCell was removed because it was declared but never used

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

function SizeCell({ info }: { info: any }) {
  const raw = info.getValue();
  const numeric = typeof raw === 'number' ? raw : Number(raw);
  if (Number.isNaN(numeric) || numeric < 0) return '-';
  if (numeric === 0) return <Typography variant="body2">0 B</Typography>;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let bytes = numeric;
  let unitIndex = 0;
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex += 1;
  }
  return <Typography variant="body2">{`${bytes.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`}</Typography>;
}

interface FileTableProps {
  files: CmsFile[];
  pagination?: any;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onFileAction: (file: CmsFile, action: 'view' | 'edit' | 'delete') => void;
  onCopyFilename?: (file: CmsFile) => void;
  onCopyUrl?: (file: CmsFile) => void;
}

const columnHelper = createColumnHelper<CmsFile>();

const FileTable = memo(({ 
  files, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onFileAction,
  onCopyFilename,
  onCopyUrl,
}: FileTableProps) => {
  const { t } = useTranslation();

  // TODO: Add action menu hook for files
  const actionMenuItems = useFileActionMenu({
    onView: (file: CmsFile) => onFileAction(file, 'view'),
    onEdit: (file: CmsFile) => onFileAction(file, 'edit'),
    onDelete: (file: CmsFile) => onFileAction(file, 'delete'),
    onCopyFilename: (file: CmsFile) => onCopyFilename?.(file),
    onCopyUrl: (file: CmsFile) => onCopyUrl?.(file),
  });

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('files.columns.name'),
      cell: (info) => <NameCell info={info} />,
    }),
    columnHelper.accessor('filename', {
      header: t('files.columns.filename'),
      cell: (info) => (
        <Typography
          variant="body2"
          sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={info.getValue()}
        >
          {info.getValue() || '-'}
        </Typography>
      ),
    }),
    columnHelper.accessor('sizeBytes', {
      header: t('files.columns.sizeBytes'),
      cell: (info) => <SizeCell info={info} />,
    }),
    columnHelper.accessor('lang', {
      header: t('files.columns.lang'),
      cell: (info) => <LangCell info={info} />,
    }),
    columnHelper.accessor('tags', {
      header: t('files.columns.tags'),
      cell: (info) => <TagsCell info={info} />,
    }),
    columnHelper.accessor('displayOrder', {
      header: t('files.columns.displayOrder'),
      cell: (info) => <DisplayOrderCell info={info} />,
    }),
    columnHelper.accessor('isActive', {
      header: t('files.columns.isActive'),
      cell: (info) => <IsActiveCell info={info} />,
    }),
    columnHelper.accessor('updatedAt', {
      header: t('files.columns.updatedAt'),
      cell: (info) => <UpdatedAtCell info={info} />,
    }),
  ], [t]);

  // Show skeleton loader while loading
  // if (loading && !files.length) {
  //   return <FileTableSkeleton rows={5} />;
  // }

  // Show empty state
  if (!files?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <LucideFile size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('files.noFilesFound')}
        </Typography>
      </Box>
    );
  }

  // Sort files by updatedAt desc
  const sortedFiles = [...files].sort((a, b) => {
    if (!a.updatedAt && !b.updatedAt) return 0;
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <DataTable
      data={sortedFiles}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(file: CmsFile) => onFileAction(file, 'view')}
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

FileTable.displayName = 'FileTable';

export default FileTable;
