import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Image, ImageFormData, ImageActionType } from '../types/image.types';

export const useImageDialog = () => {
  const { i18n } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [actionType, setActionType] = useState<ImageActionType>('view');
  const [loading, setLoading] = useState(false);
  const getCurrentLanguage = useCallback(() => {
    return i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
  }, [i18n.language]);
  const [formData, setFormData] = useState<ImageFormData>(() => ({
    name: '',
    originalUrl: '',
    sourceName: '',
    filename: '',
    thumbnailFilename: '',
    extension: '',
    mimeType: '',
    sizeBytes: 0,
    width: 0,
    height: 0,
    altText: '',
    tags: '',
    lang: getCurrentLanguage(),
    displayOrder: 0,
    isActive: true,
    uploadMethod: 'url',
    file: null,
  }));
  const [formErrors, setFormErrors] = useState<Record<string, string[] | string>>({});
  return {
    dialogOpen,
    setDialogOpen,
    selectedImage,
    setSelectedImage,
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
