import { useState } from 'react';
import type { AudioRu, AudioRuSearchFormData } from '../types/audioRu.types';

export const useAudioRuSearch = (allAudioRus: AudioRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<AudioRuSearchFormData>({ name: '', lang: '', tags: '', isActive: null });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof AudioRuSearchFormData, value: any) => setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () => setSearchFormData({ name: '', lang: '', tags: '', isActive: null });

  const applyClientSideFiltersWithData = (formData: AudioRuSearchFormData) => {
    const { name, lang, tags, isActive } = formData;
    return allAudioRus.filter((v) => {
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

export default useAudioRuSearch;
