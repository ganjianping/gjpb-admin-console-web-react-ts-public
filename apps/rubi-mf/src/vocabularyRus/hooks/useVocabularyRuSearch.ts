import { useState } from 'react';
import type { VocabularyRu, VocabularyRuSearchFormData } from '../types/vocabularyRu.types';

export const useVocabularyRuSearch = (allVocabularyRus: VocabularyRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<VocabularyRuSearchFormData>({
    name: '',
    lang: '',
    difficultyLevel: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof VocabularyRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      name: '',
      lang: '',
      difficultyLevel: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: VocabularyRuSearchFormData) => {
    const { name, lang, difficultyLevel, tags, isActive } = formData;
    return allVocabularyRus.filter((vocabularyRu) => {
      if (name && !vocabularyRu.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (lang && vocabularyRu.lang !== lang) return false;
      if (difficultyLevel && vocabularyRu.difficultyLevel !== difficultyLevel) return false;
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
