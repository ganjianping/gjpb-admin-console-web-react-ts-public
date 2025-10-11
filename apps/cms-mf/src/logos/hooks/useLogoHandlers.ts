import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Logo, LogoActionType, LogoFormData } from '../types/logo.types';
import type { CreateLogoRequest, CreateLogoByUploadRequest, UpdateLogoRequest } from '../services/logoService';
import { logoService } from '../services/logoService';
import { LOGO_CONSTANTS } from '../constants';

/**
 * Parameters for useLogoHandlers hook
 * @interface UseLogoHandlersParams
 */
interface UseLogoHandlersParams {
  /** Callback invoked when operation succeeds, receives success message */
  onSuccess: (message: string) => void;
  /** Callback invoked when operation fails, receives error message */
  onError: (message: string) => void;
  /** Callback invoked to refresh data after successful operations */
  onRefresh: () => void;
}

/**
 * Custom hook to handle logo CRUD operations
 * 
 * This hook separates business logic from UI components, providing a clean interface
 * for creating, updating, and deleting logos. It handles validation, API calls,
 * error handling, and success/error notifications.
 * 
 * @param {UseLogoHandlersParams} params - Configuration callbacks
 * @returns {Object} Handler methods for logo operations
 * 
 * @example
 * ```tsx
 * const { handleSave, handleDelete } = useLogoHandlers({
 *   onSuccess: (msg) => showSuccess(msg),
 *   onError: (msg) => showError(msg),
 *   onRefresh: () => loadLogos(),
 * });
 * ```
 * 
 * @see {@link useLogoDialog} for UI state management
 * @see {@link LogosPage} for usage example
 */
export const useLogoHandlers = ({
  onSuccess,
  onError,
  onRefresh,
}: UseLogoHandlersParams) => {
  const { t } = useTranslation();

  /**
   * Create a new logo (supports both URL and file upload methods)
   */
  const createLogo = useCallback(async (formData: LogoFormData) => {
    let response;
    
    if (formData.uploadMethod === 'file') {
      // Create logo by uploading a file
      if (!formData.file) {
        throw new Error(t('logos.errors.fileRequired'));
      }
      
      const createRequest: CreateLogoByUploadRequest = {
        file: formData.file,
        name: formData.name.trim(),
        tags: formData.tags.trim(),
        lang: formData.lang.trim(),
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      };
      
      response = await logoService.createLogoByUpload(createRequest);
    } else {
      // Create logo by originalUrl
      if (!formData.originalUrl.trim()) {
        throw new Error(t('logos.errors.originalUrlRequired'));
      }
      
      const createRequest: CreateLogoRequest = {
        name: formData.name.trim(),
        originalUrl: formData.originalUrl.trim(),
        tags: formData.tags.trim(),
        lang: formData.lang.trim(),
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      };
      
      response = await logoService.createLogo(createRequest);
    }
    
    if (response.status.code === 200 || response.status.code === 201) {
      return t('logos.messages.createSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Update an existing logo
   */
  const updateLogo = useCallback(async (id: string, formData: LogoFormData) => {
    const updateRequest: UpdateLogoRequest = {
      name: formData.name.trim(),
      originalUrl: formData.originalUrl.trim() || null,
      extension: formData.extension.trim(),
      tags: formData.tags.trim(),
      lang: formData.lang.trim(),
      displayOrder: formData.displayOrder,
      isActive: formData.isActive,
    };
    
    const response = await logoService.updateLogo(id, updateRequest);
    
    if (response.status.code === 200) {
      return t('logos.messages.updateSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Delete a logo
   */
  const deleteLogo = useCallback(async (id: string) => {
    const response = await logoService.deleteLogo(id);
    
    if (response.status.code === 200 || response.status.code === 204) {
      return t('logos.messages.deleteSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Validate form data
   */
  const validateForm = useCallback((formData: LogoFormData, actionType: LogoActionType): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = t('logos.errors.nameRequired');
    } else if (formData.name.length < LOGO_CONSTANTS.VALIDATION.NAME_MIN_LENGTH) {
      errors.name = t('logos.errors.nameTooShort');
    } else if (formData.name.length > LOGO_CONSTANTS.VALIDATION.NAME_MAX_LENGTH) {
      errors.name = t('logos.errors.nameTooLong');
    }

    // Language validation
    if (!formData.lang.trim()) {
      errors.lang = t('logos.errors.langRequired');
    }

    // Tags validation
    if (!formData.tags.trim()) {
      errors.tags = t('logos.errors.tagsRequired');
    }

    // Create mode validation
    if (actionType === 'create') {
      if (formData.uploadMethod === 'file') {
        // File upload validation
        if (!formData.file) {
          errors.file = t('logos.errors.fileRequired');
        }
      } else if (!formData.originalUrl.trim()) {
        // URL validation
        errors.originalUrl = t('logos.errors.originalUrlRequired');
      } else if (formData.originalUrl.length > LOGO_CONSTANTS.VALIDATION.ORIGINAL_URL_MAX_LENGTH) {
        errors.originalUrl = t('logos.errors.originalUrlTooLong');
      }
    }

    // Edit mode validation - validate only the editable fields
    if (actionType === 'edit') {
      // Extension validation
      if (!formData.extension?.trim()) {
        errors.extension = t('logos.errors.extensionRequired');
      } else if (formData.extension.length > LOGO_CONSTANTS.VALIDATION.EXTENSION_MAX_LENGTH) {
        errors.extension = t('logos.errors.extensionTooLong');
      }

      // Original URL validation (optional in edit mode)
      if (formData.originalUrl && formData.originalUrl.length > LOGO_CONSTANTS.VALIDATION.ORIGINAL_URL_MAX_LENGTH) {
        errors.originalUrl = t('logos.errors.originalUrlTooLong');
      }
    }

    return errors;
  }, [t]);

  /**
   * Handle save operation (create or update)
   */
  const handleSave = useCallback(async (
    actionType: LogoActionType,
    formData: LogoFormData,
    selectedLogo: Logo | null,
    setFormErrors: (errors: Record<string, string[] | string>) => void
  ) => {
    // Validate form
    const validationErrors = validateForm(formData, actionType);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return false;
    }

    try {
      let successMessage: string;
      
      if (actionType === 'create') {
        successMessage = await createLogo(formData);
      } else if (actionType === 'edit' && selectedLogo) {
        successMessage = await updateLogo(selectedLogo.id, formData);
      } else {
        return false;
      }
      
      onSuccess(successMessage);
      onRefresh();
      return true;
    } catch (err: any) {
      console.error('Save logo error:', err);
      
      const errorMessage = err?.message || t('logos.errors.createFailed');
      onError(errorMessage);
      return false;
    }
  }, [t, validateForm, createLogo, updateLogo, onSuccess, onError, onRefresh]);

  /**
   * Handle delete operation
   */
  const handleDelete = useCallback(async (selectedLogo: Logo | null) => {
    if (!selectedLogo) return false;

    try {
      const successMessage = await deleteLogo(selectedLogo.id);
      onSuccess(successMessage);
      onRefresh();
      return true;
    } catch (err: any) {
      console.error('Delete logo error:', err);
      const errorMessage = err?.message || t('logos.errors.deleteFailed');
      onError(errorMessage);
      return false;
    }
  }, [deleteLogo, onSuccess, onError, onRefresh, t]);

  return {
    handleSave,
    handleDelete,
  };
};
