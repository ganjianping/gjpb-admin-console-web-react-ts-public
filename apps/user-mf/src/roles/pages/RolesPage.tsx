import { Box, Card, CardContent, Collapse, Snackbar, Alert } from '@mui/material';
import { DataTable } from '../../../../shared-lib/src/data-management/DataTable';
import { useNotification } from '../../../../shared-lib/src/data-management/useNotification';
import { RoleSearchPanel, RolesPageSkeleton, RoleDialog, RolePageHeader, useRoleTableColumns } from '../components';
import { useRoleSearch, useRoleHandlers, useRoleDialog, useRoleActionMenu } from '../hooks';
import type { Role } from '../types/role.types';

const RolesPage = () => {
  // Notification state
  const { snackbar, showSuccess, showError, hideNotification } = useNotification();
  
  // Dialog state and handlers
  const {
    dialogOpen,
    selectedRole,
    actionType,
    formData,
    handleView,
    handleEdit,
    handleDelete: handleDeleteAction,
    handleCreate,
    handleAddChildRole,
    handleCloseDialog: closeDialog,
    handleFormChange: updateFormField,
  } = useRoleDialog();

  // Search functionality using API with pagination
  const {
    roles,
    loading,
    searchPanelOpen,
    searchFormData,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    handleSearchPanelToggle,
    handleSearchPanelClose,
    handleSearchFormChange,
    handleSearch,
    handleClearSearch,
    handlePageChange,
    handlePageSizeChange,
    toggleRoleExpand,
    setPriorityParent,
    clearPriorityParent,
  } = useRoleSearch();

  // Role handlers
  const {
    dialogErrorMessage,
    getErrorMessage,
    hasError,
    getGeneralErrors,
    clearErrors,
    clearFieldError,
    handleSave: handleSaveRole,
    handleDelete: handleDeleteRole,
  } = useRoleHandlers({
    onSuccess: (message) => {
      showSuccess(message);
      closeDialog(clearErrors);
      handleSearchPanelClose();
    },
    onError: (message) => {
      showError(message);
    },
    onRefresh: handleSearch,
    setPriorityParent,
    clearPriorityParent,
  });

  // Table columns
  const columns = useRoleTableColumns();

  // Action menu items
  const actionMenuItems = useRoleActionMenu({
    onView: handleView,
    onEdit: handleEdit,
    onAddChild: handleAddChildRole,
    onDelete: handleDeleteAction,
  });

  // Handle form changes with error clearing
  const handleFormChange = (field: keyof Role, value: any) => {
    updateFormField(field, value, clearFieldError);
  };

  // Handle dialog close with error clearing
  const handleCloseDialog = () => {
    closeDialog(clearErrors);
  };

  // Handle save action
  const handleSave = async () => {
    if (actionType === 'delete' && selectedRole) {
      await handleDeleteRole(selectedRole);
    } else if (actionType === 'create' || actionType === 'edit') {
      await handleSaveRole(actionType, formData, selectedRole);
    }
  };

  // Handle row click - expand/collapse if has children, otherwise show view dialog
  const handleRowClick = (role: Role) => {
    if (role.hasChildren) {
      toggleRoleExpand(role.id);
    } else {
      handleView(role);
    }
  };

  // Show skeleton while loading initial data
  if (loading && roles.length === 0) {
    return <RolesPageSkeleton />;
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Page heading */}
      <RolePageHeader
        searchPanelOpen={searchPanelOpen}
        onSearchToggle={handleSearchPanelToggle}
        onCreate={handleCreate}
      />

      {/* Search Panel */}
      <Box sx={{ mb: 2 }}>
        <Collapse in={searchPanelOpen}>
          <RoleSearchPanel
            searchFormData={searchFormData}
            loading={loading}
            onFormChange={handleSearchFormChange}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
        </Collapse>
      </Box>

      {/* Roles Card */}
      <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <DataTable
            data={roles}
            columns={columns}
            actionMenuItems={actionMenuItems}
            onRowClick={handleRowClick}
            showSearch={false}
            showPagination={true}
            manualPagination={true}
            currentPage={currentPage}
            pageSize={pageSize}
            pageCount={totalPages}
            totalRows={totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <RoleDialog
        open={dialogOpen}
        actionType={actionType}
        selectedRole={selectedRole}
        formData={formData}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onFormChange={handleFormChange}
        hasError={hasError}
        getErrorMessage={getErrorMessage}
        getGeneralErrors={getGeneralErrors}
        dialogErrorMessage={dialogErrorMessage}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'error' ? 6000 : 4000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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

export default RolesPage;
