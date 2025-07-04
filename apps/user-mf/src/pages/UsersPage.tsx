import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
import { Plus, Users as UsersIcon, Shield, Download, Upload, User as UserIcon, Mail, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'; // Initialize user-mf translations
import { DataTable, createColumnHelper, createStatusChip } from '../../../shared-lib/src/components/DataTable';
import { 
  userService, 
  type User, 
  type UserQueryParams, 
  type CreateUserRequest, 
  type UpdateUserRequest,
  type AccountStatus,
  type PaginatedResponse,
  type ApiResponse 
} from '../services/userService';
import { ApiError } from '../../../shared-lib/src/services/api-client';

// Map API status to UI status for display
const statusDisplayMap = {
  active: { label: 'Active', color: 'success' as const },
  locked: { label: 'Locked', color: 'error' as const },
  suspend: { label: 'Suspended', color: 'error' as const },
  pending_verification: { label: 'Pending', color: 'warning' as const },
};

// Column helper
const columnHelper = createColumnHelper<User>();

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`users-tabpanel-${index}`}
      aria-labelledby={`users-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `users-tab-${index}`,
    'aria-controls': `users-tabpanel-${index}`,
  };
}

// Form data for create/edit user
interface UserFormData {
  username: string;
  password: string;
  nickname: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  accountStatus: AccountStatus;
  roleCodes: string[];
  active: boolean;
}

const UsersPage = () => {
  const { t } = useTranslation();
  
  // State management
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'create' | 'delete' | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    nickname: '',
    email: '',
    mobileCountryCode: '',
    mobileNumber: '',
    accountStatus: 'active',
    roleCodes: [],
    active: true,
  });
  
  // Snackbar for notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Form errors for field-level validation display
  const [formErrors, setFormErrors] = useState<Record<string, string[] | string>>({});
  
  // Current page and filters
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Load users data
  const loadUsers = useCallback(async (params?: UserQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: UserQueryParams = {
        page: currentPage,
        size: pageSize,
        sort: 'username',
        direction: 'asc',
        ...params,
      };

      // Add search query if exists
      // Note: For now, we'll remove the search from API and let DataTable handle it internally

      // Add status filter based on active tab
      if (tabIndex === 1) queryParams.accountStatus = 'active';
      else if (tabIndex === 2) queryParams.accountStatus = 'locked';
      else if (tabIndex === 3) queryParams.accountStatus = 'pending_verification';
      else if (tabIndex === 4) queryParams.accountStatus = 'suspend';

      const response: ApiResponse<PaginatedResponse<User>> = await userService.getUsers(queryParams);
      
      if (response.status.code === 200) {
        setUsers(response.data.content);
        setPagination(response.data);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('users.errors.loadFailed');
      setError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, tabIndex, t]);

  // Load users on component mount and when dependencies change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setCurrentPage(0); // Reset to first page when changing tabs
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  // User actions
  const handleView = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      mobileCountryCode: user.mobileCountryCode ?? '',
      mobileNumber: user.mobileNumber ?? '',
      accountStatus: user.accountStatus,
      roleCodes: user.roles.map(role => role.code),
      active: user.active,
    });
    setActionType('view');
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      mobileCountryCode: user.mobileCountryCode ?? '',
      mobileNumber: user.mobileNumber ?? '',
      accountStatus: user.accountStatus,
      roleCodes: user.roles.map(role => role.code),
      active: user.active,
    });
    setActionType('edit');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      nickname: '',
      email: '',
      mobileCountryCode: '',
      mobileNumber: '',
      accountStatus: 'active',
      roleCodes: [],
      active: true,
    });
    setActionType('create');
    setDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setActionType('delete');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setActionType(null);
    setFormErrors({}); // Clear form errors
    setFormData({
      username: '',
      password: '',
      nickname: '',
      email: '',
      mobileCountryCode: '',
      mobileNumber: '',
      accountStatus: 'active',
      roleCodes: [],
      active: true,
    });
  };
  // Form handlers
  const handleFormChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save user (create or update)
  const handleSave = async () => {
    try {
      setLoading(true);
      setFormErrors({}); // Clear previous errors

      if (actionType === 'create') {
        const createData: CreateUserRequest = {
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname || undefined,
          email: formData.email || undefined,
          mobileCountryCode: formData.mobileCountryCode || undefined,
          mobileNumber: formData.mobileNumber || undefined,
          accountStatus: formData.accountStatus,
          roleCodes: formData.roleCodes,
          active: formData.active,
        };

        const response = await userService.createUser(createData);
        if (response.status.code === 200) {
          setSnackbar({ open: true, message: t('users.userCreatedSuccess'), severity: 'success' });
          handleCloseDialog();
          await loadUsers();
        } else {
          // Handle API response errors
          const errorMessage = response.status.message || t('users.errors.createFailed');
          setSnackbar({ open: true, message: errorMessage, severity: 'error' });
          if (response.status.errors) {
            setFormErrors(response.status.errors);
          }
        }
      } else if (actionType === 'edit' && selectedUser) {
        const updateData: UpdateUserRequest = {
          username: formData.username,
          nickname: formData.nickname || undefined,
          email: formData.email || undefined,
          mobileCountryCode: formData.mobileCountryCode || undefined,
          mobileNumber: formData.mobileNumber || undefined,
          accountStatus: formData.accountStatus,
          roleCodes: formData.roleCodes,
          active: formData.active,
        };

        const response = await userService.patchUser(selectedUser.id, updateData);
        if (response.status.code === 200) {
          setSnackbar({ open: true, message: t('users.userUpdatedSuccess'), severity: 'success' });
          handleCloseDialog();
          await loadUsers();
        } else {
          // Handle API response errors
          const errorMessage = response.status.message || t('users.errors.updateFailed');
          setSnackbar({ open: true, message: errorMessage, severity: 'error' });
          if (response.status.errors) {
            setFormErrors(response.status.errors);
          }
        }
      }
    } catch (err) {
      // Handle thrown errors (network errors, API errors, etc.)
      if (err instanceof ApiError) {
        // API error with structured response
        setSnackbar({ open: true, message: err.message, severity: 'error' });
        if (err.errors) {
          setFormErrors(err.errors);
        }
      } else {
        // Generic error
        const errorMessage = err instanceof Error ? err.message : t('users.errors.createFailed');
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const response = await userService.deleteUser(selectedUser.id);
      
      if (response.status.code === 200) {
        setSnackbar({ open: true, message: t('users.userDeletedSuccess'), severity: 'success' });
        handleCloseDialog();
        await loadUsers();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('users.errors.deleteFailed');
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get field error message
  const getFieldError = (fieldName: string): string | undefined => {
    const errors = formErrors[fieldName];
    if (!errors) return undefined;
    if (Array.isArray(errors)) {
      return errors.length > 0 ? errors[0] : undefined;
    }
    return typeof errors === 'string' ? errors : undefined;
  };

  // Helper to check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    const errors = formErrors[fieldName];
    if (!errors) return false;
    if (Array.isArray(errors)) {
      return errors.length > 0;
    }
    return typeof errors === 'string' && errors.trim().length > 0;
  };

  // Helper to get dialog title
  const getDialogTitle = () => {
    if (actionType === 'view') return t('users.viewUser') || 'View User';
    if (actionType === 'edit') return t('users.editUser') || 'Edit User';
    if (actionType === 'create') return t('users.createUser') || 'Create User';
    return t('users.deleteUser') || 'Delete User';
  };

  // Helper to render dialog action buttons
  const renderActionButtons = () => {
    if (actionType === 'delete') {
      return (
        <Button 
          variant="contained" 
          color="error" 
          size="large"
          onClick={handleConfirmDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{ 
            minWidth: 100, 
            py: 1,
            px: 2 
          }}
        >
          {loading ? t('users.loading.deleting') : (t('common.delete') || 'Delete')}
        </Button>
      );
    }
    
    if (actionType === 'edit' || actionType === 'create') {
      return (
        <Button 
          variant="contained" 
          size="large"
          onClick={handleSave}
          disabled={loading || !formData.username || (actionType === 'create' && !formData.password)}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{ 
            minWidth: 100, 
            py: 1,
            px: 2 
          }}
        >
          {loading ? t('users.loading.saving') : (t('common.save') || 'Save')}
        </Button>
      );
    }
    
    return (
      <Button 
        variant="contained" 
        size="large"
        onClick={handleCloseDialog}
        sx={{ 
          minWidth: 100, 
          py: 1,
          px: 2 
        }}
      >
        {t('common.close') || 'Close'}
      </Button>
    );
  };

  // Get counts for tabs
  const getTabCounts = () => {
    if (!pagination) return { all: 0, active: 0, locked: 0, pending: 0, suspended: 0 };
    
    return {
      all: pagination.totalElements,
      active: users.filter(u => u.accountStatus === 'active').length,
      locked: users.filter(u => u.accountStatus === 'locked').length,
      pending: users.filter(u => u.accountStatus === 'pending_verification').length,
      suspended: users.filter(u => u.accountStatus === 'suspend').length,
    };
  };

  const tabCounts = getTabCounts();

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('username', {
        header: t('users.username') || 'Username',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('nickname', {
        header: t('users.nickname') || 'Display Name',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('email', {
        header: t('users.email') || 'Email',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('accountStatus', {
        header: t('users.status') || 'Status',
        cell: (info) => createStatusChip(info.getValue(), statusDisplayMap),
        size: 120,
      }),
      columnHelper.accessor('roles', {
        header: t('users.roles') || 'Roles',
        cell: (info) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {info.getValue().map((role) => (
              <Chip
                key={role.id}
                label={role.code}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            ))}
          </Box>
        ),
      }),
      columnHelper.accessor('lastLoginAt', {
        header: t('users.lastLogin') || 'Last Login',
        cell: (info) => {
          const value = info.getValue();
          return value ? new Date(value).toLocaleString() : 'Never';
        },
      }),
      columnHelper.accessor('active', {
        header: t('users.active') || 'Active',
        cell: (info) => (
          <Chip
            label={info.getValue() ? 'Yes' : 'No'}
            size="small"
            color={info.getValue() ? 'success' : 'default'}
          />
        ),
        size: 80,
      }),
    ],
    [t]
  );

  // Action menu items
  const actionMenuItems = [
    {
      label: t('users.actions.view') || 'View',
      icon: <UsersIcon size={16} />,
      action: handleView,
      color: 'info' as const,
    },
    {
      label: t('users.actions.edit') || 'Edit',
      icon: <Shield size={16} />,
      action: handleEdit,
      color: 'primary' as const,
    },
    {
      label: t('users.actions.delete') || 'Delete',
      icon: <Shield size={16} />,
      action: handleDelete,
      color: 'error' as const,
      divider: true,
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      {/* Page heading */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          {t('navigation.users') || t('users.pageTitle') || 'User Management'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('users.export') || 'Export'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload size={18} />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('users.import') || 'Import'}
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleCreate}>
            {t('users.addUser') || 'Add User'}
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Users Card */}
      <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="user tabs"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                py: 2,
                minHeight: 48,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{t('users.tabs.all')}</span>
                  <Chip
                    label={tabCounts.all}
                    size="small"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{t('users.tabs.active')}</span>
                  <Chip
                    label={tabCounts.active}
                    size="small"
                    color="success"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{t('users.tabs.locked')}</span>
                  <Chip
                    label={tabCounts.locked}
                    size="small"
                    color="error"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              {...a11yProps(2)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{t('users.tabs.pending')}</span>
                  <Chip
                    label={tabCounts.pending}
                    size="small"
                    color="warning"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              {...a11yProps(3)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{t('users.tabs.suspended')}</span>
                  <Chip
                    label={tabCounts.suspended}
                    size="small"
                    color="error"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              {...a11yProps(4)}
            />
          </Tabs>
        </Box>

        <CardContent>
          {[0, 1, 2, 3, 4].map((index) => (
            <TabPanel key={index} value={tabIndex} index={index}>
              <DataTable
                data={users}
                columns={columns}
                actionMenuItems={actionMenuItems}
                onRowClick={handleView}
                showSearch={false}
                searchPlaceholder={t('users.searchUsers')}
                manualPagination={true}
                pageCount={pagination?.totalPages ?? 0}
                currentPage={currentPage}
                pageSize={pageSize}
                totalRows={pagination?.totalElements ?? 0}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </TabPanel>
          ))}
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              maxHeight: '95vh',
              minHeight: '80vh',
            }
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            pb: 2, 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            m: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserIcon size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getDialogTitle()}
              </Typography>
              {selectedUser && (
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  {(() => {
                    if (actionType === 'view') return t('users.form.viewUserDetails') || 'View user details';
                    if (actionType === 'edit') return t('users.form.modifyUserInfo') || 'Modify user information';
                    if (actionType === 'delete') return t('users.form.removeUser') || 'Remove user from system';
                    return t('users.form.addNewUser') || 'Add new user to system';
                  })()}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {actionType === 'delete' ? (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: 'error.light',
                    color: 'error.contrastText',
                    display: 'inline-flex'
                  }}
                >
                  <UserIcon size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('users.confirmDeletion')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.actionCannotBeUndone')}
                  </Typography>
                </Box>
              </Box>
              <DialogContentText sx={{ fontSize: '1rem' }}>
                {t('users.deleteConfirmation', { username: selectedUser?.username }) || 
                 `Are you sure you want to delete user "${selectedUser?.username}"? This action cannot be undone.`}
              </DialogContentText>
            </Box>
          ) : (
            <Box>
              {/* General Error Display */}
              {Object.keys(formErrors).length > 0 && (
                <Box sx={{ p: 3, pb: 0 }}>
                  {Object.entries(formErrors).map(([field, errors]) => {
                    // Handle special validation errors that aren't field-specific
                    if (field === 'contactMethodProvided' || field === 'general' || field === '_global') {
                      const errorMessage = Array.isArray(errors) ? errors.join(', ') : errors;
                      return (
                        <Alert severity="error" key={field} sx={{ mb: 2 }}>
                          {errorMessage}
                        </Alert>
                      );
                    }
                    return null;
                  })}
                </Box>
              )}
              
              {/* Form Content */}
              <Box sx={{ p: 4 }}>
                {/* Basic Information Section */}
                <Box 
                  sx={{ 
                    p: 3, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 3,
                    mb: 3,
                    backgroundColor: 'grey.50'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 3, 
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    <UserIcon size={20} />
                    {t('users.basicInformation')}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <TextField
                        label={`${t('users.form.username')} ${actionType !== 'view' ? '*' : ''}`}
                        fullWidth
                        size="medium"
                        value={formData.username}
                        onChange={(e) => handleFormChange('username', e.target.value)}
                        disabled={actionType === 'view'}
                        required={actionType !== 'view'}
                        error={actionType !== 'view' && (!formData.username || hasFieldError('username'))}
                        helperText={(() => {
                          if (actionType === 'view') return '';
                          const fieldError = getFieldError('username');
                          if (fieldError) return fieldError;
                          if (!formData.username) return t('users.form.usernameRequired');
                          return t('users.form.usernameHelper');
                        })()}
                        variant="outlined"
                        sx={{ 
                          width: '100%',
                          '& .MuiInputBase-root': { 
                            height: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }
                        }}
                      />
                    </Grid>
                    
                    {actionType === 'create' && (
                      <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                        <TextField
                          label={`${t('users.form.password')} *`}
                          type="password"
                          fullWidth
                          size="medium"
                          value={formData.password}
                          onChange={(e) => handleFormChange('password', e.target.value)}
                          required
                          error={!formData.password || hasFieldError('password')}
                          helperText={(() => {
                            const fieldError = getFieldError('password');
                            if (fieldError) return fieldError;
                            if (!formData.password) return t('users.form.passwordRequired');
                            return t('users.form.passwordHelper');
                          })()}
                          variant="outlined"
                          sx={{ 
                            width: '100%',
                            '& .MuiInputBase-root': { 
                              height: 48,
                              width: '100%',
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <TextField
                        label={t('users.form.displayName')}
                        fullWidth
                        size="medium"
                        value={formData.nickname}
                        onChange={(e) => handleFormChange('nickname', e.target.value)}
                        disabled={actionType === 'view'}
                        error={hasFieldError('nickname')}
                        helperText={getFieldError('nickname') ?? t('users.form.displayNameHelper')}
                        variant="outlined"
                        sx={{ 
                          width: '100%',
                          '& .MuiInputBase-root': { 
                            height: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Contact Information Section */}
                <Box 
                  sx={{ 
                    p: 3, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 3,
                    mb: 3,
                    backgroundColor: 'grey.50'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 3, 
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    <Mail size={20} />
                    {t('users.contactInformation')}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <TextField
                        label={t('users.form.emailAddress')}
                        type="email"
                        fullWidth
                        size="medium"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        disabled={actionType === 'view'}
                        error={hasFieldError('email')}
                        helperText={getFieldError('email') ?? t('users.form.emailHelper')}
                        variant="outlined"
                        sx={{ 
                          width: '100%',
                          '& .MuiInputBase-root': { 
                            height: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <TextField
                        label={t('users.form.countryCode')}
                        size="medium"
                        fullWidth
                        value={formData.mobileCountryCode}
                        onChange={(e) => handleFormChange('mobileCountryCode', e.target.value)}
                        disabled={actionType === 'view'}
                        placeholder="65"
                        error={hasFieldError('mobileCountryCode')}
                        helperText={getFieldError('mobileCountryCode') ?? t('users.form.countryCodeHelper')}
                        variant="outlined"
                        sx={{ 
                          width: '100%',
                          '& .MuiInputBase-root': { 
                            height: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }
                        }}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                +
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <TextField
                        label={t('users.form.mobileNumber')}
                        fullWidth
                        size="medium"
                        value={formData.mobileNumber}
                        onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
                        disabled={actionType === 'view'}
                        error={hasFieldError('mobileNumber')}
                        helperText={getFieldError('mobileNumber') ?? t('users.form.mobileNumberHelper')}
                        variant="outlined"
                        sx={{ 
                          width: '100%',
                          '& .MuiInputBase-root': { 
                            height: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Account Settings Section */}
                <Box 
                  sx={{ 
                    p: 3, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 3,
                    backgroundColor: 'grey.50'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 3, 
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    <Settings size={20} />
                    Account Settings
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <FormControl fullWidth size="medium" sx={{ width: '100%' }}>
                        <InputLabel>Account Status</InputLabel>
                        <Select
                          value={formData.accountStatus}
                          label="Account Status"
                          onChange={(e) => handleFormChange('accountStatus', e.target.value)}
                          disabled={actionType === 'view'}
                          sx={{ 
                            height: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }}
                        >
                          <MenuItem value="active">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Active" size="small" color="success" />
                              Active
                            </Box>
                          </MenuItem>
                          <MenuItem value="locked">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Locked" size="small" color="error" />
                              Locked
                            </Box>
                          </MenuItem>
                          <MenuItem value="suspend">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Suspended" size="small" color="error" />
                              Suspended
                            </Box>
                          </MenuItem>
                          <MenuItem value="pending_verification">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Pending" size="small" color="warning" />
                              Pending Verification
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <FormControl fullWidth size="medium" sx={{ width: '100%' }}>
                        <InputLabel>User Roles</InputLabel>
                        <Select
                          multiple
                          value={formData.roleCodes}
                          label="User Roles"
                          onChange={(e) => handleFormChange('roleCodes', e.target.value)}
                          disabled={actionType === 'view'}
                          sx={{ 
                            minHeight: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip 
                                  key={value} 
                                  label={value} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined" 
                                />
                              ))}
                            </Box>
                          )}
                        >
                          <MenuItem value="USER">USER</MenuItem>
                          <MenuItem value="ADMIN">ADMIN</MenuItem>
                          <MenuItem value="EDITOR">EDITOR</MenuItem>
                          <MenuItem value="MANAGER">MANAGER</MenuItem>
                          <MenuItem value="ANALYST">ANALYST</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sx={{ width: '100%', display: 'block' }}>
                      <FormControl fullWidth size="medium" sx={{ width: '100%' }}>
                        <InputLabel>Account Active</InputLabel>
                        <Select
                          value={formData.active}
                          label="Account Active"
                          onChange={(e) => handleFormChange('active', e.target.value === 'true')}
                          disabled={actionType === 'view'}
                          sx={{ 
                            height: 48,
                            width: '100%',
                            backgroundColor: 'white'
                          }}
                        >
                          <MenuItem value="true">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Enabled" size="small" color="success" />
                              Yes - User can login
                            </Box>
                          </MenuItem>
                          <MenuItem value="false">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Disabled" size="small" color="default" />
                              No - User cannot login
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <Divider />
        <DialogActions sx={{ p: 3, gap: 2, backgroundColor: 'grey.50' }}>
          <Button 
            onClick={handleCloseDialog} 
            disabled={loading} 
            variant="outlined"
            size="large"
            sx={{ 
              minWidth: 100, 
              py: 1,
              px: 2 
            }}
          >
            {t('common.cancel')}
          </Button>
          {renderActionButtons()}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage;
