import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import auditLogService from '../services/auditLogService';
import type { AuditLogData, AuditLogQueryParams } from '../types';
import { AUDIT_LOG_CONSTANTS } from '../constants';

export const useAuditLogs = () => {
  const { t } = useTranslation();
  const [auditLogs, setAuditLogs] = useState<AuditLogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(AUDIT_LOG_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  // Memoized function to load audit logs
  const loadAuditLogs = useCallback(async (params?: AuditLogQueryParams, customPage?: number, customPageSize?: number) => {
    const actualPage = customPage ?? currentPage;
    const actualSize = customPageSize ?? pageSize;
    
    try {
      setLoading(true);
      setError(null);

      const queryParams: AuditLogQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: AUDIT_LOG_CONSTANTS.SORT_FIELD,
        ...params,
      };

      console.log('🔍 Fetching audit logs with params:', queryParams);
      const response = await auditLogService.getAuditLogs(queryParams);
      
      if (response.status.code === 200) {
        setAuditLogs(response.data);
        console.log('✅ Audit logs loaded successfully:', response.data);
      } else {
        throw new Error(response.status.message || 'Failed to fetch audit logs');
      }
    } catch (err: any) {
      console.error('❌ Error fetching audit logs:', err);
      const errorMessage = err.message || t?.('auditLogs.errors.loadFailed') || 'Failed to fetch audit logs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, t]);

  // Load audit logs only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadAuditLogs();
    }
  }, [loadAuditLogs]);

  const handlePageChange = useCallback((page: number) => {
    console.log('📄 Page changed to:', page);
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    console.log('📏 Page size changed to:', newPageSize);
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return {
    auditLogs,
    loading,
    error,
    setError,
    currentPage,
    pageSize,
    loadAuditLogs,
    handlePageChange,
    handlePageSizeChange,
  };
};
