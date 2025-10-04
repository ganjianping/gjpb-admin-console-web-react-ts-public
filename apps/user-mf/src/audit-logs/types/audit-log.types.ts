// Re-export types from service to avoid duplication
export type { AuditLogEntry, AuditLogData, AuditLogQueryParams } from '../services/auditLogService';

// Search form data interface
export interface AuditLogSearchFormData {
  username: string;
  endpoint: string;
  httpMethod: string;
  result: string;
  ipAddress: string;
  responseTime: string;
  startDate: string;
  endDate: string;
}

