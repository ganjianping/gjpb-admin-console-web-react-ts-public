import { Box, Alert, Card, CardContent, Collapse, useTheme } from '@mui/material';
import '../utils/i18n'; // Initialize app settings translations

// Import all the refactored components and hooks
import {
  AppSettingPageHeader,
  AppSettingSearchPanel,
  AppSettingTable,
} from '../components';

import {
  useAppSettings,
  useAppSettingSearch,
  useAppSettingDialog,
} from '../hooks';

const AppSettingsPage = () => {
  const theme = useTheme();
  
  // Initialize app settings data management
  const {
    allAppSettings,
    filteredAppSettings,
    setFilteredAppSettings,
    pagination,
    loading,
    error,
    loadAppSettings,
    setError,
    handlePageChange,
    handlePageSizeChange,
  } = useAppSettings();

  // Initialize search functionality
  const {
    searchPanelOpen,
    searchFormData,
    applyClientSideFiltersWithData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
  } = useAppSettingSearch(allAppSettings);

  // Initialize dialog management
  const {
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
  } = useAppSettingDialog();

  // Enhanced search functionality
  const handleSearch = () => {
    const searchParams: any = {};
    
    if (searchFormData.name) searchParams.name = searchFormData.name;
    if (searchFormData.lang) searchParams.lang = searchFormData.lang;
    if (searchFormData.isSystem !== '') searchParams.isSystem = searchFormData.isSystem === 'true';
    if (searchFormData.isPublic !== '') searchParams.isPublic = searchFormData.isPublic === 'true';
    
    // Perform API search
    loadAppSettings(searchParams);
  };

  // Handle form changes with client-side filtering
  const handleSearchFormChangeWrapper = (field: keyof typeof searchFormData, value: any) => {
    handleSearchFormChange(field, value);
    
    // Apply real-time client-side filtering
    const newSearchFormData = { ...searchFormData, [field]: value };
    const filtered = applyClientSideFiltersWithData(newSearchFormData);
    setFilteredAppSettings(filtered);
  };

  // App setting action handlers
  const handleCreateAppSetting = () => {
    handleCreate();
  };

  const handleAppSettingAction = (appSetting: any, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        handleView(appSetting);
        break;
      case 'edit':
        handleEdit(appSetting);
        break;
      case 'delete':
        handleDelete(appSetting);
        break;
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Page Header */}
      <AppSettingPageHeader
        onCreateAppSetting={handleCreateAppSetting}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search Panel */}
      <Collapse in={searchPanelOpen}>
        <AppSettingSearchPanel
          searchFormData={searchFormData}
          onFormChange={handleSearchFormChangeWrapper}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={loading}
        />
      </Collapse>

      {/* App Settings Table */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          border: '2px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.06)',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(32, 32, 32, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <CardContent>
          <AppSettingTable
            appSettings={filteredAppSettings}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onAppSettingAction={handleAppSettingAction}
          />
        </CardContent>
      </Card>

      {/* TODO: Add AppSettingDialog and DeleteAppSettingDialog components */}
      
      {/* TODO: Add NotificationSnackbar component */}
    </Box>
  );
};

export default AppSettingsPage;
