import { useEffect, useState, useCallback, useRef } from 'react';
import { videoService } from '../services/videoService';
import type { VideoQueryParams } from '../services/videoService';
import type { Video } from '../types/video.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { VIDEO_CONSTANTS } from '../constants';

export const useVideos = () => {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Video> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(VIDEO_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadVideos = useCallback(async (params?: VideoQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: VideoQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: VIDEO_CONSTANTS.SORT_FIELD,
        direction: VIDEO_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await videoService.getVideos(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let videos: Video[] = [];
        
        if (Array.isArray(responseData)) {
          videos = responseData;
        } else if (responseData && 'content' in responseData) {
          videos = responseData.content;
          setPagination(responseData);
        }
        
        setAllVideos(videos || []);
        setFilteredVideos(videos || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadVideos();
    }
  }, [loadVideos]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allVideos, 
    filteredVideos, 
    setFilteredVideos, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadVideos,
    handlePageChange,
    handlePageSizeChange
  };
};
