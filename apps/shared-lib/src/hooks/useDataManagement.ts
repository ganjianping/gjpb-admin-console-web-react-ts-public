import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';

export interface UseDataManagementProps<T, QueryParams> {
  service: {
    getItems: (params?: QueryParams) => Promise<ApiResponse<PaginatedResponse<T>>>;
  };
  initialPageSize?: number;
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  translationNamespace?: string;
}

/**
 * Generic data management hook for CRUD operations with pagination
 * Eliminates duplication between useUsers, useAppSettings, etc.
 */
export const useDataManagement = <T, QueryParams extends Record<string, any>>({
  service,
  initialPageSize = 20,
  defaultSortField = 'updatedAt',
  defaultSortDirection = 'desc',
  translationNamespace = 'common'
}: UseDataManagementProps<T, QueryParams>) => {
  const { t } = useTranslation();
  const [allItems, setAllItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const hasInitiallyLoaded = useRef(false);

  const loadItemsInternal = async (params?: QueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: QueryParams = {
        page: actualPage,
        size: actualSize,
        sort: defaultSortField,
        direction: defaultSortDirection,
        ...params,
      } as unknown as QueryParams;

      const response = await service.getItems(queryParams);
      
      if (response.status.code === 200) {
        setAllItems(response.data.content);
        setFilteredItems(response.data.content);
        setPagination(response.data);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t(`${translationNamespace}.errors.loadFailed`, { defaultValue: 'Failed to load data' });
      } else {
        errorMessage = 'Failed to load data';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = useCallback((params?: QueryParams) => {
    return loadItemsInternal(params, currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Load items only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadItemsInternal(undefined, 0, initialPageSize);
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (hasInitiallyLoaded.current) {
      loadItemsInternal(undefined, page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    if (hasInitiallyLoaded.current) {
      loadItemsInternal(undefined, 0, newPageSize);
    }
  };

  return {
    allItems,
    filteredItems,
    setFilteredItems,
    pagination,
    loading,
    error,
    setError,
    currentPage,
    pageSize,
    loadItems,
    handlePageChange,
    handlePageSizeChange,
  };
};
