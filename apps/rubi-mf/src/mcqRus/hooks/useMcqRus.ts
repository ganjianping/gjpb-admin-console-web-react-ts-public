import { useEffect, useState, useCallback, useRef } from 'react';
import { mcqRuService } from '../services/mcqRuService';
import type { McqRuQueryParams } from '../services/mcqRuService';
import type { McqRu } from '../types/mcqRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { MCQRU_CONSTANTS } from '../constants';

export const useMcqRus = () => {
  const [allMcqRus, setAllMcqRus] = useState<McqRu[]>([]);
  const [filteredMcqRus, setFilteredMcqRus] = useState<McqRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<McqRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(MCQRU_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadMcqRus = useCallback(async (params?: McqRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: McqRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: MCQRU_CONSTANTS.SORT_FIELD,
        direction: MCQRU_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await mcqRuService.getMcqRus(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let mcqRus: McqRu[] = [];

        if (Array.isArray(responseData)) {
          mcqRus = responseData;
        } else if (responseData && 'content' in responseData) {
          mcqRus = responseData.content;
          setPagination(responseData);
        }

        setAllMcqRus(mcqRus || []);
        setFilteredMcqRus(mcqRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load MCQs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadMcqRus();
    }
  }, [loadMcqRus]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return {
    allMcqRus,
    filteredMcqRus,
    setFilteredMcqRus,
    pagination,
    loading,
    error,
    currentPage,
    pageSize,
    loadMcqRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useMcqRus;