import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { roleService } from '../services';
import type { Role } from '../types/role.types';
import type { RoleActionType, RoleFormData, RoleFormErrors } from '../types/role-dialog.types';

interface UseRoleHandlersProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: (page?: number) => Promise<void>;
  setPriorityParent: (parentId: string) => void;
  clearPriorityParent: () => void;
}

export const useRoleHandlers = ({
  onSuccess,
  onError,
  onRefresh,
  setPriorityParent,
  clearPriorityParent,
}: UseRoleHandlersProps) => {
  const { t } = useTranslation();
  const [formErrors, setFormErrors] = useState<RoleFormErrors>({});
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string>('');

  // Helper function to process API errors
  const processApiErrors = (apiErrors: any): Record<string, string | string[]> => {
    console.log('Processing Role API errors - raw input:', JSON.stringify(apiErrors, null, 2));
    const formattedErrors: Record<string, string | string[]> = {};
    
    if (apiErrors && typeof apiErrors === 'object') {
      Object.keys(apiErrors).forEach(key => {
        const value = apiErrors[key];
        console.log(`Processing role error for key "${key}":`, value);
        
        // Map field-specific errors directly for all role fields
        if (['code', 'name', 'description', 'level', 'sortOrder', 'parentRoleId'].includes(key)) {
          formattedErrors[key] = Array.isArray(value) ? value : String(value);
          console.log(`✅ Mapped role field error: ${key} -> ${formattedErrors[key]}`);
        } else {
          // For non-field-specific errors, add as general error
          formattedErrors.general = Array.isArray(value) ? value : String(value);
          console.log(`⚠️ Mapped role general error: ${key} -> ${formattedErrors.general}`);
        }
      });
    }
    
    console.log('Final formatted role errors:', formattedErrors);
    return formattedErrors;
  };

  // Helper functions for error handling
  const getErrorMessage = (field: string) => {
    const error = formErrors[field];
    if (Array.isArray(error)) {
      return error.join(', ');
    } else if (error) {
      return String(error);
    }
    return '';
  };

  const hasError = (field: string) => {
    return Boolean(formErrors[field]);
  };

  // Get general errors that don't map to specific fields
  const getGeneralErrors = () => {
    const generalErrors = [];
    
    if (formErrors.general) {
      generalErrors.push(formErrors.general);
    }
    
    const fieldNames = ['code', 'name', 'description', 'level', 'sortOrder', 'parentRoleId', 'general'];
    Object.keys(formErrors).forEach(key => {
      if (!fieldNames.includes(key)) {
        generalErrors.push(formErrors[key]);
      }
    });
    
    return generalErrors;
  };

  const clearErrors = () => {
    setFormErrors({});
    setDialogErrorMessage('');
  };

  const clearFieldError = (field: string) => {
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Handle save (create/update)
  const handleSave = async (
    actionType: RoleActionType,
    formData: RoleFormData,
    selectedRole: Role | null
  ): Promise<boolean> => {
    try {
      clearErrors();
      
      if (actionType === 'create') {
        const createData = {
          code: formData.code || '',
          name: formData.name || '',
          description: formData.description || '',
          sortOrder: formData.sortOrder || 0,
          level: formData.level || 0,
          parentRoleId: formData.parentRoleId || undefined,
          active: formData.status === 'active',
        };
        
        console.log('🚀 Creating role:', createData);
        const response = await roleService.createRole(createData);
        console.log('🚀 API Response received:', response);
        
        if (response.status.code === 200 || response.status.code === 201) {
          console.log('✅ Create success');
          
          if (formData.parentRoleId) {
            console.log('🔼 Setting priority parent:', formData.parentRoleId);
            setPriorityParent(formData.parentRoleId);
          }
          
          onSuccess(t('roles.messages.createSuccess') || 'Role created successfully');
          
          // Refresh the list
          setTimeout(async () => {
            try {
              await onRefresh(0);
              if (formData.parentRoleId) {
                setTimeout(() => {
                  console.log('🔽 Clearing priority parent after refresh');
                  clearPriorityParent();
                }, 1000);
              }
            } catch (error) {
              console.error('Error refreshing roles after create:', error);
            }
          }, 500);
          
          return true;
        } else {
          handleApiError(response);
          return false;
        }
        
      } else if (actionType === 'edit' && selectedRole) {
        const updateData = {
          code: formData.code || '',
          name: formData.name || '',
          description: formData.description || '',
          sortOrder: formData.sortOrder || 0,
          level: formData.level || 0,
          parentRoleId: formData.parentRoleId || undefined,
          active: formData.status === 'active',
        };
        
        console.log('Updating role:', selectedRole.id, updateData);
        const response = await roleService.updateRole(selectedRole.id, updateData);
        
        if (response.status.code === 200) {
          if (formData.parentRoleId) {
            console.log('🔼 Setting priority parent for update:', formData.parentRoleId);
            setPriorityParent(formData.parentRoleId);
          }
          
          onSuccess(t('roles.messages.updateSuccess') || 'Role updated successfully');
          
          try {
            await onRefresh(0);
            if (formData.parentRoleId) {
              setTimeout(() => {
                console.log('🔽 Clearing priority parent after update refresh');
                clearPriorityParent();
              }, 1000);
            }
          } catch (error) {
            console.error('Error refreshing roles after update:', error);
          }
          
          return true;
        } else {
          handleApiError(response);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('🚨 Caught error in handleSave:', error);
      handleCatchError(error);
      return false;
    }
  };

  // Handle delete
  const handleDelete = async (selectedRole: Role): Promise<boolean> => {
    try {
      console.log('Deleting role:', selectedRole.id);
      const response = await roleService.deleteRole(selectedRole.id);
      
      if (response.status.code === 200 || response.status.code === 204) {
        onSuccess(t('roles.messages.deleteSuccess') || 'Role deleted successfully');
        
        try {
          await onRefresh(0);
        } catch (error) {
          console.error('Error refreshing roles after delete:', error);
        }
        
        return true;
      } else {
        const errorMsg = response.status.message || 'Failed to delete role';
        console.error('Failed to delete role:', errorMsg);
        onError(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError(errorMsg);
      return false;
    }
  };

  // Handle API error response
  const handleApiError = (response: any) => {
    console.log('🚨 API Error Response - Full Response:', JSON.stringify(response, null, 2));
    let errorMsg = response.status.message || 'Failed to save role';
    console.log('🚨 Error message:', errorMsg);
    
    if (response.status.errors && typeof response.status.errors === 'object') {
      console.log('🚨 API errors received:', response.status.errors);
      const processedErrors = processApiErrors(response.status.errors);
      console.log('🚨 Processed errors result:', processedErrors);
      
      if (Object.keys(processedErrors).length > 0) {
        console.log('🚨 Setting form errors:', processedErrors);
        setFormErrors(processedErrors);
        setDialogErrorMessage(t('roles.messages.validationError') || 'Please correct the errors below');
      } else {
        console.log('🚨 No processed errors, showing general error');
        onError(errorMsg);
      }
    } else {
      console.log('🚨 No status.errors found, showing general error');
      console.error('Failed to save role:', errorMsg);
      onError(errorMsg);
    }
  };

  // Handle caught errors
  const handleCatchError = (error: any) => {
    console.log('🚨 Error type:', typeof error);
    console.log('🚨 Error instanceof Error:', error instanceof Error);
    
    // Check if this is an ApiError with validation errors
    if (error && typeof error === 'object' && 'errors' in error && 'code' in error) {
      const apiError = error as any;
      console.log('🚨 Found ApiError with validation errors:', apiError.errors);
      
      if (apiError.errors && typeof apiError.errors === 'object') {
        console.log('🚨 Processing ApiError validation errors:', apiError.errors);
        const processedErrors = processApiErrors(apiError.errors);
        console.log('🚨 Processed ApiError errors:', processedErrors);
        
        if (Object.keys(processedErrors).length > 0) {
          setFormErrors(processedErrors);
          setDialogErrorMessage(t('roles.messages.validationError') || 'Please correct the errors below');
          return;
        }
      }
    }
    
    // Check if this is an Axios error with API validation response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.log('🚨 Axios error response:', axiosError.response);
      
      if (axiosError.response?.data?.status?.errors) {
        console.log('🚨 Found validation errors in axios error:', axiosError.response.data.status.errors);
        const processedErrors = processApiErrors(axiosError.response.data.status.errors);
        console.log('🚨 Processed axios errors:', processedErrors);
        
        if (Object.keys(processedErrors).length > 0) {
          setFormErrors(processedErrors);
          setDialogErrorMessage(t('roles.messages.validationError') || 'Please correct the errors below');
          return;
        }
      }
    }
    
    // Fallback to general error
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    onError(errorMsg);
  };

  return {
    formErrors,
    dialogErrorMessage,
    getErrorMessage,
    hasError,
    getGeneralErrors,
    clearErrors,
    clearFieldError,
    handleSave,
    handleDelete,
  };
};
