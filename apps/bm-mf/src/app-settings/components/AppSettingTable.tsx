import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { Settings as SettingsIcon, Eye, Edit, Trash2, Lock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../config/i18n.config'; // Initialize app settings translations
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { AppSetting } from '../services/appSettingService';
import { format, parseISO } from 'date-fns';

interface AppSettingTableProps {
  appSettings: AppSetting[];
  loading: boolean;
  pagination: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onAppSettingAction: (appSetting: AppSetting, action: 'view' | 'edit' | 'delete') => void;
}

// Map boolean status to UI status for display
const systemStatusMap = {
  true: { label: 'System', color: 'error' as const },
  false: { label: 'User', color: 'success' as const },
};

const publicStatusMap = {
  true: { label: 'Public', color: 'success' as const },
  false: { label: 'Private', color: 'warning' as const },
};

// Column helper
const columnHelper = createColumnHelper<AppSetting>();

export const AppSettingTable = ({ 
  appSettings, 
  loading, 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  onAppSettingAction 
}: AppSettingTableProps) => {
  const { t } = useTranslation();

  // Define table columns
  const columns = [
    columnHelper.accessor('name', {
      header: t('appSettings.columns.name'),
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon size={16} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {info.getValue()}
          </Typography>
        </Box>
      ),
    }),
    columnHelper.accessor('value', {
      header: t('appSettings.columns.value'),
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
      header: t('appSettings.columns.lang'),
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
    columnHelper.accessor('isSystem', {
      header: t('appSettings.columns.isSystem'),
      cell: (info) => {
        const isSystem = info.getValue();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isSystem ? <Lock size={14} /> : <SettingsIcon size={14} />}
            {createStatusChip(isSystem.toString(), systemStatusMap)}
          </Box>
        );
      },
    }),
    columnHelper.accessor('isPublic', {
      header: t('appSettings.columns.isPublic'),
      cell: (info) => {
        const isPublic = info.getValue();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isPublic ? <Globe size={14} /> : <Lock size={14} />}
            {createStatusChip(isPublic.toString(), publicStatusMap)}
          </Box>
        );
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: t('appSettings.columns.updatedAt'),
      cell: (info) => {
        const date = info.getValue();
        return date ? format(parseISO(date), 'MMM dd, yyyy HH:mm') : '-';
      },
    }),
  ];

  // Show loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show empty state
  if (!appSettings?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <SettingsIcon size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('appSettings.noSettingsFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={appSettings}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={(appSetting: AppSetting) => onAppSettingAction(appSetting, 'view')}
      manualPagination={true}
      pageCount={pagination?.totalPages || 0}
      currentPage={pagination?.page || 0}
      pageSize={pagination?.size || 20}
      totalRows={pagination?.totalElements || 0}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      actionMenuItems={[
        { label: t('appSettings.actions.view'), icon: <Eye size={16} />, action: (appSetting: AppSetting) => onAppSettingAction(appSetting, 'view') },
        { label: t('appSettings.actions.edit'), icon: <Edit size={16} />, action: (appSetting: AppSetting) => onAppSettingAction(appSetting, 'edit') },
        { label: t('appSettings.actions.delete'), icon: <Trash2 size={16} />, action: (appSetting: AppSetting) => onAppSettingAction(appSetting, 'delete') },
      ]}
    />
  );
};
