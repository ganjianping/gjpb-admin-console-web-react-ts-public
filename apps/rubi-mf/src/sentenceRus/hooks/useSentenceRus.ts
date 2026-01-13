import { useEffect, useState, useCallback, useRef } from 'react';
import { sentenceRuService } from '../services/sentenceRuService';
import type { SentenceRuQueryParams } from '../services/sentenceRuService';
import type { SentenceRu } from '../types/sentenceRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { SENTENCE_CONSTANTS } from '../constants';

export const useSentenceRus = () => {
  const [allSentenceRus, setAllSentenceRus] = useState<SentenceRu[]>([]);
  const [filteredSentenceRus, setFilteredSentenceRus] = useState<SentenceRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<SentenceRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(SENTENCE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadSentenceRus = useCallback(async (params?: SentenceRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: SentenceRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: SENTENCE_CONSTANTS.SORT_FIELD,
        direction: SENTENCE_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await sentenceRuService.getSentenceRus(queryParams);
      if (res?.data) {
        const responseData = res.data as any;
        let sentenceRus: SentenceRu[] = [];
        
        if (Array.isArray(responseData)) {
          sentenceRus = responseData;
        } else if (responseData && 'content' in responseData) {
          sentenceRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllSentenceRus(sentenceRus || []);
        setFilteredSentenceRus(sentenceRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load sentences');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadSentenceRus();
    }
  }, [loadSentenceRus]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allSentenceRus, 
    filteredSentenceRus, 
    setFilteredSentenceRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadSentenceRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useSentenceRus;
