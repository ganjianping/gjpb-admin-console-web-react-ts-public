import { useEffect, useState, useCallback, useRef } from 'react';
import { audioRuService } from '../services/audioRuService';
import type { AudioRuQueryParams } from '../services/audioRuService';
import type { AudioRu } from '../types/audioRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { AUDIO_CONSTANTS } from '../constants';

export const useAudioRus = () => {
  const [allAudioRus, setAllAudioRus] = useState<AudioRu[]>([]);
  const [filteredAudioRus, setFilteredAudioRus] = useState<AudioRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<AudioRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(AUDIO_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadAudioRus = useCallback(async (params?: AudioRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: AudioRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: AUDIO_CONSTANTS.SORT_FIELD,
        direction: AUDIO_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await audioRuService.getAudioRus(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let audioRus: AudioRu[] = [];
        
        if (Array.isArray(responseData)) {
          audioRus = responseData;
        } else if (responseData && 'content' in responseData) {
          audioRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllAudioRus(audioRus || []);
        setFilteredAudioRus(audioRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load audioRus');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadAudioRus();
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
    allAudioRus, 
    filteredAudioRus, 
    setFilteredAudioRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadAudioRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useAudioRus;
