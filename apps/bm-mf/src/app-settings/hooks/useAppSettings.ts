import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations'; // Initialize app settings translations
import type { AppSettingQueryParams } from '../services/appSettingService';
import type { AppSetting } from '../types/app-setting.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { appSettingService } from '../services/appSettingService';
import { APP_SETTING_CONSTANTS } from '../constants';

export const useAppSettings = () => {
  const { t } = useTranslation();
  const [allAppSettings, setAllAppSettings] = useState<AppSetting[]>([]);
  const [filteredAppSettings, setFilteredAppSettings] = useState<AppSetting[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<AppSetting> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(APP_SETTING_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  // Memoized function to load app settings
  const loadAppSettings = useCallback(async (params?: AppSettingQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: AppSettingQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: APP_SETTING_CONSTANTS.SORT_FIELD,
        direction: APP_SETTING_CONSTANTS.SORT_DIRECTION,
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
  }, [t]); // Removed currentPage and pageSize from dependencies

  // Load app settings only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadAppSettings(undefined, 0, APP_SETTING_CONSTANTS.DEFAULT_PAGE_SIZE);
    }
  }, [loadAppSettings]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

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
