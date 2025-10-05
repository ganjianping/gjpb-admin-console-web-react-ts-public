import { useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Role } from '../types/role.types';

const columnHelper = createColumnHelper<Role>();

// Status chip definition
const roleStatusMap = {
  active: { label: 'Active', color: 'success' as const },
  inactive: { label: 'Inactive', color: 'default' as const },
};

/**
 * Hook to create role table columns
 */
export const useRoleTableColumns = () => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('roles.name'),
        cell: (info) => {
          const role = info.row.original;
          const indentLevel = (role.displayLevel || 0) * 20;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: `${indentLevel}px` }}>
              {role.hasChildren ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    color: 'primary.main',
                  }}
                >
                  {role.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </Box>
              ) : (
                <Box sx={{ width: 16 }} />
              )}
              <Shield size={16} />
              <Typography variant="body2" fontWeight="medium">
                {info.getValue()}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor('code', {
        header: t('roles.code'),
        cell: (info) => (
          <Chip
            label={info.getValue()}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
          />
        ),
        size: 120,
      }),
      columnHelper.accessor('level', {
        header: t('roles.level'),
        cell: (info) => (
          <Chip
            label={`Level ${info.getValue()}`}
            size="small"
            color="primary"
            sx={{ fontWeight: 500 }}
          />
        ),
        size: 100,
      }),
      columnHelper.accessor('systemRole', {
        header: t('roles.systemRole'),
        cell: (info) => (
          <Chip
            label={info.getValue() ? 'System' : 'Custom'}
            size="small"
            color={info.getValue() ? 'error' : 'default'}
            sx={{ fontWeight: 500 }}
          />
        ),
        size: 120,
      }),
      columnHelper.accessor('status', {
        header: t('roles.status'),
        cell: (info) => createStatusChip(info.getValue(), roleStatusMap),
        size: 120,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('roles.lastUpdated'),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        size: 120,
      }),
    ],
    [t]
  );

  return columns;
};
