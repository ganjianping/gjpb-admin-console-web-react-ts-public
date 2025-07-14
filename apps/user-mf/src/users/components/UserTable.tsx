import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { Users as UsersIcon, Shield, User as UserIcon, Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/components/DataTable';
import type { User } from '../services/userService';
import { getRoleNameByCode } from '../utils/roleUtils';

interface UserTableProps {
  users: User[];
  loading: boolean;
  pagination: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onUserAction: (user: User, action: 'view' | 'edit' | 'delete') => void;
}

// Map API status to UI status for display
const statusDisplayMap = {
  active: { label: 'Active', color: 'success' as const },
  locked: { label: 'Locked', color: 'error' as const },
  suspend: { label: 'Suspended', color: 'error' as const },
  pending_verification: { label: 'Pending', color: 'warning' as const },
};

// Column helper
const columnHelper = createColumnHelper<User>();

export const UserTable = ({ 
  users, 
  loading, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onUserAction 
}: UserTableProps) => {
  const { t } = useTranslation();

  // Define table columns
  const columns = [
    columnHelper.accessor('username', {
      header: t('users.username'),
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UserIcon size={16} />
          <span>{info.getValue()}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('email', {
      header: t('users.email'),
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('mobileNumber', {
      header: t('users.mobile'),
      cell: (info) => {
        const mobile = info.getValue();
        const countryCode = info.row.original.mobileCountryCode;
        return mobile && countryCode ? `+${countryCode} - ${mobile}` : '-';
      },
    }),
    columnHelper.accessor('accountStatus', {
      header: t('users.status'),
      cell: (info) => {
        const status = info.getValue();
        return createStatusChip(status, statusDisplayMap);
      },
    }),
    columnHelper.accessor('roles', {
      header: t('users.roles'),
      cell: (info) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {info.getValue()?.map((role: any) => (
            <Chip
              key={role.code}
              label={getRoleNameByCode(role.code)}
              size="small"
              variant="outlined"
              icon={<Shield size={12} />}
              sx={{
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-icon': {
                  fontSize: '0.75rem',
                },
              }}
            />
          )) || '-'}
        </Box>
      ),
    }),
    columnHelper.accessor('active', {
      header: t('users.active'),
      cell: (info) => {
        const activeStatusMap = {
          true: { label: t('common.active'), color: 'success' as const },
          false: { label: t('common.inactive'), color: 'default' as const },
        };
        return createStatusChip(info.getValue().toString(), activeStatusMap);
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: t('users.updatedAt'),
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <UsersIcon size={48} style={{ opacity: 0.5 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('users.noUsersFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={users}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(user: User) => onUserAction(user, 'view')}
      manualPagination={true}
      pageCount={pagination?.totalPages || 0}
      currentPage={pagination?.page || 0}
      pageSize={pagination?.size || 20}
      totalRows={pagination?.totalElements || 0}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      actionMenuItems={[
        { label: t('common.view'), icon: <Eye size={16} />, action: (user: User) => onUserAction(user, 'view') },
        { label: t('common.edit'), icon: <Edit size={16} />, action: (user: User) => onUserAction(user, 'edit') },
        { label: t('common.delete'), icon: <Trash2 size={16} />, action: (user: User) => onUserAction(user, 'delete') },
      ]}
    />
  );
};
