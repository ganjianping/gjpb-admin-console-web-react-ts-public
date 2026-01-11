import { useState } from 'react';
import type { ArticleRu, ArticleRuFormData, ArticleRuActionType } from '../types/articleRu.types';
import { getEmptyArticleRuFormData } from '../utils/getEmptyArticleRuFormData';

export const useArticleRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ArticleRuActionType>('view');
  const [formData, setFormData] = useState<ArticleRuFormData>(getEmptyArticleRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedArticleRu, setSelectedArticleRu] = useState<ArticleRu | null>(null);
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
    selectedArticleRu,
    setSelectedArticleRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useArticleRuDialog;
