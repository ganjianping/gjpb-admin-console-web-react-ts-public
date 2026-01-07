import { useState } from 'react';
import type { VocabularyRu, VocabularyRuSearchFormData } from '../types/vocabularyRu.types';

export const useVocabularyRuSearch = (allVocabularyRus: VocabularyRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<VocabularyRuSearchFormData>({
    word: '',
    lang: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof VocabularyRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      word: '',
      lang: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: VocabularyRuSearchFormData) => {
    const { word, lang, tags, isActive } = formData;
    return allVocabularyRus.filter((vocabularyRu) => {
      if (word && !vocabularyRu.word?.toLowerCase().includes(word.toLowerCase())) return false;
      if (lang && vocabularyRu.lang !== lang) return false;
      if (tags && !vocabularyRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !vocabularyRu.isActive) return false;
      if (isActive === 'false' && vocabularyRu.isActive) return false;
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

export default useVocabularyRuSearch;
