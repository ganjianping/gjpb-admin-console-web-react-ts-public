import { apiClient } from '../../../shared-lib/src/services/api-client';

// Audit log entry interface
export interface AuditLogEntry {
  id: string;
  userId: string | null;
  username: string | null;
  httpMethod: string;
  endpoint: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  requestData: string | null;
  responseData: string | null;
  result: 'SUCCESS' | 'ERROR';
  statusCode: number;
  errorMessage: string | null;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  requestId: string | null;
  durationMs: number;
  metadata: Record<string, any> | null;
  timestamp: string;
}

// Pageable interface
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

// Audit log response data interface
export interface AuditLogData {
  content: AuditLogEntry[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// API response interface
export interface AuditLogResponse {
  status: {
    code: number;
    message: string;
    errors: null | string[];
  };
  data: AuditLogData;
  meta: {
    serverDateTime: string;
    requestId: string;
    sessionId: string;
  };
}

// Query parameters for audit log
export interface AuditLogQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  username?: string;
  action?: string;
  resourceType?: string;
  result?: 'SUCCESS' | 'ERROR';
  startDate?: string;
  endDate?: string;
  httpMethod?: string;
}

// Helper function to build query parameters
const buildQueryParams = (params: AuditLogQueryParams): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });
  
  return queryParams.toString();
};

// Helper function to validate API response
const validateAuditLogResponse = (apiResponse: any): boolean => {
  return apiResponse?.status && 
         typeof apiResponse.status.code === 'number' && 
         apiResponse.data;
};

// Audit log service
export const auditLogService = {
  /**
   * Get audit logs with pagination and filtering
   */
  async getAuditLogs(params: AuditLogQueryParams = {}): Promise<AuditLogResponse> {
    try {
      console.log('📡 Making API call to /v1/audit with params:', params);
      
      const queryString = buildQueryParams(params);
      const url = queryString ? `/v1/audit?${queryString}` : '/v1/audit';
      
      console.log('📡 Final API URL:', url);
      
      const response = await apiClient.get(url);
      console.log('📥 Raw audit log API response:', response);
      
      const apiResponse = response as AuditLogResponse;
      console.log('📋 Parsed audit log response:', apiResponse);
      
      if (validateAuditLogResponse(apiResponse)) {
        console.log('✅ Valid audit log response structure');
        return apiResponse;
      }
      
      console.error('❌ Invalid audit log response structure:', apiResponse);
      throw new Error('Invalid response structure from audit log API');
    } catch (error: any) {
      console.error('💥 Error fetching audit logs:', error);
      
      if (error.response?.data) {
        const errorResponse = error.response.data;
        console.error('📛 API Error Response:', errorResponse);
        throw new Error(errorResponse?.status?.message || 'Failed to fetch audit logs');
      }
      
      throw new Error(error?.message || 'Network error while fetching audit logs');
    }
  },

  /**
   * Export audit logs (for future implementation)
   */
  async exportAuditLogs(params: AuditLogQueryParams = {}): Promise<Blob> {
    try {
      console.log('📡 Exporting audit logs with params:', params);
      
      const queryString = buildQueryParams(params);
      const url = queryString ? `/v1/audit/export?${queryString}` : '/v1/audit/export';
      
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error: any) {
      console.error('💥 Error exporting audit logs:', error);
      throw new Error(error?.message || 'Failed to export audit logs');
    }
  },
};

export default auditLogService;
