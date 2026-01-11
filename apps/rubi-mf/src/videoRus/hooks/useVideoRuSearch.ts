import { useState } from 'react';
import type { VideoRu } from '../types/videoRu.types';
import type { VideoRuSearchFormData } from '../types/videoRu.types';

export const useVideoRuSearch = (allVideoRus: VideoRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<VideoRuSearchFormData>({ name: '', lang: '', tags: '', isActive: null });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof VideoRuSearchFormData, value: any) => setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () => setSearchFormData({ name: '', lang: '', tags: '', isActive: null });

  const applyClientSideFiltersWithData = (formData: VideoRuSearchFormData) => {
    const { name, lang, tags, isActive } = formData;
    return allVideoRus.filter((v) => {
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
