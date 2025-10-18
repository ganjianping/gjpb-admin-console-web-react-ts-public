import { useState } from 'react';
import type { Video } from '../types/video.types';
import type { VideoSearchFormData } from '../types/video.types';

export const useVideoSearch = (allVideos: Video[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<VideoSearchFormData>({ name: '', lang: '', tags: '', isActive: null });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof VideoSearchFormData, value: any) => setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () => setSearchFormData({ name: '', lang: '', tags: '', isActive: null });

  const applyClientSideFiltersWithData = (formData: VideoSearchFormData) => {
    const { name, lang, tags, isActive } = formData;
    return allVideos.filter((v) => {
      if (name && !v.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (lang && v.lang !== lang) return false;
      if (tags && !v.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !v.isActive) return false;
      if (isActive === 'false' && v.isActive) return false;
      return true;
    });
  };

  return { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleSearchFormChange, handleClearSearch, applyClientSideFiltersWithData };
};
