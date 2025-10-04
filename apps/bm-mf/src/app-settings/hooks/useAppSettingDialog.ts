import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/i18n.config'; // Initialize app settings translations
import type { CreateAppSettingRequest, UpdateAppSettingRequest } from '../services/appSettingService';
import { appSettingService } from '../services/appSettingService';
import type { AppSetting, AppSettingFormData, AppSettingActionType } from '../types/app-setting.types';
import { APP_SETTING_CONSTANTS } from '../constants';
import { handleApiError, extractValidationErrors } from '../utils/error-handler';

export const useAppSettingDialog = () => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppSetting, setSelectedAppSetting] = useState<AppSetting | null>(null);
  const [actionType, setActionType] = useState<AppSettingActionType>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[] | string>>({});
  
  const [formData, setFormData] = useState<AppSettingFormData>({
    name: '',
    value: '',
    lang: APP_SETTING_CONSTANTS.DEFAULT_LANGUAGE,
    isSystem: false,
    isPublic: true,
  });

  const handleView = (appSetting: AppSetting) => {
    setSelectedAppSetting(appSetting);
    setFormErrors({}); // Clear any previous errors
    setFormData({
      name: appSetting.name,
      value: appSetting.value,
      lang: appSetting.lang,
      isSystem: appSetting.isSystem,
      isPublic: appSetting.isPublic,
    });
    setActionType('view');
    setDialogOpen(true);
  };

  const handleEdit = (appSetting: AppSetting) => {
    setSelectedAppSetting(appSetting);
    setFormErrors({}); // Clear any previous errors
    setFormData({
      name: appSetting.name,
      value: appSetting.value,
      lang: appSetting.lang,
      isSystem: appSetting.isSystem,
      isPublic: appSetting.isPublic,
    });
    setActionType('edit');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedAppSetting(null);
    setFormErrors({}); // Clear any previous errors
    setFormData({
      name: '',
      value: '',
      lang: APP_SETTING_CONSTANTS.DEFAULT_LANGUAGE,
      isSystem: false,
      isPublic: true,
    });
    setActionType('create');
    setDialogOpen(true);
  };

  const handleDelete = (appSetting: AppSetting) => {
    setSelectedAppSetting(appSetting);
    setActionType('delete');
    // Don't set dialogOpen(true) for delete - DeleteAppSettingDialog has its own condition
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAppSetting(null);
    setActionType(null);
    setFormErrors({});
    setFormData({
      name: '',
      value: '',
      lang: APP_SETTING_CONSTANTS.DEFAULT_LANGUAGE,
      isSystem: false,
      isPublic: true,
    });
  };

  const handleFormChange = (field: keyof AppSettingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = t('appSettings.errors.nameRequired');
    } else if (formData.name.length < APP_SETTING_CONSTANTS.NAME_MIN_LENGTH) {
      errors.name = t('appSettings.validation.nameMinLength');
    } else if (formData.name.length > APP_SETTING_CONSTANTS.NAME_MAX_LENGTH) {
      errors.name = t('appSettings.validation.nameMaxLength');
    }

    // Value validation
    if (!formData.value.trim()) {
      errors.value = t('appSettings.errors.valueRequired');
    } else if (formData.value.length > APP_SETTING_CONSTANTS.VALUE_MAX_LENGTH) {
      errors.value = t('appSettings.validation.valueMaxLength');
    }

    // Language validation
    if (!formData.lang.trim()) {
      errors.lang = t('appSettings.errors.langRequired');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createAppSetting = async () => {
    const createRequest: CreateAppSettingRequest = {
      name: formData.name.trim(),
      value: formData.value.trim(),
      lang: formData.lang.trim(),
      isSystem: formData.isSystem,
      isPublic: formData.isPublic,
    };
    
    const response = await appSettingService.createAppSetting(createRequest);
    
    if (response.status.code === 200 || response.status.code === 201) {
      handleCloseDialog();
      return t('appSettings.messages.createSuccess');
    } else {
      throw new Error(response.status.message);
    }
  };

  const updateAppSetting = async () => {
    if (!selectedAppSetting) return;
    
    const updateRequest: UpdateAppSettingRequest = {
      name: formData.name.trim(),
      value: formData.value.trim(),
      lang: formData.lang.trim(),
      isSystem: formData.isSystem,
      isPublic: formData.isPublic,
    };
    
    const response = await appSettingService.updateAppSetting(selectedAppSetting.id, updateRequest);
    
    if (response.status.code === 200) {
      handleCloseDialog();
      return t('appSettings.messages.updateSuccess');
    } else {
      throw new Error(response.status.message);
    }
  };

  const handleSave = async (
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const successMessage = actionType === 'create' 
        ? await createAppSetting()
        : await updateAppSetting();
        
      if (successMessage) {
        onSuccess(successMessage);
      }
    } catch (err: any) {
      console.error('Save app setting error:', err);
      
      // Handle validation errors from API
      const validationErrors = extractValidationErrors(err);
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
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
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => {
    if (!selectedAppSetting) return;

    try {
      setLoading(true);
      
      const response = await appSettingService.deleteAppSetting(selectedAppSetting.id);
      
      if (response.status.code === 200 || response.status.code === 204) {
        setActionType(null);
        setSelectedAppSetting(null);
        onSuccess(t('appSettings.messages.deleteSuccess'));
      } else {
        throw new Error(response.status.message);
      }
    } catch (err: any) {
      console.error('Delete app setting error:', err);
      const errorMessage = handleApiError(err, t, 'appSettings.errors.deleteFailed');
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    dialogOpen,
    selectedAppSetting,
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
  };
};
