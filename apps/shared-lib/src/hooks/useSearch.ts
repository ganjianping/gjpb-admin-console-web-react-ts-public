import { useState, useCallback } from 'react';

export interface UseSearchProps<T, SearchFormData> {
  allItems: T[];
  filterFunction: (items: T[], formData: SearchFormData) => T[];
  initialFormData: SearchFormData;
}

/**
 * Generic search hook for consistent search/filter behavior across modules
 */
export const useSearch = <T, SearchFormData extends Record<string, any>>({
  allItems,
  filterFunction,
  initialFormData
}: UseSearchProps<T, SearchFormData>) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>(initialFormData);

  const applyClientSideFiltersWithData = useCallback((formData: SearchFormData) => {
    return filterFunction(allItems, formData);
  }, [allItems, filterFunction]);

  const handleSearchPanelToggle = () => {
    setSearchPanelOpen(!searchPanelOpen);
  };

  const handleSearchPanelClose = () => {
    setSearchPanelOpen(false);
  };

  const handleSearchFormChange = (field: keyof SearchFormData, value: any) => {
    setSearchFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearSearch = () => {
    setSearchFormData(initialFormData);
  };

  return {
    searchPanelOpen,
    searchFormData,
    applyClientSideFiltersWithData,
    handleSearchPanelToggle,
    handleSearchPanelClose,
    handleSearchFormChange,
    handleClearSearch,
  };
};
