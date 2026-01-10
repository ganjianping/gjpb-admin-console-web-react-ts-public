import { useState } from 'react';
import type { FreeTextQuestionRu, FreeTextQuestionRuFormData, FreeTextQuestionRuActionType } from '../types/freeTextQuestionRu.types';
import { getEmptyFreeTextQuestionRuFormData } from '../utils/getEmptyFreeTextQuestionRuFormData';

export const useFreeTextQuestionRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<FreeTextQuestionRuActionType>('view');
  const [formData, setFormData] = useState<FreeTextQuestionRuFormData>(getEmptyFreeTextQuestionRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedFreeTextQuestionRu, setSelectedFreeTextQuestionRu] = useState<FreeTextQuestionRu | null>(null);
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
    selectedFreeTextQuestionRu,
    setSelectedFreeTextQuestionRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useFreeTextQuestionRuDialog;
