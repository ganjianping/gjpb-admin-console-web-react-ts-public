import { useState, useCallback } from 'react';
import type { AppSetting } from '../services/appSettingService';
import type { AppSettingSearchFormData } from '../types/app-setting.types';

export const useAppSettingSearch = (allAppSettings: AppSetting[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<AppSettingSearchFormData>({
    name: '',
    lang: '',
    isSystem: '',
    isPublic: '',
  });

  const applyClientSideFiltersWithData = useCallback((formData: AppSettingSearchFormData) => {
    let filtered = [...allAppSettings];

    // Filter by name (case-insensitive)
    if (formData.name) {
      filtered = filtered.filter(setting => 
        setting.name.toLowerCase().includes(formData.name.toLowerCase())
      );
    }

    // Filter by language (case-insensitive)
    if (formData.lang) {
      filtered = filtered.filter(setting => 
        setting.lang.toLowerCase().includes(formData.lang.toLowerCase())
      );
    }

    // Filter by isSystem status
    if (formData.isSystem !== '') {
      const isSystem = formData.isSystem === 'true';
      filtered = filtered.filter(setting => setting.isSystem === isSystem);
    }

    // Filter by isPublic status
    if (formData.isPublic !== '') {
      const isPublic = formData.isPublic === 'true';
      filtered = filtered.filter(setting => setting.isPublic === isPublic);
    }

    return filtered;
  }, [allAppSettings]);

  const handleSearchPanelToggle = () => {
    setSearchPanelOpen(!searchPanelOpen);
  };

  const handleSearchFormChange = (field: keyof AppSettingSearchFormData, value: any) => {
    setSearchFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearSearch = () => {
    setSearchFormData({
      name: '',
      lang: '',
      isSystem: '',
      isPublic: '',
    });
  };

  return {
    searchPanelOpen,
    searchFormData,
    applyClientSideFiltersWithData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
  };
};
