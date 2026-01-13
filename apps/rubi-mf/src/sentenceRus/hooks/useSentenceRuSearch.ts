import { useState } from 'react';
import type { SentenceRu, SentenceRuSearchFormData } from '../types/sentenceRu.types';

export const useSentenceRuSearch = (allSentenceRus: SentenceRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<SentenceRuSearchFormData>({
    name: '',
    lang: '',
    difficultyLevel: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof SentenceRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      name: '',
      lang: '',
      difficultyLevel: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: SentenceRuSearchFormData) => {
    const { name, lang, difficultyLevel, tags, isActive } = formData;
    return allSentenceRus.filter((sentenceRu) => {
      if (name && !sentenceRu.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (lang && sentenceRu.lang !== lang) return false;
      if (difficultyLevel && sentenceRu.difficultyLevel !== difficultyLevel) return false;
      if (tags && !sentenceRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !sentenceRu.isActive) return false;
      if (isActive === 'false' && sentenceRu.isActive) return false;
      return true;
    });
  };

  return {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  };
};

export default useSentenceRuSearch;
