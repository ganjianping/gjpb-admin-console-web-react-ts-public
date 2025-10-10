import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import '../i18n/translations';
import type { Logo, LogoFormData, LogoActionType } from '../types/logo.types';

/**
 * Hook to manage logo dialog state and UI interactions
 * 
 * This hook manages all UI-related state for the logo dialog, including:
 * - Dialog open/close state
 * - Form data and validation errors
 * - Action type (view, edit, create, delete)
 * - Loading state
 * 
 * Business logic (save/delete operations) is handled by useLogoHandlers.
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
 * } = useLogoDialog();
 * ```
 * 
 * @see {@link useLogoHandlers} for business logic
 * @see {@link LogosPage} for usage example
 */
export const useLogoDialog = () => {
  const { i18n } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const [actionType, setActionType] = useState<LogoActionType>('view');
  const [loading, setLoading] = useState(false);

  // Helper function to get current language in uppercase format
  const getCurrentLanguage = useCallback(() => {
    return i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
  }, [i18n.language]);

  const [formData, setFormData] = useState<LogoFormData>(() => ({
    name: '',
    originalUrl: '',
    filename: '',
    extension: '',
    logoUrl: '',
    tags: 'Website',
    lang: i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN',
    displayOrder: 0,
    isActive: true,
    uploadMethod: 'url',
    file: null,
  }));

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LogoFormData, string>>>({});

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      originalUrl: '',
      filename: '',
      extension: '',
      logoUrl: '',
      tags: 'Website',
      lang: getCurrentLanguage(),
      displayOrder: 0,
      isActive: true,
      uploadMethod: 'url',
      file: null,
    });
    setFormErrors({});
  }, [getCurrentLanguage]);

  const handleView = useCallback((logo: Logo) => {
    setSelectedLogo(logo);
    setFormData({
      name: logo.name,
      originalUrl: logo.originalUrl || '',
      filename: logo.filename,
      extension: logo.extension,
      logoUrl: logo.logoUrl,
      tags: logo.tags,
      lang: logo.lang,
      displayOrder: logo.displayOrder,
      isActive: logo.isActive,
      uploadMethod: 'url',
      file: null,
    });
    setActionType('view');
    setDialogOpen(true);
    setFormErrors({});
  }, []);

  const handleEdit = useCallback((logo: Logo) => {
    setSelectedLogo(logo);
    setFormData({
      name: logo.name,
      originalUrl: logo.originalUrl || '',
      filename: logo.filename,
      extension: logo.extension,
      logoUrl: logo.logoUrl,
      tags: logo.tags,
      lang: logo.lang,
      displayOrder: logo.displayOrder,
      isActive: logo.isActive,
      uploadMethod: 'url',
      file: null,
    });
    setActionType('edit');
    setDialogOpen(true);
    setFormErrors({});
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedLogo(null);
    resetForm();
    setActionType('create');
    setDialogOpen(true);
  }, [resetForm]);

  const handleDelete = useCallback((logo: Logo) => {
    setSelectedLogo(logo);
    setActionType('delete');
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    setDialogOpen(false);
    setSelectedLogo(null);
    resetForm();
    setActionType('view');
  }, [loading, resetForm]);

  const handleFormChange = useCallback((field: keyof LogoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  return {
    dialogOpen,
    selectedLogo,
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
