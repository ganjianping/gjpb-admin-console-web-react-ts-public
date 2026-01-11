import { useState } from 'react';
import type { TrueFalseQuestionRu, TrueFalseQuestionRuSearchFormData } from '../types/trueFalseQuestionRu.types';

export const useTrueFalseQuestionRuSearch = (allTrueFalseQuestionRus: TrueFalseQuestionRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<TrueFalseQuestionRuSearchFormData>({
    question: '',
    lang: '',
    tags: '',
    difficultyLevel: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof TrueFalseQuestionRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      question: '',
      lang: '',
      tags: '',
      difficultyLevel: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: TrueFalseQuestionRuSearchFormData) => {
    const { question, lang, tags, difficultyLevel, isActive } = formData;
    return allTrueFalseQuestionRus.filter((trueFalseQuestionRu) => {
      if (question && !trueFalseQuestionRu.question?.toLowerCase().includes(question.toLowerCase())) return false;
      if (lang && trueFalseQuestionRu.lang !== lang) return false;
      if (tags && !trueFalseQuestionRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (difficultyLevel && trueFalseQuestionRu.difficultyLevel !== difficultyLevel) return false;
      if (isActive === 'true' && !trueFalseQuestionRu.isActive) return false;
      if (isActive === 'false' && trueFalseQuestionRu.isActive) return false;
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

export default useTrueFalseQuestionRuSearch;
