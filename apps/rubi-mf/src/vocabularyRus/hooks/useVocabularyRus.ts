import { useEffect, useState, useCallback, useRef } from 'react';
import { vocabularyRuService } from '../services/vocabularyRuService';
import type { VocabularyRuQueryParams } from '../services/vocabularyRuService';
import type { VocabularyRu } from '../types/vocabularyRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { VOCABULARY_CONSTANTS } from '../constants';

export const useVocabularyRus = () => {
  const [allVocabularyRus, setAllVocabularyRus] = useState<VocabularyRu[]>([]);
  const [filteredVocabularyRus, setFilteredVocabularyRus] = useState<VocabularyRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<VocabularyRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(VOCABULARY_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadVocabularyRus = useCallback(async (params?: VocabularyRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: VocabularyRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: VOCABULARY_CONSTANTS.SORT_FIELD,
        direction: VOCABULARY_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await vocabularyRuService.getVocabularyRus(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let vocabularyRus: VocabularyRu[] = [];
        
        if (Array.isArray(responseData)) {
          vocabularyRus = responseData;
        } else if (responseData && 'content' in responseData) {
          vocabularyRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllVocabularyRus(vocabularyRus || []);
        setFilteredVocabularyRus(vocabularyRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load vocabularyRus');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadVocabularyRus();
    }
  }, [loadVocabularyRus]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allVocabularyRus, 
    filteredVocabularyRus, 
    setFilteredVocabularyRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadVocabularyRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useVocabularyRus;
