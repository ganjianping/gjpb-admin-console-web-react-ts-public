import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type DialogActionType = 'create' | 'edit' | 'view' | 'delete';

export interface UseDialogProps<T, FormData> {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  initialFormData: FormData;
  service: {
    create?: (data: any) => Promise<any>;
    update?: (id: string, data: any) => Promise<any>;
    delete?: (id: string) => Promise<any>;
  };
  transformToFormData: (item: T) => FormData;
  transformFromFormData: (formData: FormData) => any;
  validateForm: (formData: FormData) => Record<string, string>;
  translationNamespace?: string;
}

/**
 * Generic dialog management hook for CRUD operations
 * Eliminates duplication between useUserDialog, useAppSettingDialog, etc.
 */
export const useDialog = <T extends { id: string }, FormData extends Record<string, any>>({
  onSuccess,
  onError,
  initialFormData,
  service,
  transformToFormData,
  transformFromFormData,
  validateForm,
  translationNamespace = 'common'
}: UseDialogProps<T, FormData>) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [actionType, setActionType] = useState<DialogActionType | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleView = (item: T) => {
    setSelectedItem(item);
    setFormErrors({});
    setFormData(transformToFormData(item));
    setActionType('view');
    setDialogOpen(true);
  };

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setFormErrors({});
    setFormData(transformToFormData(item));
    setActionType('edit');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormErrors({});
    setFormData(initialFormData);
    setActionType('create');
    setDialogOpen(true);
  };

  const handleDelete = (item: T) => {
    setSelectedItem(item);
    setActionType('delete');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setActionType(null);
    setFormErrors({});
    setFormData(initialFormData);
  };

  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific error when user starts typing
    if (formErrors[field as string]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSave = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (actionType === 'create') {
        await performCreate();
      } else if (actionType === 'edit') {
        await performEdit();
      }
    } catch (err: any) {
      handleSaveError(err);
    } finally {
      setLoading(false);
    }
  };

  const performCreate = async () => {
    if (!service.create) return;
    
    const createRequest = transformFromFormData(formData);
    const response = await service.create(createRequest);
    
    if (response.status.code === 200 || response.status.code === 201) {
      handleCloseDialog();
      onSuccess(t(`${translationNamespace}.messages.createSuccess`, { defaultValue: 'Item created successfully' }));
    } else {
      throw new Error(response.status.message);
    }
  };

  const performEdit = async () => {
    if (!service.update || !selectedItem) return;
    
    const updateRequest = transformFromFormData(formData);
    const response = await service.update(selectedItem.id, updateRequest);
    
    if (response.status.code === 200) {
      handleCloseDialog();
      onSuccess(t(`${translationNamespace}.messages.updateSuccess`, { defaultValue: 'Item updated successfully' }));
    } else {
      throw new Error(response.status.message);
    }
  };

  const handleSaveError = (err: any) => {
    console.error('Save item error:', err);
    
    // Handle validation errors from API
    if (err.response?.data?.status?.errors) {
      setFormErrors(err.response.data.status.errors);
    } else {
      const errorMessage = err.message || (actionType === 'create' 
        ? t(`${translationNamespace}.errors.createFailed`, { defaultValue: 'Failed to create item' })
        : t(`${translationNamespace}.errors.updateFailed`, { defaultValue: 'Failed to update item' }));
      onError(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem || !service.delete) return;

    setLoading(true);
    try {
      const response = await service.delete(selectedItem.id);
      
      if (response.status.code === 200) {
        setSelectedItem(null);
        setActionType(null);
        onSuccess(t(`${translationNamespace}.messages.deleteSuccess`, { defaultValue: 'Item deleted successfully' }));
      } else {
        throw new Error(response.status.message);
      }
    } catch (err: any) {
      console.error('Delete item error:', err);
      const errorMessage = err.message || t(`${translationNamespace}.errors.deleteFailed`, { defaultValue: 'Failed to delete item' });
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    dialogOpen,
    selectedItem,
    actionType,
    formData,
    formErrors,
    loading,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleCloseDialog,
    handleFormChange,
    handleSave,
    handleConfirmDelete,
  };
};
