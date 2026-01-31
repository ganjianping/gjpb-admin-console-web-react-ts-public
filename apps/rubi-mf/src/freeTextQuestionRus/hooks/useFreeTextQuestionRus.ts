import { useEffect, useState, useCallback, useRef } from 'react';
import { freeTextQuestionRuService } from '../services/freeTextQuestionRuService';
import type { FreeTextQuestionRuQueryParams } from '../services/freeTextQuestionRuService';
import type { FreeTextQuestionRu } from '../types/freeTextQuestionRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { FREE_TEXT_QUESTION_CONSTANTS } from '../constants';

export const useFreeTextQuestionRus = () => {
  const [allFreeTextQuestionRus, setAllFreeTextQuestionRus] = useState<FreeTextQuestionRu[]>([]);
  const [filteredFreeTextQuestionRus, setFilteredFreeTextQuestionRus] = useState<FreeTextQuestionRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<FreeTextQuestionRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(FREE_TEXT_QUESTION_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadFreeTextQuestionRus = useCallback(async (params?: FreeTextQuestionRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: FreeTextQuestionRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: FREE_TEXT_QUESTION_CONSTANTS.SORT_FIELD,
        direction: FREE_TEXT_QUESTION_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await freeTextQuestionRuService.getFreeTextQuestionRus(queryParams);
      if (res?.data) {
        const responseData = res.data as any;
        let freeTextQuestionRus: FreeTextQuestionRu[] = [];
        
        if (Array.isArray(responseData)) {
          freeTextQuestionRus = responseData;
        } else if (responseData && 'content' in responseData) {
          freeTextQuestionRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllFreeTextQuestionRus(freeTextQuestionRus || []);
        setFilteredFreeTextQuestionRus(freeTextQuestionRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load free text questions');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadFreeTextQuestionRus();
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allFreeTextQuestionRus, 
    filteredFreeTextQuestionRus, 
    setFilteredFreeTextQuestionRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadFreeTextQuestionRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useFreeTextQuestionRus;
