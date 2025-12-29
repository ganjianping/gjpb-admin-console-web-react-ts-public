import { useState } from 'react';
import type { Question, QuestionFormData, QuestionActionType } from '../types/question.types';
import { getEmptyQuestionFormData } from '../utils/getEmptyQuestionFormData';

export const useQuestionDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<QuestionActionType>('view');
  const [formData, setFormData] = useState<QuestionFormData>(getEmptyQuestionFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
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
    selectedQuestion,
    setSelectedQuestion,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useQuestionDialog;
