import { useState } from 'react';
import type { Article, ArticleFormData, ArticleActionType } from '../types/article.types';
import { getEmptyArticleFormData } from '../utils/getEmptyArticleFormData';

export const useArticleDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ArticleActionType>('view');
  const [formData, setFormData] = useState<ArticleFormData>(getEmptyArticleFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLanguage = () => formData.lang || 'EN';

  return {
    dialogOpen,
    setDialogOpen,
    actionType,
    setActionType,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    selectedArticle,
    setSelectedArticle,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useArticleDialog;
