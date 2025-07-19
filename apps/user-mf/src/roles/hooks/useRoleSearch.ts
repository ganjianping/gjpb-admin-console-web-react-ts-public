import { useState, useCallback } from 'react';
import type { Role, RoleSearchFormData } from '../types/role.types';

export const useRoleSearch = (allRoles: Role[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<RoleSearchFormData>({
    name: '',
    permissions: [],
    status: '',
  });

  const applyClientSideFiltersWithData = useCallback((formData: RoleSearchFormData) => {
    let filtered = [...allRoles];

    // Filter by role name (case-insensitive)
    if (formData.name) {
      filtered = filtered.filter(role => 
        role.name.toLowerCase().includes(formData.name.toLowerCase())
      );
    }

    // Filter by permissions (check if role has any of the selected permissions)
    if (formData.permissions.length > 0) {
      filtered = filtered.filter(role => 
        formData.permissions.some(permission => 
          role.permissions.includes(permission)
        )
      );
    }

    // Filter by status
    if (formData.status) {
      filtered = filtered.filter(role => 
        role.status === formData.status
      );
    }

    return filtered;
  }, [allRoles]);

  const handleSearchPanelToggle = () => {
    setSearchPanelOpen(!searchPanelOpen);
  };

  const handleSearchFormChange = (field: keyof RoleSearchFormData, value: any) => {
    setSearchFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearSearch = () => {
    setSearchFormData({
      name: '',
      permissions: [],
      status: '',
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
