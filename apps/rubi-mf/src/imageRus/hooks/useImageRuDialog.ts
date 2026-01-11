import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ImageRu, ImageRuFormData, ImageRuActionType } from '../types/imageRu.types';
import { getEmptyImageRuFormData } from '../utils/getEmptyImageRuFormData';

export const useImageRuDialog = () => {
  const { i18n } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImageRu, setSelectedImageRu] = useState<ImageRu | null>(null);
  const [actionType, setActionType] = useState<ImageRuActionType>('view');
  const [loading, setLoading] = useState(false);
  const getCurrentLanguage = useCallback(() => {
    return i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
  }, [i18n.language]);
  const [formData, setFormData] = useState<ImageRuFormData>(() => getEmptyImageRuFormData(getCurrentLanguage()));
  const [formErrors, setFormErrors] = useState<Record<string, string[] | string>>({});
  return {
    dialogOpen,
    setDialogOpen,
    selectedImageRu,
    setSelectedImageRu,
    actionType,
    setActionType,
    loading,
    setLoading,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    getCurrentLanguage,
  };
};
