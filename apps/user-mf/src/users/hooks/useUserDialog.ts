import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../services/userService';
import type { UserFormData, UserActionType } from '../types/user.types';
import { useUserHandlers } from './useUserHandlers';

/**
 * Custom hook for user dialog UI state management
 * 
 * This hook manages all UI-related state for user dialogs (view, edit, create, delete).
 * Business logic has been extracted to useUserHandlers for better separation of concerns.
 * 
 * @returns {Object} Object containing dialog state and handlers
 * 
 * @example
 * ```tsx
 * const {
 *   dialogOpen,
 *   selectedUser,
 *   actionType,
 *   loading,
 *   formData,
 *   formErrors,
 *   handleView,
 *   handleEdit,
 *   handleCreate,
 *   handleDelete,
 *   handleCloseDialog,
 *   handleFormChange,
 *   handleSave,
 *   handleConfirmDelete,
 * } = useUserDialog();
 * ```
 */
export const useUserDialog = (onOperationSuccess?: () => void) => {
  const { t } = useTranslation();
  const { handleCreateUser, handleUpdateUser, handleDeleteUser } = useUserHandlers();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<UserActionType>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[] | string>>({});
  
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    nickname: '',
    email: '',
    mobileCountryCode: '',
    mobileNumber: '',
    accountStatus: 'active',
    roleCodes: [],
    active: true,
  });

  const handleView = (user: User) => {
    setSelectedUser(user);
    setFormErrors({}); // Clear any previous errors
    setFormData({
      username: user.username,
      password: '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      mobileCountryCode: user.mobileCountryCode ?? '',
      mobileNumber: user.mobileNumber ?? '',
      accountStatus: user.accountStatus,
      roleCodes: user.roles.map(role => role.code),
      active: user.active,
    });
    setActionType('view');
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormErrors({}); // Clear any previous errors
    setFormData({
      username: user.username,
      password: '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      mobileCountryCode: user.mobileCountryCode ?? '',
      mobileNumber: user.mobileNumber ?? '',
      accountStatus: user.accountStatus,
      roleCodes: user.roles.map(role => role.code),
      active: user.active,
    });
    setActionType('edit');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormErrors({}); // Clear any previous errors
    setFormData({
      username: '',
      password: '',
      nickname: '',
      email: '',
      mobileCountryCode: '',
      mobileNumber: '',
      accountStatus: 'active',
      roleCodes: [],
      active: true,
    });
    setActionType('create');
    setDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setActionType('delete');
    // Don't set dialogOpen(true) for delete - DeleteUserDialog has its own condition
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setActionType(null);
    setFormErrors({});
    setFormData({
      username: '',
      password: '',
      nickname: '',
      email: '',
      mobileCountryCode: '',
      mobileNumber: '',
      accountStatus: 'active',
      roleCodes: [],
      active: true,
    });
  };

  /**
   * Handles form changes and clears field-specific errors
   */
  const handleFormChange = useCallback((field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field-specific error when user updates the value
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formErrors]);

  /**
   * Handles save operation (create or update)
   * Delegates business logic to useUserHandlers
   */
  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      setFormErrors({});

      if (actionType === 'create') {
        const result = await handleCreateUser(formData);
        if (result.success) {
          handleCloseDialog();
          onOperationSuccess?.();
        } else if (result.errors) {
          setFormErrors(result.errors);
        }
      } else if (actionType === 'edit' && selectedUser) {
        const result = await handleUpdateUser(selectedUser, formData);
        if (result.success) {
          handleCloseDialog();
          onOperationSuccess?.();
        } else if (result.errors) {
          setFormErrors(result.errors);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [actionType, formData, selectedUser, handleCreateUser, handleUpdateUser]);

  /**
   * Handles delete confirmation
   * Delegates business logic to useUserHandlers
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const result = await handleDeleteUser(selectedUser);
      if (result.success) {
        handleCloseDialog();
        onOperationSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  }, [selectedUser, handleDeleteUser]);

  /**
   * Gets the first error message for a field
   */
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const errors = formErrors[fieldName];
    if (!errors) return undefined;
    if (Array.isArray(errors)) {
      return errors.length > 0 ? errors[0] : undefined;
    }
    return typeof errors === 'string' ? errors : undefined;
  }, [formErrors]);

  /**
   * Checks if a field has any errors
   */
  const hasFieldError = useCallback((fieldName: string): boolean => {
    const errors = formErrors[fieldName];
    if (!errors) return false;
    if (Array.isArray(errors)) {
      return errors.length > 0;
    }
    return typeof errors === 'string' && errors.trim().length > 0;
  }, [formErrors]);

  /**
   * Gets the dialog title based on action type
   */
  const getDialogTitle = useCallback(() => {
    if (actionType === 'view') return t('users.actions.viewUser') || 'View User';
    if (actionType === 'edit') return t('users.actions.editUser') || 'Edit User';
    if (actionType === 'create') return t('users.actions.createUser') || 'Create User';
    return t('users.actions.deleteUser') || 'Delete User';
  }, [actionType, t]);

  return {
    dialogOpen,
    selectedUser,
    actionType,
    loading,
    formData,
    formErrors,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleCloseDialog,
    handleFormChange,
    handleSave,
    handleConfirmDelete,
    getFieldError,
    hasFieldError,
    getDialogTitle,
  };
};
