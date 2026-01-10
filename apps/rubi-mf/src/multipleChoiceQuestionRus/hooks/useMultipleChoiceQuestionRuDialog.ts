import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MultipleChoiceQuestionRu, MultipleChoiceQuestionRuFormData, MultipleChoiceQuestionRuActionType } from '../types/multipleChoiceQuestionRu.types';
import { getEmptyMultipleChoiceQuestionRuFormData } from '../utils/getEmptyMultipleChoiceQuestionRuFormData';

export const useMultipleChoiceQuestionRuDialog = () => {
  const { t } = useTranslation('multipleChoiceQuestionRus');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<MultipleChoiceQuestionRuActionType>('view');
  const [formData, setFormData] = useState<MultipleChoiceQuestionRuFormData>(getEmptyMultipleChoiceQuestionRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedMultipleChoiceQuestionRu, setSelectedMultipleChoiceQuestionRu] = useState<MultipleChoiceQuestionRu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLanguage = () => formData.lang || 'EN';

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.question?.trim()) {
      errors.question = t('validation.questionRequired');
    }

    if (!formData.optionA?.trim()) {
      errors.optionA = t('validation.optionARequired');
    }

    if (!formData.optionB?.trim()) {
      errors.optionB = t('validation.optionBRequired');
    }

    if (!formData.optionC?.trim()) {
      errors.optionC = t('validation.optionCRequired');
    }

    if (!formData.optionD?.trim()) {
      errors.optionD = t('validation.optionDRequired');
    }

    if (!formData.answer?.trim()) {
      errors.answer = t('validation.answerRequired');
    }

    if (!formData.difficultyLevel) {
      errors.difficultyLevel = t('validation.difficultyLevelRequired');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetError = () => setError(null);

  return {
    dialogOpen,
    setDialogOpen,
    actionType,
    setActionType,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    selectedMultipleChoiceQuestionRu,
    setSelectedMultipleChoiceQuestionRu,
    loading,
    setLoading,
    error,
    setError,
    getCurrentLanguage,
    validateForm,
    resetError,
  } as const;
};

export default useMultipleChoiceQuestionRuDialog;