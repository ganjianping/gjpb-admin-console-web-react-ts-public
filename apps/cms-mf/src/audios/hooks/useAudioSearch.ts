import { useState } from 'react';
import type { Audio, AudioSearchFormData } from '../types/audio.types';

export const useAudioSearch = (allAudios: Audio[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<AudioSearchFormData>({ name: '', lang: '', tags: '', isActive: null });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof AudioSearchFormData, value: any) => setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () => setSearchFormData({ name: '', lang: '', tags: '', isActive: null });

  const applyClientSideFiltersWithData = (formData: AudioSearchFormData) => {
    const { name, lang, tags, isActive } = formData;
    return allAudios.filter((v) => {
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

export default useAudioSearch;
