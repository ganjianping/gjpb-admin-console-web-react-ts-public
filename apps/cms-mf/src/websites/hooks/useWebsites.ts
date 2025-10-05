import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations'; // Initialize websites translations
import type { WebsiteQueryParams } from '../services/websiteService';
import type { Website } from '../types/website.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { websiteService } from '../services/websiteService';
import { WEBSITE_CONSTANTS } from '../constants';

export const useWebsites = () => {
  const { t } = useTranslation();
  const [allWebsites, setAllWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Website> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(WEBSITE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  // Memoized function to load websites
  const loadWebsites = useCallback(async (params?: WebsiteQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: WebsiteQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: WEBSITE_CONSTANTS.SORT_FIELD,
        direction: WEBSITE_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const response = await websiteService.getWebsites(queryParams);
      
      if (response.status.code === 200) {
        setAllWebsites(response.data.content);
        setFilteredWebsites(response.data.content);
        setPagination(response.data);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('websites.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load websites';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t]); // Removed currentPage and pageSize from dependencies

  // Load websites only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadWebsites(undefined, 0, WEBSITE_CONSTANTS.DEFAULT_PAGE_SIZE);
    }
  }, [loadWebsites]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  // Effect to reload when page or pageSize changes (but not on initial mount)
  useEffect(() => {
    if (hasInitiallyLoaded.current) {
      loadWebsites(undefined, currentPage, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]); // Removed loadWebsites from dependencies

  return {
    allWebsites,
    filteredWebsites,
    setFilteredWebsites,
    pagination,
    loading,
    error,
    setError,
    currentPage,
    pageSize,
    loadWebsites,
    handlePageChange,
    handlePageSizeChange,
  };
};
