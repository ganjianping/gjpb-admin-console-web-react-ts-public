import { useState } from 'react';
import type { McqRu, McqRuFormData, McqRuActionType } from '../types/mcqRu.types';
import { getEmptyMcqRuFormData } from '../utils/getEmptyMcqRuFormData';

export const useMcqRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<McqRuActionType>('view');
  const [formData, setFormData] = useState<McqRuFormData>(getEmptyMcqRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedMcqRu, setSelectedMcqRu] = useState<McqRu | null>(null);
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
    selectedMcqRu,
    setSelectedMcqRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useMcqRuDialog;