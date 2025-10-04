export const AUDIT_LOG_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  SORT_FIELD: 'timestamp,desc',
  ROWS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
} as const;

export const HTTP_METHOD_OPTIONS = [
  { value: '', label: 'auditLogs.methods.all' },
  { value: 'GET', label: 'auditLogs.methods.get' },
  { value: 'POST', label: 'auditLogs.methods.post' },
  { value: 'PUT', label: 'auditLogs.methods.put' },
  { value: 'DELETE', label: 'auditLogs.methods.delete' },
] as const;

export const RESULT_STATUS_OPTIONS = [
  { value: '', label: 'auditLogs.status.all' },
  { value: 'SUCCESS', label: 'auditLogs.status.success' },
  { value: 'FAILED', label: 'auditLogs.status.failed' },
] as const;

export const RESULT_STATUS_MAP = {
  SUCCESS: { label: 'Success', color: 'success' as const, textColor: '#1b5e20' },
  ERROR: { label: 'Error', color: 'error' as const, textColor: undefined },
} as const;
