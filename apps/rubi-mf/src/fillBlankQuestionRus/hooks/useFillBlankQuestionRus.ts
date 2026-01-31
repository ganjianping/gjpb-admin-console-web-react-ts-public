import { useEffect, useState, useCallback, useRef } from 'react';
import { fillBlankQuestionRuService } from '../services/fillBlankQuestionRuService';
import type { FillBlankQuestionRuQueryParams } from '../services/fillBlankQuestionRuService';
import type { FillBlankQuestionRu } from '../types/fillBlankQuestionRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { FILL_BLANK_QUESTION_CONSTANTS } from '../constants';

export const useFillBlankQuestionRus = () => {
  const [allFillBlankQuestionRus, setAllFillBlankQuestionRus] = useState<FillBlankQuestionRu[]>([]);
  const [filteredFillBlankQuestionRus, setFilteredFillBlankQuestionRus] = useState<FillBlankQuestionRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<FillBlankQuestionRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(FILL_BLANK_QUESTION_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadFillBlankQuestionRus = useCallback(async (params?: FillBlankQuestionRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: FillBlankQuestionRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: FILL_BLANK_QUESTION_CONSTANTS.SORT_FIELD,
        direction: FILL_BLANK_QUESTION_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await fillBlankQuestionRuService.getFillBlankQuestionRus(queryParams);
      if (res?.data) {
        const responseData = res.data as any;
        let fillBlankQuestionRus: FillBlankQuestionRu[] = [];
        
        if (Array.isArray(responseData)) {
          fillBlankQuestionRus = responseData;
        } else if (responseData && 'content' in responseData) {
          fillBlankQuestionRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllFillBlankQuestionRus(fillBlankQuestionRus || []);
        setFilteredFillBlankQuestionRus(fillBlankQuestionRus || []);
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
      loadFillBlankQuestionRus();
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
    allFillBlankQuestionRus, 
    filteredFillBlankQuestionRus, 
    setFilteredFillBlankQuestionRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadFillBlankQuestionRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useFillBlankQuestionRus;
