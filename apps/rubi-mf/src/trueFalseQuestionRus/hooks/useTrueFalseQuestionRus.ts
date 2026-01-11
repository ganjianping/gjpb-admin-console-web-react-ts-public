import { useEffect, useState, useCallback, useRef } from 'react';
import { trueFalseQuestionRuService } from '../services/trueFalseQuestionRuService';
import type { TrueFalseQuestionRuQueryParams } from '../services/trueFalseQuestionRuService';
import type { TrueFalseQuestionRu } from '../types/trueFalseQuestionRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { TRUE_FALSE_QUESTION_CONSTANTS } from '../constants';

export const useTrueFalseQuestionRus = () => {
  const [allTrueFalseQuestionRus, setAllTrueFalseQuestionRus] = useState<TrueFalseQuestionRu[]>([]);
  const [filteredTrueFalseQuestionRus, setFilteredTrueFalseQuestionRus] = useState<TrueFalseQuestionRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<TrueFalseQuestionRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(TRUE_FALSE_QUESTION_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadTrueFalseQuestionRus = useCallback(async (params?: TrueFalseQuestionRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: TrueFalseQuestionRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: TRUE_FALSE_QUESTION_CONSTANTS.SORT_FIELD,
        direction: TRUE_FALSE_QUESTION_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await trueFalseQuestionRuService.getTrueFalseQuestionRus(queryParams);
      if (res?.data) {
        const responseData = res.data as any;
        let trueFalseQuestionRus: TrueFalseQuestionRu[] = [];
        
        if (Array.isArray(responseData)) {
          trueFalseQuestionRus = responseData;
        } else if (responseData && 'content' in responseData) {
          trueFalseQuestionRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllTrueFalseQuestionRus(trueFalseQuestionRus || []);
        setFilteredTrueFalseQuestionRus(trueFalseQuestionRus || []);
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
      loadTrueFalseQuestionRus();
    }
  }, [loadTrueFalseQuestionRus]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allTrueFalseQuestionRus, 
    filteredTrueFalseQuestionRus, 
    setFilteredTrueFalseQuestionRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadTrueFalseQuestionRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useTrueFalseQuestionRus;
