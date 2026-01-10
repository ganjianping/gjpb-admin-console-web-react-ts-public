import { useState } from 'react';
import type { FreeTextQuestionRu, FreeTextQuestionRuSearchFormData } from '../types/freeTextQuestionRu.types';

export const useFreeTextQuestionRuSearch = (allFreeTextQuestionRus: FreeTextQuestionRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<FreeTextQuestionRuSearchFormData>({
    question: '',
    lang: '',
    tags: '',
    difficultyLevel: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof FreeTextQuestionRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      question: '',
      lang: '',
      tags: '',
      difficultyLevel: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: FreeTextQuestionRuSearchFormData) => {
    const { question, lang, tags, difficultyLevel, isActive } = formData;
    return allFreeTextQuestionRus.filter((freeTextQuestionRu) => {
      if (question && !freeTextQuestionRu.question?.toLowerCase().includes(question.toLowerCase())) return false;
      if (lang && freeTextQuestionRu.lang !== lang) return false;
      if (tags && !freeTextQuestionRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (difficultyLevel && freeTextQuestionRu.difficultyLevel !== difficultyLevel) return false;
      if (isActive === 'true' && !freeTextQuestionRu.isActive) return false;
      if (isActive === 'false' && freeTextQuestionRu.isActive) return false;
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

export default useFreeTextQuestionRuSearch;
