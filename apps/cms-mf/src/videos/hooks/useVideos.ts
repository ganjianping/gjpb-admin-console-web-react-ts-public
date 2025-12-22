import { useEffect, useState } from 'react';
import { videoService } from '../services/videoService';
import type { Video } from '../types/video.types';

export const useVideos = () => {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = async (params?: any) => {
    setLoading(true);
    try {
      const res = await videoService.getVideos(params);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        const videos = Array.isArray(responseData) ? responseData : responseData.content;
        setAllVideos(videos || []);
        setFilteredVideos(videos || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return { allVideos, filteredVideos, setFilteredVideos, loading, error, loadVideos };
};
