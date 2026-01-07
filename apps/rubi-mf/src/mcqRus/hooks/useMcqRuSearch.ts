import { useState } from 'react';
import type { McqRu, McqRuSearchFormData } from '../types/mcqRu.types';

export const useMcqRuSearch = (allMcqRus: McqRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<McqRuSearchFormData>({
    question: '',
    lang: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof McqRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      question: '',
      lang: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: McqRuSearchFormData) => {
    const { question, lang, tags, isActive } = formData;
    return allMcqRus.filter((mcqRu) => {
      if (question && !mcqRu.question?.toLowerCase().includes(question.toLowerCase())) return false;
      if (lang && mcqRu.lang !== lang) return false;
      if (tags && !mcqRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !mcqRu.isActive) return false;
      if (isActive === 'false' && mcqRu.isActive) return false;
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

export default useMcqRuSearch;