import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../core/i18n/i18n.config'; // Initialize app settings translations
import type { AppSetting, AppSettingQueryParams } from '../services/appSettingService';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { appSettingService } from '../services/appSettingService';

export const useAppSettings = () => {
  const { t } = useTranslation();
  const [allAppSettings, setAllAppSettings] = useState<AppSetting[]>([]);
  const [filteredAppSettings, setFilteredAppSettings] = useState<AppSetting[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<AppSetting> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const hasInitiallyLoaded = useRef(false);

  const loadAppSettingsInternal = async (params?: AppSettingQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: AppSettingQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: 'updatedAt',
        direction: 'desc',
        ...params,
      };

      const response = await appSettingService.getAppSettings(queryParams);
      
      if (response.status.code === 200) {
        setAllAppSettings(response.data.content);
        setFilteredAppSettings(response.data.content);
        setPagination(response.data);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('appSettings.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load app settings';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadAppSettings = useCallback((params?: AppSettingQueryParams) => {
    return loadAppSettingsInternal(params, currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Load app settings only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadAppSettingsInternal(undefined, 0, 20); // Use hardcoded initial values
    }
  }, []); // NO dependencies - only run once on mount

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Manually trigger reload when page changes
    if (hasInitiallyLoaded.current) {
      loadAppSettingsInternal(undefined, page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    // Manually trigger reload when page size changes
    if (hasInitiallyLoaded.current) {
      loadAppSettingsInternal(undefined, 0, newPageSize);
    }
  };

  return {
    allAppSettings,
    filteredAppSettings,
    setFilteredAppSettings,
    pagination,
    loading,
    error,
    setError,
    currentPage,
    pageSize,
    loadAppSettings,
    handlePageChange,
    handlePageSizeChange,
  };
};
