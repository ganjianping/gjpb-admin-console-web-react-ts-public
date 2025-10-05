import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { AppSetting, AppSettingActionType, AppSettingFormData } from '../types/app-setting.types';
import type { CreateAppSettingRequest, UpdateAppSettingRequest } from '../services/appSettingService';
import { appSettingService } from '../services/appSettingService';
import { APP_SETTING_CONSTANTS } from '../constants';
import { handleApiError, extractValidationErrors } from '../utils/error-handler';

/**
 * Parameters for useAppSettingHandlers hook
 * @interface UseAppSettingHandlersParams
 */
interface UseAppSettingHandlersParams {
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
 * for creating, updating, and deleting app settings. It handles validation, API calls,
 * error handling, and success/error notifications.
 * 
 * @param {UseAppSettingHandlersParams} params - Configuration callbacks
 * @returns {Object} Handler methods for app setting operations
 * 
 * @example
 * ```tsx
 * const { handleSave, handleDelete } = useAppSettingHandlers({
 *   onSuccess: (msg) => showSuccess(msg),
 *   onError: (msg) => showError(msg),
 *   onRefresh: () => loadAppSettings(),
 * });
 * ```
 * 
 * @see {@link useAppSettingDialog} for UI state management
 * @see {@link AppSettingsPage} for usage example
 */
export const useAppSettingHandlers = ({
  onSuccess,
  onError,
  onRefresh,
}: UseAppSettingHandlersParams) => {
  const { t } = useTranslation();

  /**
   * Create a new app setting
   */
  const createAppSetting = useCallback(async (formData: AppSettingFormData) => {
    const createRequest: CreateAppSettingRequest = {
      name: formData.name.trim(),
      value: formData.value.trim(),
      lang: formData.lang.trim(),
      isSystem: formData.isSystem,
      isPublic: formData.isPublic,
    };
    
    const response = await appSettingService.createAppSetting(createRequest);
    
    if (response.status.code === 200 || response.status.code === 201) {
      return t('appSettings.messages.createSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Update an existing app setting
   */
  const updateAppSetting = useCallback(async (id: string, formData: AppSettingFormData) => {
    const updateRequest: UpdateAppSettingRequest = {
      name: formData.name.trim(),
      value: formData.value.trim(),
      lang: formData.lang.trim(),
      isSystem: formData.isSystem,
      isPublic: formData.isPublic,
    };
    
    const response = await appSettingService.updateAppSetting(id, updateRequest);
    
    if (response.status.code === 200) {
      return t('appSettings.messages.updateSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Delete an app setting
   */
  const deleteAppSetting = useCallback(async (id: string) => {
    const response = await appSettingService.deleteAppSetting(id);
    
    if (response.status.code === 200 || response.status.code === 204) {
      return t('appSettings.messages.deleteSuccess');
    } else {
      throw new Error(response.status.message);
    }
  }, [t]);

  /**
   * Validate form data
   */
  const validateForm = useCallback((formData: AppSettingFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = t('appSettings.errors.nameRequired');
    } else if (formData.name.length < APP_SETTING_CONSTANTS.VALIDATION.NAME_MIN_LENGTH) {
      errors.name = t('appSettings.validation.nameMinLength');
    } else if (formData.name.length > APP_SETTING_CONSTANTS.VALIDATION.NAME_MAX_LENGTH) {
      errors.name = t('appSettings.validation.nameMaxLength');
    }

    // Value validation
    if (!formData.value.trim()) {
      errors.value = t('appSettings.errors.valueRequired');
    } else if (formData.value.length > APP_SETTING_CONSTANTS.VALIDATION.VALUE_MAX_LENGTH) {
      errors.value = t('appSettings.validation.valueMaxLength');
    }

    // Language validation
    if (!formData.lang.trim()) {
      errors.lang = t('appSettings.errors.langRequired');
    }

    return errors;
  }, [t]);

  /**
   * Handle save operation (create or update)
   */
  const handleSave = useCallback(async (
    actionType: AppSettingActionType,
    formData: AppSettingFormData,
    selectedAppSetting: AppSetting | null,
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
        successMessage = await createAppSetting(formData);
      } else if (actionType === 'edit' && selectedAppSetting) {
        successMessage = await updateAppSetting(selectedAppSetting.id, formData);
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
        const errorMessage = handleApiError(
          err,
          t,
          actionType === 'create' 
            ? 'appSettings.errors.createFailed' 
            : 'appSettings.errors.updateFailed'
        );
        onError(errorMessage);
      }
      return false;
    }
  }, [t, validateForm, createAppSetting, updateAppSetting, onSuccess, onError, onRefresh]);

  /**
   * Handle delete operation
   */
  const handleDelete = useCallback(async (selectedAppSetting: AppSetting | null) => {
    if (!selectedAppSetting) return false;

    try {
      const successMessage = await deleteAppSetting(selectedAppSetting.id);
      onSuccess(successMessage);
      onRefresh();
      return true;
    } catch (err: any) {
      console.error('Delete app setting error:', err);
      const errorMessage = handleApiError(err, t, 'appSettings.errors.deleteFailed');
      onError(errorMessage);
      return false;
    }
  }, [deleteAppSetting, onSuccess, onError, onRefresh, t]);

  return {
    handleSave,
    handleDelete,
    validateForm,
  };
};
