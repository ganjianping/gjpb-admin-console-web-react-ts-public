import { useState, useCallback } from 'react';
import type { User } from '../services/userService';
import type { SearchFormData } from '../types/user.types';

/**
 * Custom hook for user search functionality
 * 
 * This hook manages the search panel state and provides client-side filtering
 * capabilities for the user list. It handles search form data and applies
 * filters based on various user attributes.
 * 
 * @param {User[]} allUsers - The complete list of users to search through
 * @returns {Object} Object containing search state and functions
 * @returns {boolean} searchPanelOpen - Whether search panel is open
 * @returns {SearchFormData} searchFormData - Current search form values
 * @returns {Function} applyClientSideFiltersWithData - Apply filters to user list
 * @returns {Function} handleSearchPanelToggle - Toggle search panel visibility
 * @returns {Function} handleSearchFormChange - Update search form field
 * @returns {Function} handleClearSearch - Clear all search filters
 * 
 * @example
 * ```tsx
 * const {
 *   searchPanelOpen,
 *   searchFormData,
 *   handleSearchPanelToggle,
 *   handleSearchFormChange,
 *   applyClientSideFiltersWithData,
 *   handleClearSearch,
 * } = useUserSearch(allUsers);
 * 
 * // Toggle search panel
 * handleSearchPanelToggle();
 * 
 * // Update search field
 * handleSearchFormChange('username', 'john');
 * 
 * // Apply filters
 * const filtered = applyClientSideFiltersWithData(searchFormData);
 * ```
 */
export const useUserSearch = (allUsers: User[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({
    username: '',
    email: '',
    mobile: '',
    accountStatus: '',
    roleCode: '',
    active: '',
  });

  const applyClientSideFiltersWithData = useCallback((formData: SearchFormData) => {
    let filtered = [...allUsers];

    // Filter by username (case-insensitive)
    if (formData.username) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(formData.username.toLowerCase())
      );
    }

    // Filter by email (case-insensitive)
    if (formData.email) {
      filtered = filtered.filter(user => 
        user.email?.toLowerCase().includes(formData.email.toLowerCase())
      );
    }

    // Filter by mobile number (case-insensitive)
    if (formData.mobile) {
      filtered = filtered.filter(user => 
        user.mobileNumber?.toLowerCase().includes(formData.mobile.toLowerCase())
      );
    }

    // Filter by account status
    if (formData.accountStatus) {
      filtered = filtered.filter(user => 
        user.accountStatus === formData.accountStatus
      );
    }

    // Filter by role code
    if (formData.roleCode) {
      filtered = filtered.filter(user => 
        user.roles.some(role => role.code === formData.roleCode)
      );
    }

    // Filter by active status
    if (formData.active !== '') {
      const isActive = formData.active === 'true';
      filtered = filtered.filter(user => user.active === isActive);
    }

    return filtered;
  }, [allUsers]);

  const handleSearchPanelToggle = () => {
    setSearchPanelOpen(!searchPanelOpen);
  };

  const handleSearchFormChange = (field: keyof SearchFormData, value: any) => {
    setSearchFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearSearch = () => {
    setSearchFormData({
      username: '',
      email: '',
      mobile: '',
      accountStatus: '',
      roleCode: '',
      active: '',
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
