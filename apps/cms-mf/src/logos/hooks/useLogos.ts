import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations.ts'; // Initialize logos translations
import type { LogoQueryParams } from '../services/logoService';
import type { Logo } from '../types/logo.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { logoService } from '../services/logoService';
import { LOGO_CONSTANTS } from '../constants';

export const useLogos = () => {
  const { t } = useTranslation();
  const [allLogos, setAllLogos] = useState<Logo[]>([]);
  const [filteredLogos, setFilteredLogos] = useState<Logo[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Logo> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(LOGO_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  // Memoized function to load logos
  const loadLogos = useCallback(async (params?: LogoQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    try {
      setLoading(true);
      setError(null);
      
      const queryParams: LogoQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: LOGO_CONSTANTS.SORT_FIELD,
        direction: LOGO_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const response = await logoService.getLogos(queryParams);
      
      if (response.status.code === 200) {
        // Handle both array (legacy) and paginated response (new)
        const data = response.data;
        let logos: Logo[] = [];
        
        if (Array.isArray(data)) {
          logos = data;
        } else if (data && 'content' in data) {
          // @ts-ignore - we know content exists if check passes
          logos = data.content;
          // @ts-ignore - we know data is paginated response
          setPagination(data);
        }

        // Transform tags string to array for each logo
        const logosWithTagsArray = logos.map(logo => ({
          ...logo,
          tagsArray: logo.tags ? logo.tags.split(',').map(tag => tag.trim()) : []
        }));
        
        setAllLogos(logosWithTagsArray);
        setFilteredLogos(logosWithTagsArray);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('logos.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load logos';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t]); // Removed currentPage and pageSize from dependencies

  // Load logos only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadLogos();
    }
  }, [loadLogos]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return {
    allLogos,
    filteredLogos,
    setFilteredLogos,
    pagination,
    loading,
    error,
    setError,
    currentPage,
    pageSize,
    loadLogos,
    handlePageChange,
    handlePageSizeChange,
  };
};
