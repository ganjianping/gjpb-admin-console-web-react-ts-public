import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../../../shared-lib/src/data-management';
import { userService } from '../services/userService';
import type { User, CreateUserRequest, UpdateUserRequest } from '../services/userService';
import type { UserFormData } from '../types/user.types';
import { processApiErrors } from '../utils/error-handler';

/**
 * Custom hook for user business logic and CRUD operations
 * 
 * This hook encapsulates all business logic for user management operations,
 * including create, update, and delete operations with proper error handling
 * and user feedback via notifications.
 * 
 * @returns {Object} Object containing handler functions and state
 * @returns {Function} handleCreateUser - Creates a new user
 * @returns {Function} handleUpdateUser - Updates an existing user
 * @returns {Function} handleDeleteUser - Deletes a user
 * 
 * @example
 * ```tsx
 * const { handleCreateUser, handleUpdateUser, handleDeleteUser } = useUserHandlers();
 * 
 * // Create a new user
 * const result = await handleCreateUser(formData);
 * if (result.success) {
 *   console.log('User created successfully');
 * }
 * ```
 */
export const useUserHandlers = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();

  /**
   * Creates a new user with the provided form data
   * 
   * @param {UserFormData} formData - The user form data
   * @returns {Promise<{success: boolean, errors?: Record<string, string[] | string>}>}
   *          Promise resolving to operation result with success status and optional field errors
   */
  const handleCreateUser = useCallback(
    async (formData: UserFormData): Promise<{
      success: boolean;
      errors?: Record<string, string[] | string>;
    }> => {
      try {
        const createData: CreateUserRequest = {
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname || undefined,
          email: formData.email || undefined,
          mobileCountryCode: formData.mobileCountryCode || undefined,
          mobileNumber: formData.mobileNumber || undefined,
          accountStatus: formData.accountStatus,
          roleCodes: formData.roleCodes,
          active: formData.active,
        };

        const response = await userService.createUser(createData);
        
        if (response.status.code === 200) {
          showSuccess(t('users.userCreatedSuccess'));
          return { success: true };
        } else {
          // Handle API error structure
          if (response.status.errors) {
            const processedErrors = processApiErrors(response.status.errors);
            // Don't show generic toast when we have specific field errors
            return { success: false, errors: processedErrors };
          }
          
          // Show error toast if no field-specific errors
          const errorMessage = response.status.message || t('users.errors.createFailed');
          showError(errorMessage);
          return { success: false };
        }
      } catch (err) {
        // Check if it's an ApiError (from api-client interceptor)
        if (err && typeof err === 'object' && 'errors' in err) {
          const apiError = err as any;
          
          if (apiError.errors) {
            const processedErrors = processApiErrors(apiError.errors);
            // Don't show generic toast when we have specific field errors
            return { success: false, errors: processedErrors };
          }
          
          // Show toast for ApiError without field errors
          const errorMessage = apiError.message || t('users.errors.createFailed');
          showError(errorMessage);
          return { success: false };
        }
        
        // Check if it's an axios error with response
        if (err && typeof err === 'object' && 'response' in err) {
          const apiError = err as any;
          
          if (apiError.response?.data?.status?.errors) {
            const processedErrors = processApiErrors(apiError.response.data.status.errors);
            // Don't show generic toast when we have specific field errors
            return { success: false, errors: processedErrors };
          }
          
          // Show error toast if no field-specific errors
          const errorMessage = apiError.response?.data?.status?.message || t('users.errors.createFailed');
          showError(errorMessage);
          return { success: false };
        }
        
        // Generic error handling
        const errorMessage = err instanceof Error ? err.message : t('users.errors.createFailed');
        showError(errorMessage);
        return { success: false };
      }
    },
    [t, showSuccess, showError]
  );

  /**
   * Updates an existing user with the provided form data
   * 
   * @param {User} user - The user to update
   * @param {UserFormData} formData - The updated form data
   * @returns {Promise<{success: boolean, errors?: Record<string, string[] | string>}>}
   *          Promise resolving to operation result with success status and optional field errors
   */
  const handleUpdateUser = useCallback(
    async (
      user: User,
      formData: UserFormData
    ): Promise<{
      success: boolean;
      errors?: Record<string, string[] | string>;
    }> => {
      try {
        const updateData: UpdateUserRequest = {
          username: formData.username,
          nickname: formData.nickname || undefined,
          email: formData.email || undefined,
          mobileCountryCode: formData.mobileCountryCode || undefined,
          mobileNumber: formData.mobileNumber || undefined,
          accountStatus: formData.accountStatus,
          roleCodes: formData.roleCodes,
          active: formData.active,
        };

        // Only include password if it was provided
        if (formData.password && formData.password.trim() !== '') {
          updateData.password = formData.password;
        }

        const response = await userService.patchUser(user.id, updateData);
        
        if (response.status.code === 200) {
          showSuccess(t('users.userUpdatedSuccess'));
          return { success: true };
        } else {
          // Handle API error structure
          if (response.status.errors) {
            const processedErrors = processApiErrors(response.status.errors);
            // Don't show generic toast when we have specific field errors
            return { success: false, errors: processedErrors };
          }
          
          // Show error toast if no field-specific errors
          const errorMessage = response.status.message || t('users.errors.updateFailed');
          showError(errorMessage);
          return { success: false };
        }
      } catch (err) {
        // Check if it's an ApiError (from api-client interceptor)
        if (err && typeof err === 'object' && 'errors' in err) {
          const apiError = err as any;
          
          if (apiError.errors) {
            const processedErrors = processApiErrors(apiError.errors);
            // Don't show generic toast when we have specific field errors
            return { success: false, errors: processedErrors };
          }
          
          // Show toast for ApiError without field errors
          const errorMessage = apiError.message || t('users.errors.updateFailed');
          showError(errorMessage);
          return { success: false };
        }
        
        // Check if it's an axios error with response
        if (err && typeof err === 'object' && 'response' in err) {
          const apiError = err as any;
          
          if (apiError.response?.data?.status?.errors) {
            const processedErrors = processApiErrors(apiError.response.data.status.errors);
            // Don't show generic toast when we have specific field errors
            return { success: false, errors: processedErrors };
          }
          
          // Show error toast if no field-specific errors
          const errorMessage = apiError.response?.data?.status?.message || t('users.errors.updateFailed');
          showError(errorMessage);
          return { success: false };
        }
        
        // Generic error handling
        const errorMessage = err instanceof Error ? err.message : t('users.errors.updateFailed');
        showError(errorMessage);
        return { success: false };
      }
    },
    [t, showSuccess, showError]
  );

  /**
   * Deletes a user
   * 
   * @param {User} user - The user to delete
   * @returns {Promise<{success: boolean}>} Promise resolving to operation result
   */
  const handleDeleteUser = useCallback(
    async (user: User): Promise<{ success: boolean }> => {
      try {
        const response = await userService.deleteUser(user.id);
        
        if (response.status.code === 200) {
          showSuccess(t('users.userDeletedSuccess'));
          return { success: true };
        } else {
          const errorMessage = response.status.message || t('users.errors.deleteFailed');
          showError(errorMessage);
          return { success: false };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('users.errors.deleteFailed');
        showError(errorMessage);
        return { success: false };
      }
    },
    [t, showSuccess, showError]
  );

  return {
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};
