import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User, CreateUserRequest, UpdateUserRequest } from '../services/userService';
import { userService } from '../services/userService';
import type { UserFormData, UserActionType } from '../types/user.types';
import { processApiErrors } from '../utils/error-handler';

export const useUserDialog = () => {
  const { t } = useTranslation();
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

  const handleFormChange = (field: keyof UserFormData, value: any) => {
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
  };

  const handleSave = async (onSuccess: (message: string) => void, onError: (error: string) => void) => {
    try {
      setLoading(true);
      setFormErrors({});

      if (actionType === 'create') {
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
          onSuccess(t('users.userCreatedSuccess'));
          handleCloseDialog();
        } else {
          // Handle API error structure
          if (response.status.errors) {
            const processedErrors = processApiErrors(response.status.errors);
            setFormErrors(processedErrors);
            
            // Don't show generic toast when we have specific field errors
            // The field errors will be displayed in the form
            return;
          }
          
          // Only show toast if no field-specific errors were found
          const errorMessage = response.status.message || t('users.errors.createFailed');
          onError(errorMessage);
        }
      } else if (actionType === 'edit' && selectedUser) {
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

        if (formData.password && formData.password.trim() !== '') {
          updateData.password = formData.password;
        }

        const response = await userService.patchUser(selectedUser.id, updateData);
        if (response.status.code === 200) {
          onSuccess(t('users.userUpdatedSuccess'));
          handleCloseDialog();
        } else {
          // Handle API error structure
          if (response.status.errors) {
            const processedErrors = processApiErrors(response.status.errors);
            setFormErrors(processedErrors);
            
            // Don't show generic toast when we have specific field errors
            return;
          }
          
          // Only show toast if no field-specific errors were found
          const errorMessage = response.status.message || t('users.errors.updateFailed');
          onError(errorMessage);
        }
      }
    } catch (err) {
      // Check if it's an ApiError (from api-client interceptor)
      if (err && typeof err === 'object' && 'errors' in err) {
        const apiError = err as any;
        
        if (apiError.errors) {
          const processedErrors = processApiErrors(apiError.errors);
          setFormErrors(processedErrors);
          // Don't show generic toast when we have specific field errors
          return;
        }
        
        // Show toast for ApiError without field errors
        const errorMessage = apiError.message || 
          (actionType === 'create' ? t('users.errors.createFailed') : t('users.errors.updateFailed'));
        onError(errorMessage);
        return;
      }
      
      // Check if it's an axios error with response
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as any;
        
        if (apiError.response?.data?.status?.errors) {
          const processedErrors = processApiErrors(apiError.response.data.status.errors);
          setFormErrors(processedErrors);
          // Don't show generic toast when we have specific field errors
          return;
        }
        
        // Only show toast if no field-specific errors were found
        const defaultMessage = actionType === 'create' ? t('users.errors.createFailed') : t('users.errors.updateFailed');
        const errorMessage = apiError.response?.data?.status?.message || defaultMessage;
        onError(errorMessage);
      } else {
        const defaultMessage = actionType === 'create' ? t('users.errors.createFailed') : t('users.errors.updateFailed');
        const errorMessage = err instanceof Error ? err.message : defaultMessage;
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (onSuccess: (message: string) => void, onError: (error: string) => void) => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const response = await userService.deleteUser(selectedUser.id);
      
      if (response.status.code === 200) {
        onSuccess(t('users.userDeletedSuccess'));
        handleCloseDialog();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('users.errors.deleteFailed');
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const errors = formErrors[fieldName];
    if (!errors) return undefined;
    if (Array.isArray(errors)) {
      return errors.length > 0 ? errors[0] : undefined;
    }
    return typeof errors === 'string' ? errors : undefined;
  };

  const hasFieldError = (fieldName: string): boolean => {
    const errors = formErrors[fieldName];
    if (!errors) return false;
    if (Array.isArray(errors)) {
      return errors.length > 0;
    }
    return typeof errors === 'string' && errors.trim().length > 0;
  };

  const getDialogTitle = () => {
    if (actionType === 'view') return t('users.actions.viewUser') || 'View User';
    if (actionType === 'edit') return t('users.actions.editUser') || 'Edit User';
    if (actionType === 'create') return t('users.actions.createUser') || 'Create User';
    return t('users.actions.deleteUser') || 'Delete User';
  };

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
