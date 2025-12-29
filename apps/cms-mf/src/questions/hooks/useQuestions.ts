import { useEffect, useState, useCallback, useRef } from 'react';
import { questionService } from '../services/questionService';
import type { QuestionQueryParams } from '../services/questionService';
import type { Question } from '../types/question.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { QUESTION_CONSTANTS } from '../constants';

export const useQuestions = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Question> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(QUESTION_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadQuestions = useCallback(async (params?: QuestionQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: QuestionQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: QUESTION_CONSTANTS.SORT_FIELD,
        direction: QUESTION_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await questionService.getQuestions(queryParams);
      if (res?.data) {
        const responseData = res.data as any;
        let questions: Question[] = [];
        
        if (Array.isArray(responseData)) {
          questions = responseData;
        } else if (responseData && 'content' in responseData) {
          questions = responseData.content;
          setPagination(responseData);
        }
        
        setAllQuestions(questions || []);
        setFilteredQuestions(questions || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      loadQuestions();
      hasInitiallyLoaded.current = true;
    }
  }, [loadQuestions]);

  return {
    allQuestions,
    filteredQuestions,
    setFilteredQuestions,
    pagination,
    loading,
    error,
    currentPage,
    pageSize,
    loadQuestions,
    handlePageChange,
    handlePageSizeChange,
  };
};
