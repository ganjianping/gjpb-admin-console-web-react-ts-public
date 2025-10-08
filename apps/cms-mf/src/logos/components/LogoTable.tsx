import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Logo } from '../types/logo.types';
import { format, parseISO } from 'date-fns';
import { STATUS_MAPS } from '../constants';

interface LogoTableProps {
  logos: Logo[];
  onLogoAction: (logo: Logo, action: 'view' | 'edit' | 'delete') => void;
}

// Column helper
const columnHelper = createColumnHelper<Logo>();

export const LogoTable = memo(({ 
  logos, 
  onLogoAction 
}: LogoTableProps) => {
  const { t } = useTranslation();

  // Action menu items
  const actionMenuItems = useMemo(() => [
    {
      label: t('logos.actions.view'),
      action: (logo: Logo) => onLogoAction(logo, 'view'),
    },
    {
      label: t('logos.actions.edit'),
      action: (logo: Logo) => onLogoAction(logo, 'edit'),
    },
    {
      label: t('logos.actions.delete'),
      action: (logo: Logo) => onLogoAction(logo, 'delete'),
      divider: true,
    },
  ], [t, onLogoAction]);

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: t('logos.columns.name'),
      cell: (info) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor('filename', {
      header: t('logos.columns.filename'),
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
    columnHelper.accessor('extension', {
      header: t('logos.columns.extension'),
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
    columnHelper.accessor('lang', {
      header: t('logos.columns.lang'),
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
      header: t('logos.columns.tags'),
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
      header: t('logos.columns.displayOrder'),
      cell: (info) => (
        <Typography variant="body2">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor('isActive', {
      header: t('logos.columns.isActive'),
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
      header: t('logos.columns.updatedAt'),
      cell: (info) => {
        const date = info.getValue();
        return date ? format(parseISO(date), 'MMM dd, yyyy HH:mm') : '-';
      },
    }),
  ], [t]);

  return (
    <DataTable
      data={logos}
      columns={columns}
      actionMenuItems={actionMenuItems}
      showSearch={false}
    />
  );
});

LogoTable.displayName = 'LogoTable';
