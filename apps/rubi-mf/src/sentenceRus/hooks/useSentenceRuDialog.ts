import { useState } from 'react';
import type { SentenceRu, SentenceRuFormData, SentenceRuActionType } from '../types/sentenceRu.types';
import { getEmptySentenceRuFormData } from '../utils/getEmptySentenceRuFormData';

export const useSentenceRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<SentenceRuActionType>('view');
  const [formData, setFormData] = useState<SentenceRuFormData>(getEmptySentenceRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedSentenceRu, setSelectedSentenceRu] = useState<SentenceRu | null>(null);
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
    selectedSentenceRu,
    setSelectedSentenceRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useSentenceRuDialog;
