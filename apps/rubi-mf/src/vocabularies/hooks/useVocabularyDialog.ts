import { useState } from 'react';
import type { Vocabulary, VocabularyFormData, VocabularyActionType } from '../types/vocabulary.types';
import { getEmptyVocabularyFormData } from '../utils/getEmptyVocabularyFormData';

export const useVocabularyDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<VocabularyActionType>('view');
  const [formData, setFormData] = useState<VocabularyFormData>(getEmptyVocabularyFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null);
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
    selectedVocabulary,
    setSelectedVocabulary,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useVocabularyDialog;
