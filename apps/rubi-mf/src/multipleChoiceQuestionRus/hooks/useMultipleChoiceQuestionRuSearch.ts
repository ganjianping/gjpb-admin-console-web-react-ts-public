import { useState } from 'react';
import type { MultipleChoiceQuestionRu, MultipleChoiceQuestionRuSearchFormData } from '../types/multipleChoiceQuestionRu.types';

export const useMultipleChoiceQuestionRuSearch = (allMultipleChoiceQuestionRus: MultipleChoiceQuestionRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<MultipleChoiceQuestionRuSearchFormData>({
    question: '',
    lang: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof MultipleChoiceQuestionRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      question: '',
      lang: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: MultipleChoiceQuestionRuSearchFormData) => {
    const { question, lang, tags, isActive } = formData;
    return allMultipleChoiceQuestionRus.filter((multipleChoiceQuestionRu) => {
      if (question && !multipleChoiceQuestionRu.question?.toLowerCase().includes(question.toLowerCase())) return false;
      if (lang && multipleChoiceQuestionRu.lang !== lang) return false;
      if (tags && !multipleChoiceQuestionRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !multipleChoiceQuestionRu.isActive) return false;
      if (isActive === 'false' && multipleChoiceQuestionRu.isActive) return false;
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

export default useMultipleChoiceQuestionRuSearch;