import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Typography } from '@mui/material';
import { Eye, User, CheckCircle, XCircle, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { DataTable, createColumnHelper } from '../../../../shared-lib/src/data-management/DataTable';
import type { AuditLogEntry } from '../types';
import { RESULT_STATUS_MAP, AUDIT_LOG_CONSTANTS } from '../constants';
import { AuditLogTableSkeleton } from './AuditLogTableSkeleton';

interface AuditLogTableProps {
  data: AuditLogEntry[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowDoubleClick: (log: AuditLogEntry) => void;
}

// Column helper
const columnHelper = createColumnHelper<AuditLogEntry>();

// Helper function to get HTTP method color
const getHttpMethodColor = (method: string): 'primary' | 'success' | 'warning' | 'error' | 'default' => {
  switch (method) {
    case 'GET': return 'primary';
    case 'POST': return 'success';
    case 'PUT': return 'warning';
    case 'DELETE': return 'error';
    default: return 'default';
  }
};

// Helper function to get response time color
const getResponseTimeColor = (duration: number): string => {
  if (duration > 2000) return '#d32f2f'; // Red for > 2s
  if (duration > 1000) return '#f57c00'; // Orange for > 1s
  if (duration > 500) return '#1976d2';  // Blue for > 500ms
  return '#2e7d32'; // Green for <= 500ms
};

export const AuditLogTable = memo(({
  data,
  loading,
  totalPages,
  currentPage,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  onRowDoubleClick,
}: AuditLogTableProps) => {
  const { t } = useTranslation();

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => [
    columnHelper.accessor('timestamp', {
      header: t('auditLogs.columns.dateTime'),
      cell: (info) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
            {format(parseISO(info.getValue()), 'MMM dd, yyyy')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {format(parseISO(info.getValue()), 'HH:mm:ss')}
          </Typography>
        </Box>
      ),
    }),
    columnHelper.accessor('endpoint', {
      header: t('auditLogs.columns.request'),
      cell: (info) => {
        const row = info.row.original;
        const method = row.httpMethod;
        const endpoint = info.getValue();
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
            <Chip 
              label={method} 
              size="small" 
              variant="outlined"
              color={getHttpMethodColor(method)}
              sx={{ 
                minWidth: 42, 
                height: 20,
                fontSize: '0.625rem',
                fontWeight: 600,
                '& .MuiChip-label': {
                  px: 0.5,
                  py: 0
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                fontSize: '0.875rem',
                fontWeight: 500,
                maxWidth: '320px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                lineHeight: 1.4
              }}
              title={endpoint || '-'}
            >
              {endpoint || '-'}
            </Typography>
          </Box>
        );
      },
    }),
    columnHelper.accessor('durationMs', {
      header: t('auditLogs.columns.responseTime'),
      cell: (info) => {
        const duration = info.getValue();
        if (!duration) return '-';
        
        const durationNum = Number(duration);
        const color = getResponseTimeColor(durationNum);
        
        return (
          <Typography variant="body2" sx={{ color, fontWeight: 500 }}>
            {duration}ms
          </Typography>
        );
      },
    }),
    columnHelper.accessor('result', {
      header: t('auditLogs.columns.result'),
      cell: (info) => {
        const result = info.getValue();
        const resultStr = String(result || '').toLowerCase();
        
        const isSuccess = result === 'SUCCESS' || 
                         resultStr.includes('success') ||
                         resultStr.includes('successful');
        
        const isError = result === 'ERROR' || 
                       resultStr.includes('error') ||
                       resultStr.includes('fail') ||
                       resultStr.includes('failed');
        
        if (isSuccess) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle size={16} style={{ color: '#2e7d32' }} />
              <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                Success
              </Typography>
            </Box>
          );
        } else if (isError) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <XCircle size={16} style={{ color: '#d32f2f' }} />
              <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                Failed
              </Typography>
            </Box>
          );
        } else {
          const statusConfig = RESULT_STATUS_MAP[result as keyof typeof RESULT_STATUS_MAP];
          return (
            <Chip 
              label={statusConfig?.label || String(result)}
              size="small"
              color={statusConfig?.color || 'default'}
              sx={{ 
                fontWeight: 500,
              }}
            />
          );
        }
      },
    }),
    columnHelper.accessor('username', {
      header: t('auditLogs.columns.username'),
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <User size={16} />
          <span>{info.getValue() || 'System'}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('ipAddress', {
      header: t('auditLogs.columns.ipAddress'),
      cell: (info) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'monospace',
            fontSize: '0.813rem'
          }}
        >
          {info.getValue() || '-'}
        </Typography>
      ),
    }),
  ], [t]);

  // Memoize action menu items
  const actionMenuItems = useMemo(() => [
    { 
      label: t('auditLogs.viewDetails'), 
      icon: <Eye size={16} />, 
      action: (log: AuditLogEntry) => {
        onRowDoubleClick(log);
      }
    },
  ], [t, onRowDoubleClick]);

  // Show skeleton loader while loading
  if (loading && !data.length) {
    return <AuditLogTableSkeleton rows={5} />;
  }

  // Show empty state
  if (!data?.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <Activity size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant="h6" sx={{ mt: 2, opacity: 0.7 }}>
          {t('auditLogs.noLogsFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      showSearch={false}
      onRowDoubleClick={onRowDoubleClick}
      manualPagination={true}
      pageCount={totalPages}
      currentPage={currentPage}
      pageSize={pageSize}
      totalRows={totalRows}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      rowsPerPageOptions={[...AUDIT_LOG_CONSTANTS.ROWS_PER_PAGE_OPTIONS]}
      actionMenuItems={actionMenuItems}
    />
  );
});

AuditLogTable.displayName = 'AuditLogTable';
