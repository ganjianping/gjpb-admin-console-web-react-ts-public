import { useState } from 'react';
import type { VocabularyRu, VocabularyRuFormData, VocabularyRuActionType } from '../types/vocabularyRu.types';
import { getEmptyVocabularyRuFormData } from '../utils/getEmptyVocabularyRuFormData';

export const useVocabularyRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<VocabularyRuActionType>('view');
  const [formData, setFormData] = useState<VocabularyRuFormData>(getEmptyVocabularyRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedVocabularyRu, setSelectedVocabularyRu] = useState<VocabularyRu | null>(null);
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
    selectedVocabularyRu,
    setSelectedVocabularyRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useVocabularyRuDialog;
