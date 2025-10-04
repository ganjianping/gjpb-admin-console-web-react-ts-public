import { Box, Alert, Card, CardContent, Collapse, useTheme } from '@mui/material';
import { useEffect } from 'react';

// Import all the refactored components and hooks
import {
  UserPageHeader,
  UserSearchPanel,
  UserTable,
  UserDialog,
  DeleteUserDialog,
  NotificationSnackbar,
} from '../components';

import {
  useUsers,
  useUserSearch,
  useUserDialog,
} from '../hooks';

import {
  useNotification,
} from '../../../../shared-lib/src/data-management';

import { useRoles } from '../../roles/hooks';

import { rolesService } from '../../roles/services/rolesCacheService';

const UsersPage = () => {
  const theme = useTheme();
  // Initialize notification system
  const { showSuccess, showError, snackbar, hideNotification } = useNotification();
   // Initialize roles loading - load roles once when Users page is accessed
  const { loadRoles, error: rolesError } = useRoles();

  // Initialize user data management
  const {
    allUsers,
    filteredUsers,
    setFilteredUsers,
    pagination,
    loading,
    error,
    loadUsers,
    setError,
    handlePageChange,
    handlePageSizeChange,
  } = useUsers();

  // Initialize search functionality
  const {
    searchPanelOpen,
    searchFormData,
    applyClientSideFiltersWithData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
  } = useUserSearch(allUsers);

  // Initialize dialog management
  const {
    dialogOpen,
    selectedUser,
    actionType,
    loading: dialogLoading,
    formData,
    formErrors,
    handleView,
    handleEdit,
    handleCreate,
    handleDelete,
    handleCloseDialog,
    handleFormChange,
    handleSave,
    handleConfirmDelete,
  } = useUserDialog();

  // Load roles once when Users page is accessed
  useEffect(() => {
    // Check if roles are already cached in localStorage
    const isRolesCached = rolesService.isRolesLoaded();
    
    if (!isRolesCached) {
      // Always load roles from API on first visit
      loadRoles();
    }
  }, []); // Empty dependency array to run only once on mount

  // Show error toast when roles loading fails
  useEffect(() => {
    if (rolesError) {
      showError(rolesError);
    }
  }, [rolesError, showError]);

  // Enhanced search functionality
  const handleSearch = () => {
    const searchParams: any = {};
    
    if (searchFormData.username) searchParams.username = searchFormData.username;
    if (searchFormData.email) searchParams.email = searchFormData.email;
    if (searchFormData.mobile) searchParams.mobile = searchFormData.mobile;
    if (searchFormData.accountStatus) searchParams.accountStatus = searchFormData.accountStatus;
    if (searchFormData.roleCode) searchParams.roleCode = searchFormData.roleCode;
    if (searchFormData.active !== '') {
      searchParams.active = searchFormData.active === 'true';
    }
    
    // Perform API search
    loadUsers(searchParams);
  };

  // Handle form changes with client-side filtering
  const handleSearchFormChangeWrapper = (field: keyof typeof searchFormData, value: any) => {
    handleSearchFormChange(field, value);
    
    // Apply real-time client-side filtering
    const newSearchFormData = { ...searchFormData, [field]: value };
    const filtered = applyClientSideFiltersWithData(newSearchFormData);
    setFilteredUsers(filtered);
  };

  // User action handlers
  const handleCreateUser = () => {
    handleCreate();
  };

  const handleUserAction = (user: any, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        handleView(user);
        break;
      case 'edit':
        handleEdit(user);
        break;
      case 'delete':
        handleDelete(user);
        break;
    }
  };

  // Handle successful operations
  const handleOperationSuccess = (message: string) => {
    showSuccess(message);
    loadUsers(); // Reload users after successful operation
  };

  // Handle operation errors
  const handleOperationError = (message: string) => {
    showError(message);
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Page Header */}
      <UserPageHeader
        onCreateUser={handleCreateUser}
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
        <UserSearchPanel
          searchFormData={searchFormData}
          onFormChange={handleSearchFormChangeWrapper}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={loading}
        />
      </Collapse>

      {/* Users Table */}
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
          <UserTable
            users={filteredUsers}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onUserAction={handleUserAction}
          />
        </CardContent>
      </Card>

      {/* User Dialog (Create/Edit/View) */}
      <UserDialog
        open={dialogOpen && actionType !== 'delete'}
        onClose={handleCloseDialog}
        user={selectedUser}
        actionType={actionType}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={() => handleSave(handleOperationSuccess, handleOperationError)}
        loading={dialogLoading}
        formErrors={formErrors}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        open={actionType === 'delete'}
        onClose={handleCloseDialog}
        user={selectedUser}
        onConfirm={() => handleConfirmDelete(handleOperationSuccess, handleOperationError)}
        loading={dialogLoading}
      />

      {/* Notifications */}
      <NotificationSnackbar
        snackbar={snackbar}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default UsersPage;
