import { useState } from 'react';
import type { Question, QuestionSearchFormData } from '../types/question.types';

export const useQuestionSearch = (allQuestions: Question[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<QuestionSearchFormData>({
    question: '',
    lang: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof QuestionSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      question: '',
      lang: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: QuestionSearchFormData) => {
    const { question, lang, tags, isActive } = formData;
    return allQuestions.filter((q) => {
      if (question && !q.question?.toLowerCase().includes(question.toLowerCase())) return false;
      if (lang && q.lang !== lang) return false;
      if (tags && !q.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !q.isActive) return false;
      if (isActive === 'false' && q.isActive) return false;
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

export default useQuestionSearch;
