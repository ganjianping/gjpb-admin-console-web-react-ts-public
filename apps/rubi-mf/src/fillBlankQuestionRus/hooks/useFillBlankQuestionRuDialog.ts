import { useState } from 'react';
import type { FillBlankQuestionRu, FillBlankQuestionRuFormData, FillBlankQuestionRuActionType } from '../types/fillBlankQuestionRu.types';
import { getEmptyFillBlankQuestionRuFormData } from '../utils/getEmptyFillBlankQuestionRuFormData';

export const useFillBlankQuestionRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<FillBlankQuestionRuActionType>('view');
  const [formData, setFormData] = useState<FillBlankQuestionRuFormData>(getEmptyFillBlankQuestionRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedFillBlankQuestionRu, setSelectedFillBlankQuestionRu] = useState<FillBlankQuestionRu | null>(null);
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
    selectedFillBlankQuestionRu,
    setSelectedFillBlankQuestionRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useFillBlankQuestionRuDialog;
