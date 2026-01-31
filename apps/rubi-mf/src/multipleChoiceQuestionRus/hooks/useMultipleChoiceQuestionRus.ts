import { useEffect, useState, useCallback, useRef } from 'react';
import { multipleChoiceQuestionRuService } from '../services/multipleChoiceQuestionRuService';
import type { MultipleChoiceQuestionRuQueryParams } from '../services/multipleChoiceQuestionRuService';
import type { MultipleChoiceQuestionRu } from '../types/multipleChoiceQuestionRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { MULTIPLE_CHOICE_QUESTION_CONSTANTS } from '../constants';

export const useMultipleChoiceQuestionRus = () => {
  const [allMultipleChoiceQuestionRus, setAllMultipleChoiceQuestionRus] = useState<MultipleChoiceQuestionRu[]>([]);
  const [filteredMultipleChoiceQuestionRus, setFilteredMultipleChoiceQuestionRus] = useState<MultipleChoiceQuestionRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<MultipleChoiceQuestionRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(MULTIPLE_CHOICE_QUESTION_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadMultipleChoiceQuestionRus = useCallback(async (params?: MultipleChoiceQuestionRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: MultipleChoiceQuestionRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: MULTIPLE_CHOICE_QUESTION_CONSTANTS.SORT_FIELD,
        direction: MULTIPLE_CHOICE_QUESTION_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await multipleChoiceQuestionRuService.getMultipleChoiceQuestionRus(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let multipleChoiceQuestionRus: MultipleChoiceQuestionRu[] = [];

        if (Array.isArray(responseData)) {
          multipleChoiceQuestionRus = responseData;
        } else if (responseData && 'content' in responseData) {
          multipleChoiceQuestionRus = responseData.content;
          setPagination(responseData);
        }

        setAllMultipleChoiceQuestionRus(multipleChoiceQuestionRus || []);
        setFilteredMultipleChoiceQuestionRus(multipleChoiceQuestionRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load multipleChoiceQuestionRus');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadMultipleChoiceQuestionRus();
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
    allMultipleChoiceQuestionRus,
    filteredMultipleChoiceQuestionRus,
    setFilteredMultipleChoiceQuestionRus,
    pagination,
    loading,
    error,
    currentPage,
    pageSize,
    loadMultipleChoiceQuestionRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useMultipleChoiceQuestionRus;