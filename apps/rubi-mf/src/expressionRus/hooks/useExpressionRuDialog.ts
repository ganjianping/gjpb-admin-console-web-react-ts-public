import { useState } from 'react';
import type { ExpressionRu, ExpressionRuFormData, ExpressionRuActionType } from '../types/expressionRu.types';
import { getEmptyExpressionRuFormData } from '../utils/getEmptyExpressionRuFormData';

export const useExpressionRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ExpressionRuActionType>('view');
  const [formData, setFormData] = useState<ExpressionRuFormData>(getEmptyExpressionRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedExpressionRu, setSelectedExpressionRu] = useState<ExpressionRu | null>(null);
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
    selectedExpressionRu,
    setSelectedExpressionRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useExpressionRuDialog;
