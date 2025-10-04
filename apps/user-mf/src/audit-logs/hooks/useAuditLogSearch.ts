import { useState } from 'react';
import type { AuditLogSearchFormData } from '../types';

export const useAuditLogSearch = () => {
  const [searchPanelExpanded, setSearchPanelExpanded] = useState(false);
  const [searchFormData, setSearchFormData] = useState<AuditLogSearchFormData>({
    username: '',
    endpoint: '',
    httpMethod: '',
    result: '',
    ipAddress: '',
    responseTime: '',
    startDate: '',
    endDate: '',
  });

  const handleSearchPanelToggle = () => {
    setSearchPanelExpanded(!searchPanelExpanded);
  };

  const handleSearchFormChange = (field: keyof AuditLogSearchFormData, value: string) => {
    setSearchFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClearSearch = () => {
    setSearchFormData({
      username: '',
      endpoint: '',
      httpMethod: '',
      result: '',
      ipAddress: '',
      responseTime: '',
      startDate: '',
      endDate: '',
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(searchFormData).filter(Boolean).length;
  };

  const buildSearchParams = () => {
    const params: any = {};
    
    if (searchFormData.username?.trim()) params.username = searchFormData.username.trim();
    if (searchFormData.endpoint?.trim()) params.endpoint = searchFormData.endpoint.trim();
    if (searchFormData.httpMethod) params.httpMethod = searchFormData.httpMethod;
    if (searchFormData.result?.trim()) params.result = searchFormData.result.trim();
    if (searchFormData.ipAddress?.trim()) params.ipAddress = searchFormData.ipAddress.trim();
    if (searchFormData.responseTime?.trim()) params.minDurationMs = parseInt(searchFormData.responseTime.trim());
    if (searchFormData.startDate) params.startDate = searchFormData.startDate;
    if (searchFormData.endDate) params.endDate = searchFormData.endDate;
    
    return params;
  };

  return {
    searchPanelExpanded,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    getActiveFiltersCount,
    buildSearchParams,
  };
};
