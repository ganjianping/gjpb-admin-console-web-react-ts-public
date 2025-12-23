import { useEffect, useState, useCallback, useRef } from 'react';
import { audioService } from '../services/audioService';
import type { AudioQueryParams } from '../services/audioService';
import type { Audio } from '../types/audio.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { AUDIO_CONSTANTS } from '../constants';

export const useAudios = () => {
  const [allAudios, setAllAudios] = useState<Audio[]>([]);
  const [filteredAudios, setFilteredAudios] = useState<Audio[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Audio> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(AUDIO_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadAudios = useCallback(async (params?: AudioQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: AudioQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: AUDIO_CONSTANTS.SORT_FIELD,
        direction: AUDIO_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await audioService.getAudios(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let audios: Audio[] = [];
        
        if (Array.isArray(responseData)) {
          audios = responseData;
        } else if (responseData && 'content' in responseData) {
          audios = responseData.content;
          setPagination(responseData);
        }
        
        setAllAudios(audios || []);
        setFilteredAudios(audios || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load audios');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadAudios();
    }
  }, [loadAudios]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allAudios, 
    filteredAudios, 
    setFilteredAudios, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadAudios,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useAudios;
