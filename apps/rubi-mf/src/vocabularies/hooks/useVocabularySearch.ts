import { useState } from 'react';
import type { Vocabulary, VocabularySearchFormData } from '../types/vocabulary.types';

export const useVocabularySearch = (allVocabularies: Vocabulary[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<VocabularySearchFormData>({
    word: '',
    lang: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof VocabularySearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      word: '',
      lang: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: VocabularySearchFormData) => {
    const { word, lang, tags, isActive } = formData;
    return allVocabularies.filter((vocabulary) => {
      if (word && !vocabulary.word?.toLowerCase().includes(word.toLowerCase())) return false;
      if (lang && vocabulary.lang !== lang) return false;
      if (tags && !vocabulary.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !vocabulary.isActive) return false;
      if (isActive === 'false' && vocabulary.isActive) return false;
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

export default useVocabularySearch;
