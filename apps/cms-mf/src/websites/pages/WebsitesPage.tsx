// ...existing code...
import { Box, Alert, Card, CardContent, Collapse, useTheme, Snackbar } from '@mui/material';
import '../i18n/translations'; // Initialize website translations
import { useNotification } from '../../../../shared-lib/src/data-management/useNotification';
import type { Website } from '../types/website.types';

// ...existing code...
// Import all the refactored components and hooks
import {
  WebsitePageHeader,
  WebsiteSearchPanel,
  WebsiteTable,
  WebsiteCreateDialog,
  WebsiteUpdateDialog,
  DeleteWebsiteDialog,
      WebsiteViewDialog,
    } from '../components';
// ...existing code...

import {
  useWebsites,
  useWebsiteSearch,
  useWebsiteDialog,
  useWebsiteHandlers,
} from '../hooks';

/**
 * Main page component for Websites management
 * 
 * This component orchestrates multiple hooks to provide a complete
 * CRUD interface for managing websites. It demonstrates
 * the separation of concerns pattern:
 * 
 * - useWebsites: Data fetching & pagination
 * - useWebsiteSearch: Search functionality
 * - useWebsiteDialog: Dialog UI state
 * - useWebsiteHandlers: Business logic (CRUD operations)
 * 
 * @component
 */
const WebsitesPage = () => {
  const theme = useTheme();
  
  // ============================================================================
  // Notification Management
  // ============================================================================
  // Notification state using shared hook
  const { snackbar, showSuccess, showError, hideNotification } = useNotification();
  
  // ============================================================================
  // Data Management
  // ============================================================================
  // Initialize websites data management with pagination support
  const {
    allWebsites,
    filteredWebsites,
    setFilteredWebsites,
    pagination,
    loading,
    error,
    loadWebsites,
    setError,
    handlePageChange,
    handlePageSizeChange,
  } = useWebsites();

  // ============================================================================
  // Search Functionality
  // ============================================================================
  // Initialize client-side search with real-time filtering
  const {
    searchPanelOpen,
    searchFormData,
    applyClientSideFiltersWithData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
  } = useWebsiteSearch(allWebsites);

  // ============================================================================
  // Dialog Management (UI State Only)
  // ============================================================================
  // Initialize dialog UI state - no business logic here
  const {
    dialogOpen,
    selectedWebsite,
    actionType,
    loading: dialogLoading,
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
  } = useWebsiteDialog();

  // ============================================================================
  // Business Logic Handlers
  // ============================================================================
  // Initialize CRUD operation handlers with callbacks
  const { handleCreateSave, handleEditSave, handleDelete: handleConfirmDelete } = useWebsiteHandlers({
    onSuccess: (message: string) => {
      showSuccess(message);
      loadWebsites();
      handleClose();
    },
    onError: (message: string) => {
      showError(message);
    },
    onRefresh: () => {
      loadWebsites();
    },
  });

  // ============================================================================
  // Search Handlers
  // ============================================================================
  /**
   * Handle server-side search with API call
   * Constructs search parameters and triggers data reload
   */
  const handleSearch = () => {
    const searchParams: any = {};
    
    if (searchFormData.name) searchParams.name = searchFormData.name;
    if (searchFormData.lang) searchParams.lang = searchFormData.lang;
    if (searchFormData.tags) searchParams.tags = searchFormData.tags;
    if (searchFormData.isActive !== '') searchParams.isActive = searchFormData.isActive === 'true';
    
    // Perform API search
    loadWebsites(searchParams);
  };

  /**
   * Handle form changes with real-time client-side filtering
   * Updates search form and applies filters immediately without API call
   */
  const handleSearchFormChangeWrapper = (field: keyof typeof searchFormData, value: any) => {
    handleSearchFormChange(field, value);
    
    // Apply real-time client-side filtering for better UX
    const newSearchFormData = { ...searchFormData, [field]: value };
    const filtered = applyClientSideFiltersWithData(newSearchFormData);
    setFilteredWebsites(filtered);
  };

  // ============================================================================
  // Action Handlers
  // ============================================================================
  /**
   * Trigger create dialog
   */
  const handleCreateWebsite = () => {
    handleCreate();
  };
  
  /**
   * Save handler - delegates to business logic hook
   */
  const handleDialogSave = async () => {
    if (actionType === 'create') {
      setLoading(true);
      await handleCreateSave(formData, setFormErrors);
      setLoading(false);
    } else if (actionType === 'edit') {
      await handleEditSave(formData, selectedWebsite, setFormErrors);
    }
  };
  
  /**
   * Delete handler - delegates to business logic hook
   */
  const handleDialogDelete = async () => {
    await handleConfirmDelete(selectedWebsite);
  };

  /**
   * Router for website actions (view/edit/delete)
   * Called from table row actions
   */
  const handleWebsiteAction = (website: Website, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        handleView(website);
        break;
      case 'edit':
        handleEdit(website);
        break;
      case 'delete':
        handleDelete(website);
        break;
    }
  };

  return (
    <Box sx={{ py: 2, minHeight: '100vh' }}>
      {/* Page Header */}
      <WebsitePageHeader
        onCreateWebsite={handleCreateWebsite}
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
        <WebsiteSearchPanel
          searchFormData={searchFormData}
          onFormChange={handleSearchFormChangeWrapper}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={loading}
        />
      </Collapse>

      {/* Websites Table */}
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
          <WebsiteTable
            websites={filteredWebsites}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onWebsiteAction={handleWebsiteAction}
          />
        </CardContent>
      </Card>

      {/* Website View Dialog */}
      <WebsiteViewDialog
        open={dialogOpen && actionType === 'view'}
        onClose={handleClose}
        website={selectedWebsite || { id: '', name: '', url: '', logoUrl: '', description: '', tags: '', lang: '', displayOrder: 0, isActive: true, createdAt: '', updatedAt: '', createdBy: '', updatedBy: '', tagsArray: [] }}
      />

      {/* Website Create Dialog */}
      <WebsiteCreateDialog
        open={dialogOpen && actionType === 'create'}
        onClose={handleClose}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleDialogSave}
        loading={dialogLoading}
        formErrors={formErrors}
      />

      {/* Website Update Dialog */}
      <WebsiteUpdateDialog
        open={dialogOpen && actionType === 'edit'}
        onClose={handleClose}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleDialogSave}
        loading={dialogLoading}
        formErrors={formErrors}
      />

      {/* Delete Website Dialog */}
      <DeleteWebsiteDialog
        open={actionType === 'delete' && selectedWebsite !== null}
        onClose={() => handleDelete(null as any)} // Reset delete state
        website={selectedWebsite}
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

export default WebsitesPage;

