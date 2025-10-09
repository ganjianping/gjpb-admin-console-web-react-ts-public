import { Box, Alert, Card, CardContent, Collapse, useTheme, Snackbar } from '@mui/material';
import '../i18n/translations'; // Initialize logo translations
import { useNotification } from '../../../../shared-lib/src/data-management/useNotification';
import type { Logo } from '../types/logo.types';

// Import all the refactored components and hooks
import {
  LogoPageHeader,
  LogoSearchPanel,
  LogoTable,
  LogoDialog,
  DeleteLogoDialog,
} from '../components';

import {
  useLogos,
  useLogoSearch,
  useLogoDialog,
  useLogoHandlers,
} from '../hooks';

/**
 * Main page component for Logos management
 * 
 * This component orchestrates multiple hooks to provide a complete
 * CRUD interface for managing logos. It demonstrates
 * the separation of concerns pattern:
 * 
 * - useLogos: Data fetching
 * - useLogoSearch: Search functionality
 * - useLogoDialog: Dialog UI state
 * - useLogoHandlers: Business logic (CRUD operations)
 * 
 * @component
 */
const LogosPage = () => {
  const theme = useTheme();
  
  // ============================================================================
  // Notification Management
  // ============================================================================
  const { snackbar, showSuccess, showError, hideNotification } = useNotification();
  
  // ============================================================================
  // Data Management
  // ============================================================================
  const {
    allLogos,
    filteredLogos,
    setFilteredLogos,
    loading,
    error,
    loadLogos,
    setError,
  } = useLogos();

  // ============================================================================
  // Search Functionality
  // ============================================================================
  const {
    searchPanelOpen,
    searchFormData,
    applyClientSideFiltersWithData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
  } = useLogoSearch(allLogos);

  // ============================================================================
  // Dialog Management (UI State Only)
  // ============================================================================
  const {
    dialogOpen,
    selectedLogo,
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
  } = useLogoDialog();

  // ============================================================================
  // Business Logic Handlers
  // ============================================================================
  const { handleSave, handleDelete: handleConfirmDelete } = useLogoHandlers({
    onSuccess: (message: string) => {
      showSuccess(message);
      handleClose();
    },
    onError: (message: string) => {
      showError(message);
    },
    onRefresh: () => {
      loadLogos();
    },
  });

  // ============================================================================
  // Event Handlers
  // ============================================================================
  const handleLogoAction = (logo: Logo, action: 'view' | 'edit' | 'delete') => {
    if (action === 'view') {
      handleView(logo);
    } else if (action === 'edit') {
      handleEdit(logo);
    } else if (action === 'delete') {
      handleDelete(logo);
    }
  };

  const handleDialogSubmit = async () => {
    const success = await handleSave(
      actionType,
      formData,
      selectedLogo,
      setFormErrors
    );
    if (success) {
      handleClose();
    }
  };

  const handleDeleteConfirm = async () => {
    const success = await handleConfirmDelete(selectedLogo);
    if (success) {
      handleClose();
    }
  };

  // Immediate client-side filtering (triggered on every input change)
  const handleImmediateFilter = (field: keyof typeof searchFormData, value: any) => {
    handleSearchFormChange(field, value);
    
    // Apply filter immediately with the updated search data
    const updatedSearchData = { ...searchFormData, [field]: value };
    const filtered = applyClientSideFiltersWithData(updatedSearchData);
    setFilteredLogos(filtered);
  };

  // Server-side API search (triggered by clicking "Search" button)
  const handleApiSearch = async () => {
    try {
      setError(null);
      // Build query parameters from search form
      const params: any = {};
      if (searchFormData.name) params.name = searchFormData.name;
      if (searchFormData.lang) params.lang = searchFormData.lang;
      if (searchFormData.tags) params.tags = searchFormData.tags;
      if (searchFormData.isActive !== '') params.isActive = searchFormData.isActive === 'true';
      
      // Load logos with API search parameters
      await loadLogos(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search logos';
      showError(errorMessage);
      console.error('API search error:', err);
    }
  };

  const handleClear = () => {
    handleClearSearch();
    setFilteredLogos(allLogos);
    // Reload all logos without filters
    loadLogos();
  };

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <Box sx={{ py: 2, minHeight: '100vh' }}>
      {/* Page Header */}
      <LogoPageHeader
        onCreateLogo={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      {/* Search Panel */}
      <Collapse in={searchPanelOpen}>
        <LogoSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleImmediateFilter}
          onSearch={handleApiSearch}
          onClear={handleClear}
        />
      </Collapse>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Logos Table */}
      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <LogoTable
            logos={filteredLogos}
            loading={loading}
            onLogoAction={handleLogoAction}
          />
        </CardContent>
      </Card>

      {/* Logo Dialog (View/Edit/Create) */}
      {actionType !== 'delete' && (
        <LogoDialog
          open={dialogOpen}
          onClose={handleClose}
          actionType={actionType}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleDialogSubmit}
          loading={dialogLoading}
          formErrors={formErrors}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {actionType === 'delete' && (
        <DeleteLogoDialog
          open={dialogOpen}
          onClose={handleClose}
          onConfirm={handleDeleteConfirm}
          logo={selectedLogo}
          loading={dialogLoading}
        />
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LogosPage;
