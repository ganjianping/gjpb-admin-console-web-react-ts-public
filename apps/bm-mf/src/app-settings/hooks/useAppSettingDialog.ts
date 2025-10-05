import { useState, useCallback } from 'react';

import '../i18n/translations';
import type { AppSetting, AppSettingFormData, AppSettingActionType } from '../types/app-setting.types';

/**
 * Hook to manage app setting dialog state and UI interactions
 * Business logic is handled by useAppSettingHandlers
 */
export const useAppSettingDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppSetting, setSelectedAppSetting] = useState<AppSetting | null>(null);
  const [actionType, setActionType] = useState<AppSettingActionType>('view');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<AppSettingFormData>({
    name: '',
    value: '',
    lang: '',
    isSystem: false,
    isPublic: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AppSettingFormData, string>>>({});

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      value: '',
      lang: '',
      isSystem: false,
      isPublic: true,
    });
    setFormErrors({});
  }, []);

  const handleView = useCallback((appSetting: AppSetting) => {
    setSelectedAppSetting(appSetting);
    setFormData({
      name: appSetting.name,
      value: appSetting.value,
      lang: appSetting.lang,
      isSystem: appSetting.isSystem,
      isPublic: appSetting.isPublic,
    });
    setActionType('view');
    setDialogOpen(true);
    setFormErrors({});
  }, []);

  const handleEdit = useCallback((appSetting: AppSetting) => {
    setSelectedAppSetting(appSetting);
    setFormData({
      name: appSetting.name,
      value: appSetting.value,
      lang: appSetting.lang,
      isSystem: appSetting.isSystem,
      isPublic: appSetting.isPublic,
    });
    setActionType('edit');
    setDialogOpen(true);
    setFormErrors({});
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedAppSetting(null);
    resetForm();
    setActionType('create');
    setDialogOpen(true);
  }, [resetForm]);

  const handleDelete = useCallback((appSetting: AppSetting) => {
    setSelectedAppSetting(appSetting);
    setActionType('delete');
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    setDialogOpen(false);
    setSelectedAppSetting(null);
    resetForm();
    setActionType('view');
  }, [loading, resetForm]);

  const handleFormChange = useCallback((field: keyof AppSettingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  return {
    dialogOpen,
    selectedAppSetting,
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
