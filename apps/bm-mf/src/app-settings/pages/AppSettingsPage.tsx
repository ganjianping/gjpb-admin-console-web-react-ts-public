import { Box, Alert, Card, CardContent, Collapse, useTheme, Snackbar } from '@mui/material';
import '../i18n/translations'; // Initialize app settings translations
import { useNotification } from '../../../../shared-lib/src/data-management/useNotification';
import type { AppSetting } from '../types/app-setting.types';

// Import all the refactored components and hooks
import {
  AppSettingPageHeader,
  AppSettingSearchPanel,
  AppSettingTable,
  AppSettingDialog,
  DeleteAppSettingDialog,
} from '../components';

import {
  useAppSettings,
  useAppSettingSearch,
  useAppSettingDialog,
  useAppSettingHandlers,
} from '../hooks';

const AppSettingsPage = () => {
  const theme = useTheme();
  
  // Notification state using shared hook
  const { snackbar, showSuccess, showError, hideNotification } = useNotification();
  
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

  // Initialize dialog management (UI state only)
  const {
    dialogOpen,
    selectedAppSetting,
    actionType,
    loading: dialogLoading,
    formData,
    formErrors,
    setFormErrors,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleClose,
    handleFormChange,
  } = useAppSettingDialog();

  // Initialize business logic handlers
  const { handleSave, handleDelete: handleConfirmDelete } = useAppSettingHandlers({
    onSuccess: (message: string) => {
      showSuccess(message);
      loadAppSettings();
      handleClose();
    },
    onError: (message: string) => {
      showError(message);
    },
    onRefresh: () => {
      loadAppSettings();
    },
  });

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
  
  // Dialog save handler
  const handleDialogSave = async () => {
    await handleSave(actionType, formData, selectedAppSetting, setFormErrors);
  };
  
  // Dialog delete handler
  const handleDialogDelete = async () => {
    await handleConfirmDelete(selectedAppSetting);
  };

  const handleAppSettingAction = (appSetting: AppSetting, action: 'view' | 'edit' | 'delete') => {
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
    <Box sx={{ py: 2, minHeight: '100vh' }}>
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

      {/* App Setting Dialog */}
      <AppSettingDialog
        open={dialogOpen && (actionType === 'create' || actionType === 'edit' || actionType === 'view')}
        onClose={handleClose}
        actionType={actionType}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleDialogSave}
        loading={dialogLoading}
        formErrors={formErrors}
      />
      
      {/* Delete App Setting Dialog */}
      <DeleteAppSettingDialog
        open={actionType === 'delete' && selectedAppSetting !== null}
        onClose={() => handleDelete(null as any)} // Reset delete state
        appSetting={selectedAppSetting}
        onConfirm={handleDialogDelete}
        loading={dialogLoading}
      />
      
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'error' ? 6000 : 4000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppSettingsPage;
