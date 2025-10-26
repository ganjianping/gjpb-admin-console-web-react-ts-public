import { useState } from 'react';
import type { Article, ArticleSearchFormData } from '../types/article.types';

export const useArticleSearch = (allArticles: Article[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<ArticleSearchFormData>({
    title: '',
    lang: '',
    tags: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof ArticleSearchFormData, value: any) =>
    setSearchFormData({ ...searchFormData, [field]: value });
  const handleClearSearch = () =>
    setSearchFormData({
      title: '',
      lang: '',
      tags: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: ArticleSearchFormData) => {
    const { title, lang, tags, isActive } = formData;
    return allArticles.filter((article) => {
      if (title && !article.title?.toLowerCase().includes(title.toLowerCase())) return false;
      if (lang && article.lang !== lang) return false;
      if (tags && !article.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (isActive === 'true' && !article.isActive) return false;
      if (isActive === 'false' && article.isActive) return false;
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

export default useArticleSearch;
