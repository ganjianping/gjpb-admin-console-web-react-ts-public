import { useState } from 'react';
import type { ArticleRu, ArticleRuSearchFormData } from '../types/articleRu.types';

export const useArticleRuSearch = (allArticleRus: ArticleRu[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<ArticleRuSearchFormData>({
    title: '',
    lang: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof ArticleRuSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      title: '',
      lang: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: ArticleRuSearchFormData) => {
    const { title, lang, tags, isActive } = formData;
    return allArticleRus.filter((articleRu) => {
      if (title && !articleRu.title?.toLowerCase().includes(title.toLowerCase())) return false;
      if (lang && articleRu.lang !== lang) return false;
      if (tags && !articleRu.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !articleRu.isActive) return false;
      if (isActive === 'false' && articleRu.isActive) return false;
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

export default useArticleRuSearch;
