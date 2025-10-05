import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Website, WebsiteActionType, WebsiteFormData } from '../types/website.types';
import type { CreateWebsiteRequest, UpdateWebsiteRequest } from '../services/websiteService';
import { websiteService } from '../services/websiteService';
import { WEBSITE_CONSTANTS } from '../constants';
import { handleApiError, extractValidationErrors } from '../utils/error-handler';

/**
 * Parameters for useWebsiteHandlers hook
 * @interface UseWebsiteHandlersParams
 */
interface UseWebsiteHandlersParams {
  /** Callback invoked when operation succeeds, receives success message */
  onSuccess: (message: string) => void;
  /** Callback invoked when operation fails, receives error message */
  onError: (message: string) => void;
  /** Callback invoked to refresh data after successful operations */
  onRefresh: () => void;
}

/**
 * Custom hook to handle app setting CRUD operations
 * 
 * This hook separates business logic from UI components, providing a clean interface
 * for creating, updating, and deleting websites. It handles validation, API calls,
 * error handling, and success/error notifications.
 * 
 * @param {UseWebsiteHandlersParams} params - Configuration callbacks
 * @returns {Object} Handler methods for app setting operations
 * 
 * @example
 * ```tsx
 * const { handleSave, handleDelete } = useWebsiteHandlers({
 *   onSuccess: (msg) => showSuccess(msg),
 *   onError: (msg) => showError(msg),
 *   onRefresh: () => loadWebsites(),
 * });
 * ```
 * 
 * @see {@link useWebsiteDialog} for UI state management
 * @see {@link WebsitesPage} for usage example
 */
export const useWebsiteHandlers = ({
  onSuccess,
  onError,
  onRefresh,
}: UseWebsiteHandlersParams) => {
  const { t } = useTranslation();

  /**
   * Create a new app setting
   */
  const createWebsite = useCallback(async (formData: WebsiteFormData) => {
    const createRequest: CreateWebsiteRequest = {
      name: formData.name.trim(),
      url: formData.url.trim(),
      logoUrl: formData.logoUrl.trim(),
      description: formData.description.trim(),
      tags: formData.tags.trim(),
      lang: formData.lang.trim(),
      displayOrder: formData.displayOrder,
      isActive: formData.isActive,
    };
    
    const response = await websiteService.createWebsite(createRequest);
    
    if (response.status.code === 200 || response.status.code === 201) {
      return t('websites.messages.createSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Update an existing app setting
   */
  const updateWebsite = useCallback(async (id: string, formData: WebsiteFormData) => {
    const updateRequest: UpdateWebsiteRequest = {
      name: formData.name.trim(),
      url: formData.url.trim(),
      logoUrl: formData.logoUrl.trim(),
      description: formData.description.trim(),
      tags: formData.tags.trim(),
      lang: formData.lang.trim(),
      displayOrder: formData.displayOrder,
      isActive: formData.isActive,
    };
    
    const response = await websiteService.updateWebsite(id, updateRequest);
    
    if (response.status.code === 200) {
      return t('websites.messages.updateSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Delete an app setting
   */
  const deleteWebsite = useCallback(async (id: string) => {
    const response = await websiteService.deleteWebsite(id);
    
    if (response.status.code === 200 || response.status.code === 204) {
      return t('websites.messages.deleteSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Validate form data
   */
  const validateForm = useCallback((formData: WebsiteFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = t('websites.errors.nameRequired');
    } else if (formData.name.length < WEBSITE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH) {
      errors.name = t('websites.validation.nameMinLength');
    } else if (formData.name.length > WEBSITE_CONSTANTS.VALIDATION.NAME_MAX_LENGTH) {
      errors.name = t('websites.validation.nameMaxLength');
    }

    // URL validation
    if (!formData.url.trim()) {
      errors.url = t('websites.errors.urlRequired');
    } else if (formData.url.length > WEBSITE_CONSTANTS.VALIDATION.URL_MAX_LENGTH) {
      errors.url = t('websites.validation.urlMaxLength');
    }

    // Language validation
    if (!formData.lang.trim()) {
      errors.lang = t('websites.errors.langRequired');
    }

    return errors;
  }, [t]);

  /**
   * Handle save operation (create or update)
   */
  const handleSave = useCallback(async (
    actionType: WebsiteActionType,
    formData: WebsiteFormData,
    selectedWebsite: Website | null,
    setFormErrors: (errors: Record<string, string[] | string>) => void
  ) => {
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return false;
    }

    try {
      let successMessage: string;
      
      if (actionType === 'create') {
        successMessage = await createWebsite(formData);
      } else if (actionType === 'edit' && selectedWebsite) {
        successMessage = await updateWebsite(selectedWebsite.id, formData);
      } else {
        return false;
      }
      
      onSuccess(successMessage);
      onRefresh();
      return true;
    } catch (err: any) {
      console.error('Save app setting error:', err);
      
      // Handle validation errors from API
      const apiValidationErrors = extractValidationErrors(err);
      if (Object.keys(apiValidationErrors).length > 0) {
        setFormErrors(apiValidationErrors);
      } else {
        const errorMessage = handleApiError(err);
        onError(errorMessage);
      }
      return false;
    }
  }, [t, validateForm, createWebsite, updateWebsite, onSuccess, onError, onRefresh]);

  /**
   * Handle delete operation
   */
  const handleDelete = useCallback(async (selectedWebsite: Website | null) => {
    if (!selectedWebsite) return false;

    try {
      const successMessage = await deleteWebsite(selectedWebsite.id);
      onSuccess(successMessage);
      onRefresh();
      return true;
    } catch (err: any) {
      console.error('Delete website error:', err);
      const errorMessage = handleApiError(err);
      onError(errorMessage);
      return false;
    }
  }, [deleteWebsite, onSuccess, onError, onRefresh, t]);

  return {
    handleSave,
    handleDelete,
    validateForm,
  };
};
