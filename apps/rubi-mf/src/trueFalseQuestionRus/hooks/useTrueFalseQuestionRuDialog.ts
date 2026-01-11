import { useState } from 'react';
import type { TrueFalseQuestionRu, TrueFalseQuestionRuFormData, TrueFalseQuestionRuActionType } from '../types/trueFalseQuestionRu.types';
import { getEmptyTrueFalseQuestionRuFormData } from '../utils/getEmptyTrueFalseQuestionRuFormData';

export const useTrueFalseQuestionRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<TrueFalseQuestionRuActionType>('view');
  const [formData, setFormData] = useState<TrueFalseQuestionRuFormData>(getEmptyTrueFalseQuestionRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedTrueFalseQuestionRu, setSelectedTrueFalseQuestionRu] = useState<TrueFalseQuestionRu | null>(null);
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
    selectedTrueFalseQuestionRu,
    setSelectedTrueFalseQuestionRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useTrueFalseQuestionRuDialog;
