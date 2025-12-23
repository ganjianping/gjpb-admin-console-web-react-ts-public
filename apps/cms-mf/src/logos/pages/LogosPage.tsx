import { Box, Alert, Card, CardContent, Collapse, useTheme, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations'; // Initialize logo translations
import { useNotification } from '../../../../shared-lib/src/data-management/useNotification';
import type { Logo } from '../types/logo.types';
import { useEffect } from 'react';

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
    // =========================================================================
    // Notification Management
    // =========================================================================
    const { snackbar, showSuccess, showError, hideNotification } = useNotification();
  // =========================================================================
  // Business Logic Handlers
  // =========================================================================
    const { handleSave, handleDelete: handleDeleteLogo } = useLogoHandlers({
      onSuccess: showSuccess,
      onError: showError,
      onRefresh: () => {}, // Optionally reload logos if needed
    });
  // =========================================================================
  // Dialog Management (UI State Only)
  // =========================================================================
  const {
    dialogOpen,
    selectedLogo,
    actionType,
    loading: dialogLoading,
    setLoading: setDialogLoading,
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

  // =========================================================================
  // Event Handlers
  // =========================================================================
  // This enables switching from view to edit dialog
  // when the Edit button is clicked in LogoViewDialog
  useEffect(() => {
    const handleLogoEditEvent = (e: any) => {
      if (e.detail) {
        handleEdit(e.detail);
      }
    };
    window.addEventListener('logo-edit', handleLogoEditEvent);
    return () => {
      window.removeEventListener('logo-edit', handleLogoEditEvent);
    };
  }, [handleEdit]);
  const theme = useTheme();
  const { t } = useTranslation();
  
  // ============================================================================
  // Notification Management
  // ============================================================================
  
  // ============================================================================
  // Data Management
  // ============================================================================
  const {
    allLogos,
    filteredLogos,
    pagination,
    loading,
    error,
    setError,
    loadLogos,
    setFilteredLogos,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
  } = useLogos();

  // ============================================================================
  // Search Functionality
  // ============================================================================
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useLogoSearch(allLogos);

  const buildSearchParams = () => {
    const params: import('../services/logoService').LogoQueryParams = {};
    if (searchFormData.name && searchFormData.name.trim() !== '') {
      params.name = searchFormData.name.trim();
    }
    if (searchFormData.lang && searchFormData.lang.trim() !== '') {
      params.lang = searchFormData.lang.trim();
    }
    if (searchFormData.tags && searchFormData.tags.trim() !== '') {
      params.tags = searchFormData.tags.trim();
    }
    if (searchFormData.isActive === 'true') {
      params.isActive = true;
    } else if (searchFormData.isActive === 'false') {
      params.isActive = false;
    }
    return params;
  };

  // =========================================================================
  // Search Handler (API-based)
  // =========================================================================
  const handleApiSearch = async () => {
    const params = buildSearchParams();
    await loadLogos(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadLogos(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadLogos(params, 0, newPageSize);
  };
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
    setDialogLoading(true);
    try {
      const success = await handleSave(
        actionType,
        formData,
        selectedLogo,
        setFormErrors
      );
      if (success) {
        handleClose();
        // Refresh logo table after create/update
        await loadLogos({ sort: 'updateAt', direction: 'desc' });
      }
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDialogLoading(true);
    try {
      const success = await handleDeleteLogo(selectedLogo);
      if (success) {
        handleClose();
        // Refresh logo table after delete
        await loadLogos({ sort: 'updateAt', direction: 'desc' });
      }
    } finally {
      setDialogLoading(false);
    }
  };

  const handleCopyFilename = async (logo: Logo) => {
    try {
      await navigator.clipboard.writeText(logo.filename);
      showSuccess(t('logos.messages.filenameCopied'));
    } catch (error) {
      console.error('[LogosPage] Failed to copy filename:', error);
      showError('Failed to copy filename');
    }
  };

  // Listen for logo-edit event from LogoViewDialog
  // This enables switching from view to edit dialog
  // when the Edit button is clicked in LogoViewDialog
  // (removed duplicate)

  // Immediate client-side filtering (triggered on every input change)
  // Immediate client-side filtering (triggered on every input change)
  // Use the handlers from useLogoSearch and useLogos above

  // Listen for logo-edit event from LogoViewDialog
  // This enables switching from view to edit dialog
  // when the Edit button is clicked in LogoViewDialog
  // =========================================================================
  // Render
  // =========================================================================
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
            onFormChange={(field, value) => {
              handleSearchFormChange(field, value);
              if (["isActive", "name", "lang", "tags"].includes(field)) {
                const filtered = applyClientSideFiltersWithData({ ...searchFormData, [field]: value });
                setFilteredLogos(filtered);
              }
            }}
            onSearch={handleApiSearch}
            onClear={handleClearSearch}
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
            pagination={pagination}
            onPageChange={handlePageChangeWithSearch}
            onPageSizeChange={handlePageSizeChangeWithSearch}
            onLogoAction={handleLogoAction}
            onCopyFilename={handleCopyFilename}
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
          selectedLogo={selectedLogo}
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
