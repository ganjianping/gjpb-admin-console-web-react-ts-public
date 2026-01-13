import { useState } from 'react';
import type { ExpressionRu, ExpressionRuSearchFormData } from '../types/expressionRu.types';

export const useExpressionRuSearch = (allExpressionRus: ExpressionRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<ExpressionRuSearchFormData>({
    name: '',
    lang: '',
    difficultyLevel: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof ExpressionRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      name: '',
      lang: '',
      difficultyLevel: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: ExpressionRuSearchFormData) => {
    const { name, lang, difficultyLevel, tags, isActive } = formData;
    return allExpressionRus.filter((expressionRu) => {
      if (name && !expressionRu.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (lang && expressionRu.lang !== lang) return false;
      if (difficultyLevel && expressionRu.difficultyLevel !== difficultyLevel) return false;
      if (tags && !expressionRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !expressionRu.isActive) return false;
      if (isActive === 'false' && expressionRu.isActive) return false;
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

export default useExpressionRuSearch;
