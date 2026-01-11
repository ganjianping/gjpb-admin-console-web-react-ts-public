import { useState } from 'react';
import type { FillBlankQuestionRu, FillBlankQuestionRuSearchFormData } from '../types/fillBlankQuestionRu.types';

export const useFillBlankQuestionRuSearch = (allFillBlankQuestionRus: FillBlankQuestionRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<FillBlankQuestionRuSearchFormData>({
    question: '',
    lang: '',
    tags: '',
    difficultyLevel: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof FillBlankQuestionRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      question: '',
      lang: '',
      tags: '',
      difficultyLevel: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: FillBlankQuestionRuSearchFormData) => {
    const { question, lang, tags, difficultyLevel, isActive } = formData;
    return allFillBlankQuestionRus.filter((fillBlankQuestionRu) => {
      if (question && !fillBlankQuestionRu.question?.toLowerCase().includes(question.toLowerCase())) return false;
      if (lang && fillBlankQuestionRu.lang !== lang) return false;
      if (tags && !fillBlankQuestionRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (difficultyLevel && fillBlankQuestionRu.difficultyLevel !== difficultyLevel) return false;
      if (isActive === 'true' && !fillBlankQuestionRu.isActive) return false;
      if (isActive === 'false' && fillBlankQuestionRu.isActive) return false;
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

export default useFillBlankQuestionRuSearch;
