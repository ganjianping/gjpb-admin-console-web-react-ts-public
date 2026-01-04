import { useEffect, useState, useCallback, useRef } from 'react';
import { vocabularyService } from '../services/vocabularyService';
import type { VocabularyQueryParams } from '../services/vocabularyService';
import type { Vocabulary } from '../types/vocabulary.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { VOCABULARY_CONSTANTS } from '../constants';

export const useVocabularies = () => {
  const [allVocabularies, setAllVocabularies] = useState<Vocabulary[]>([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Vocabulary> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(VOCABULARY_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadVocabularies = useCallback(async (params?: VocabularyQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: VocabularyQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: VOCABULARY_CONSTANTS.SORT_FIELD,
        direction: VOCABULARY_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await vocabularyService.getVocabularies(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let vocabularies: Vocabulary[] = [];
        
        if (Array.isArray(responseData)) {
          vocabularies = responseData;
        } else if (responseData && 'content' in responseData) {
          vocabularies = responseData.content;
          setPagination(responseData);
        }
        
        setAllVocabularies(vocabularies || []);
        setFilteredVocabularies(vocabularies || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load vocabularies');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadVocabularies();
    }
  }, [loadVocabularies]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allVocabularies, 
    filteredVocabularies, 
    setFilteredVocabularies, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadVocabularies,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useVocabularies;
