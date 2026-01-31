import { useEffect, useState, useCallback, useRef } from 'react';
import { expressionRuService } from '../services/expressionRuService';
import type { ExpressionRuQueryParams } from '../services/expressionRuService';
import type { ExpressionRu } from '../types/expressionRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { EXPRESSION_CONSTANTS } from '../constants';

export const useExpressionRus = () => {
  const [allExpressionRus, setAllExpressionRus] = useState<ExpressionRu[]>([]);
  const [filteredExpressionRus, setFilteredExpressionRus] = useState<ExpressionRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<ExpressionRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(EXPRESSION_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadExpressionRus = useCallback(async (params?: ExpressionRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: ExpressionRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: EXPRESSION_CONSTANTS.SORT_FIELD,
        direction: EXPRESSION_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await expressionRuService.getExpressionRus(queryParams);
      if (res?.data) {
        const responseData = res.data as any;
        let expressionRus: ExpressionRu[] = [];
        
        if (Array.isArray(responseData)) {
          expressionRus = responseData;
        } else if (responseData && 'content' in responseData) {
          expressionRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllExpressionRus(expressionRus || []);
        setFilteredExpressionRus(expressionRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load expressionRus');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadExpressionRus();
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
    allExpressionRus, 
    filteredExpressionRus, 
    setFilteredExpressionRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadExpressionRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useExpressionRus;
