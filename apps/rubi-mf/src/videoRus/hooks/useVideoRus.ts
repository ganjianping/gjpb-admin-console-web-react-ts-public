import { useEffect, useState, useCallback, useRef } from 'react';
import { videoRuService } from '../services/videoRuService';
import type { VideoRuQueryParams } from '../services/videoRuService';
import type { VideoRu } from '../types/videoRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { VIDEO_CONSTANTS } from '../constants';

export const useVideoRus = () => {
  const [allVideoRus, setAllVideoRus] = useState<VideoRu[]>([]);
  const [filteredVideoRus, setFilteredVideoRus] = useState<VideoRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<VideoRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(VIDEO_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadVideoRus = useCallback(async (params?: VideoRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: VideoRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: VIDEO_CONSTANTS.SORT_FIELD,
        direction: VIDEO_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await videoRuService.getVideoRus(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let videoRus: VideoRu[] = [];
        
        if (Array.isArray(responseData)) {
          videoRus = responseData;
        } else if (responseData && 'content' in responseData) {
          videoRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllVideoRus(videoRus || []);
        setFilteredVideoRus(videoRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load videoRus');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadVideoRus();
    }
  }, [loadVideoRus]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allVideoRus, 
    filteredVideoRus, 
    setFilteredVideoRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadVideoRus,
    handlePageChange,
    handlePageSizeChange
  };
};
