// Cell renderers moved outside LogoTable for performance and lint compliance
function NameCell({ info, logoBaseUrl }: { info: any, logoBaseUrl: string | null }) {
  const logo = info.row.original;
  const logoUrl = logoBaseUrl && logo.filename ? `${logoBaseUrl}${logo.filename}` : null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {logoUrl ? (
        <Avatar src={logoUrl} alt={info.getValue()} sx={{ width: 32, height: 32 }} variant="rounded" />
      ) : (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} variant="rounded">
          <Image size={16} />
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
import { Box, Chip, Typography, Avatar } from '@mui/material';
import { Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Logo } from '../types/logo.types';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';
import { LogoTableSkeleton } from './LogoTableSkeleton';
import { useLogoActionMenu } from '../hooks';

interface LogoTableProps {
  logos: Logo[];
  loading?: boolean;
  pagination?: any;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onLogoAction: (logo: Logo, action: 'view' | 'edit' | 'delete') => void;
  onCopyFilename?: (logo: Logo) => void;
}

// Column helper
const columnHelper = createColumnHelper<Logo>();

export const LogoTable = memo(({ 
  logos, 
  loading = false, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onLogoAction,
  onCopyFilename 
}: LogoTableProps) => {
  const { t } = useTranslation();

  // Get logo base URL from local storage
  const logoBaseUrl = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return null;

      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const logoBaseUrlSetting = appSettings.find(
        (setting) => setting.name === 'logo_base_url'
      );

      if (!logoBaseUrlSetting) return null;

      return logoBaseUrlSetting.value.endsWith('/') 
        ? logoBaseUrlSetting.value 
        : `${logoBaseUrlSetting.value}/`;
    } catch (error) {
      console.error('[LogoTable] Error loading logo base URL:', error);
      return null;
    }
  }, []);

  // Get action menu items from hook
  const actionMenuItems = useLogoActionMenu({
    onView: (logo: Logo) => onLogoAction(logo, 'view'),
    onEdit: (logo: Logo) => onLogoAction(logo, 'edit'),
    onDelete: (logo: Logo) => onLogoAction(logo, 'delete'),
    onCopyFilename: (logo: Logo) => onCopyFilename?.(logo),
  });

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('logos.columns.name'),
      cell: (info) => <NameCell info={info} logoBaseUrl={logoBaseUrl} />,
    }),
    columnHelper.accessor('extension', {
      header: t('logos.columns.extension'),
      cell: (info) => <ExtensionCell info={info} />,
    }),
    columnHelper.accessor('lang', {
      header: t('logos.columns.lang'),
      cell: (info) => <LangCell info={info} />,
    }),
    columnHelper.accessor('tags', {
      header: t('logos.columns.tags'),
      cell: (info) => <TagsCell info={info} />,
    }),
    columnHelper.accessor('displayOrder', {
      header: t('logos.columns.displayOrder'),
      cell: (info) => <DisplayOrderCell info={info} />,
    }),
    columnHelper.accessor('isActive', {
      header: t('logos.columns.isActive'),
      cell: (info) => <IsActiveCell info={info} />,
    }),
    columnHelper.accessor('updatedAt', {
      header: t('logos.columns.updatedAt'),
      cell: (info) => <UpdatedAtCell info={info} />,
    }),
  ], [t, logoBaseUrl]);

  // Show skeleton loader while loading
  if (loading && !logos.length) {
    return <LogoTableSkeleton rows={5} />;
  }

  // Show empty state
  if (!logos?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <Image size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('logos.noLogosFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={logos}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(logo: Logo) => onLogoAction(logo, 'view')}
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

LogoTable.displayName = 'LogoTable';
