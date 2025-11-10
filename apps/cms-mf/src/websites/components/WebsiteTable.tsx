import { Box, Chip, Typography, Avatar } from '@mui/material';
import { getFullLogoUrl } from '../utils/getFullLogoUrl';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations'; // Initialize websites translations
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Website } from '../types/website.types';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';
import { WebsiteTableSkeleton } from './WebsiteTableSkeleton';
import { useWebsiteActionMenu } from '../hooks';

interface WebsiteTableProps {
  websites: Website[];
  loading: boolean;
  pagination: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onWebsiteAction: (website: Website, action: 'view' | 'edit' | 'delete') => void;
}

// Column helper
const columnHelper = createColumnHelper<Website>();

export const WebsiteTable = memo(({ 
  websites, 
  loading, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onWebsiteAction 
}: WebsiteTableProps) => {
  const { t } = useTranslation();

  // Get action menu items from hook
  const actionMenuItems = useWebsiteActionMenu({
    onView: (website: Website) => onWebsiteAction(website, 'view'),
    onEdit: (website: Website) => onWebsiteAction(website, 'edit'),
    onDelete: (website: Website) => onWebsiteAction(website, 'delete'),
  });

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('websites.columns.name'),
      cell: (info) => {
        const website = info.row.original;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {website.logoUrl ? (
              (() => {
                const logoSrc = getFullLogoUrl(website.logoUrl);
                return (
                  <Avatar
                    src={logoSrc}
                    alt={info.getValue()}
                    sx={{ width: 32, height: 32 }}
                    variant="rounded"
                  />
                );
              })()
            ) : (
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main',
                }}
                variant="rounded"
              >
                <Globe size={16} />
              </Avatar>
            )}
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {info.getValue()}
            </Typography>
          </Box>
        );
      },
    }),
    columnHelper.accessor('url', {
      header: t('websites.columns.url'),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={value}
          >
            {value || '-'}
          </Typography>
        );
      },
    }),
    columnHelper.accessor('lang', {
      header: t('websites.columns.lang'),
      cell: (info) => (
        <Chip
          label={info.getValue()}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      ),
    }),
    columnHelper.accessor('tags', {
      header: t('websites.columns.tags'),
      cell: (info) => {
        const tags = info.getValue();
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: 150,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={tags}
          >
            {tags || '-'}
          </Typography>
        );
      },
    }),
    columnHelper.accessor('displayOrder', {
      header: t('websites.columns.displayOrder'),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Typography
            variant="body2"
            sx={{
              textAlign: 'right',
              minWidth: 40,
            }}
          >
            {typeof value === 'number' ? value : '-'}
          </Typography>
        );
      },
    }),
    columnHelper.accessor('isActive', {
      header: t('websites.columns.isActive'),
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {createStatusChip(isActive.toString(), STATUS_MAPS.active)}
          </Box>
        );
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: t('websites.columns.updatedAt'),
      cell: (info) => {
        const date = info.getValue();
        return date ? format(parseISO(date), 'MMM dd, yyyy HH:mm') : '-';
      },
    }),
  ], [t]);

  // Show skeleton loader while loading
  if (loading && !websites.length) {
    return <WebsiteTableSkeleton rows={5} />;
  }

  // Show empty state
  if (!websites?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <Globe size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('websites.noSettingsFound')}
        </Typography>
      </Box>
    );
  }

  // Sort websites by updatedAt desc
  const sortedWebsites = [...websites].sort((a, b) => {
    if (!a.updatedAt && !b.updatedAt) return 0;
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <DataTable
      data={sortedWebsites}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(website: Website) => onWebsiteAction(website, 'view')}
      manualPagination={true}
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

WebsiteTable.displayName = 'WebsiteTable';
