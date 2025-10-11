import { useState, useCallback } from 'react';
import i18n from 'i18next';
import { LANGUAGE_OPTIONS } from '../constants/index';

import '../i18n/translations';
import type { Website, WebsiteFormData, WebsiteActionType } from '../types/website.types';

/**
 * Hook to manage app setting dialog state and UI interactions
 * 
 * This hook manages all UI-related state for the app setting dialog, including:
 * - Dialog open/close state
 * - Form data and validation errors
 * - Action type (view, edit, create, delete)
 * - Loading state
 * 
 * Business logic (save/delete operations) is handled by useWebsiteHandlers.
 * 
 * @returns {Object} Dialog state and handler methods
 * 
 * @example
 * ```tsx
 * const {
 *   dialogOpen,
 *   formData,
 *   formErrors,
 *   handleCreate,
 *   handleEdit,
 *   handleClose,
 * } = useWebsiteDialog();
 * ```
 * 
 * @see {@link useWebsiteHandlers} for business logic
 * @see {@link WebsitesPage} for usage example
 */
export const useWebsiteDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [actionType, setActionType] = useState<WebsiteActionType>('view');
  const [loading, setLoading] = useState(false);

  // Get default language from localStorage or i18n
  // (Removed invalid import)

  const getDefaultLang = () => {
    if (typeof window !== 'undefined') {
      let localLang = localStorage.getItem('gjpb_language');
      if (localLang) {
        localLang = localLang.trim().toUpperCase();
        const validLang = LANGUAGE_OPTIONS.find(opt => opt.value === localLang);
        if (validLang) return validLang.value;
      }
    }
    const i18nLang = (i18n.language || '').trim().toUpperCase();
    const validLang = LANGUAGE_OPTIONS.find(opt => opt.value === i18nLang);
    return validLang ? validLang.value : '';
  };

  const [formData, setFormData] = useState<WebsiteFormData>({
    name: '',
    url: '',
    logoUrl: '',
    description: '',
    tags: '',
    lang: getDefaultLang(),
    displayOrder: 0,
    isActive: true,
    logoUploadMethod: 'url',
    logoFile: null,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof WebsiteFormData, string>>>({});

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      url: '',
      logoUrl: '',
      description: '',
      tags: '',
      lang: getDefaultLang(),
      displayOrder: 0,
      isActive: true,
      logoUploadMethod: 'url',
      logoFile: null,
    });
    setFormErrors({});
  }, []);

  const handleView = useCallback((website: Website) => {
    setSelectedWebsite(website);
    setFormData({
      name: website.name,
      url: website.url,
      logoUrl: website.logoUrl,
      description: website.description,
      tags: website.tags,
      lang: website.lang,
      displayOrder: website.displayOrder,
      isActive: website.isActive,
      logoUploadMethod: 'url',
      logoFile: null,
    });
    setActionType('view');
    setDialogOpen(true);
    setFormErrors({});
  }, []);

  const handleEdit = useCallback((website: Website) => {
    setSelectedWebsite(website);
    setFormData({
      name: website.name,
      url: website.url,
      logoUrl: website.logoUrl,
      description: website.description,
      tags: website.tags,
      lang: website.lang,
      displayOrder: website.displayOrder,
      isActive: website.isActive,
      logoUploadMethod: 'url',
      logoFile: null,
    });
    setActionType('edit');
    setDialogOpen(true);
    setFormErrors({});
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedWebsite(null);
    resetForm();
    setActionType('create');
    setDialogOpen(true);
  }, [resetForm]);

  const handleDelete = useCallback((website: Website) => {
    setSelectedWebsite(website);
    setActionType('delete');
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    setDialogOpen(false);
    setSelectedWebsite(null);
    resetForm();
    setActionType('view');
  }, [loading, resetForm]);

  const handleFormChange = useCallback((field: keyof WebsiteFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  return {
    dialogOpen,
    selectedWebsite,
    actionType,
    loading,
    setLoading,
    formData,
    formErrors,
    setFormErrors,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleClose,
    handleFormChange,
  };
};
