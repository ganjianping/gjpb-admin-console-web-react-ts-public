import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { CmsFile, FileFormData, FileActionType } from '../types/file.types';
import { getEmptyFileFormData } from '../utils/getEmptyFileFormData';

export const useFileDialog = () => {
  const { i18n } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CmsFile | null>(null);
  const [actionType, setActionType] = useState<FileActionType>('view');
  const [loading, setLoading] = useState(false);
  const getCurrentLanguage = useCallback(() => {
    return i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
  }, [i18n.language]);
  const [formData, setFormData] = useState<FileFormData>(() => getEmptyFileFormData(getCurrentLanguage()));
  const [formErrors, setFormErrors] = useState<Record<string, string[] | string>>({});
  return {
    dialogOpen,
    setDialogOpen,
    selectedFile,
    setSelectedFile,
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
