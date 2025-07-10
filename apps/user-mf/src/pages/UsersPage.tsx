import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  InputAdornment,
  Collapse,
  FormLabel,
} from '@mui/material';
import { Plus, Users as UsersIcon, Shield, User as UserIcon, Search, ChevronDown, ChevronUp } from 'lucide-react';
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

// Search form data interface
interface SearchFormData {
  username: string;
  email: string;
  accountStatus: AccountStatus | '';
  roleCode: string;
  active: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search panel state
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({
    username: '',
    email: '',
    accountStatus: '',
    roleCode: '',
    active: '',
  });
  
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
  const [pageSize, setPageSize] = useState(20);

  // Load users data
  const loadUsers = useCallback(async (params?: UserQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: UserQueryParams = {
        page: currentPage,
        size: pageSize,
        sort: 'updatedAt',
        direction: 'desc',
        ...params,
      };

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
  }, [currentPage, pageSize, t]);

  // Load users on component mount and when dependencies change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle search panel toggle
  const handleSearchPanelToggle = () => {
    setSearchPanelOpen(!searchPanelOpen);
  };

  // Handle search form changes
  const handleSearchFormChange = (field: keyof SearchFormData, value: any) => {
    setSearchFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle search
  const handleSearch = () => {
    const searchParams: UserQueryParams = {};
    
    if (searchFormData.username) searchParams.username = searchFormData.username;
    if (searchFormData.email) searchParams.email = searchFormData.email;
    if (searchFormData.accountStatus) searchParams.accountStatus = searchFormData.accountStatus as AccountStatus;
    if (searchFormData.roleCode) searchParams.roleCode = searchFormData.roleCode;
    if (searchFormData.active !== '') {
      searchParams.active = searchFormData.active === 'true';
    }
    
    setCurrentPage(0); // Reset to first page when searching
    loadUsers(searchParams);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchFormData({
      username: '',
      email: '',
      accountStatus: '',
      roleCode: '',
      active: '',
    });
    setCurrentPage(0);
    loadUsers(); // Load all users without filters
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
          disabled={loading}
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

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('username', {
        header: t('users.username') || 'Username',
        cell: (info) => info.getValue(),
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

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="outlined"
            startIcon={<Search size={16} />}
            endIcon={searchPanelOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            onClick={handleSearchPanelToggle}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              borderColor: searchPanelOpen ? 'primary.main' : 'primary.main',
              color: searchPanelOpen ? 'primary.main' : 'primary.main',
              backgroundColor: searchPanelOpen 
                ? 'rgba(25, 118, 210, 0.08)' 
                : 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: searchPanelOpen 
                ? '0 2px 8px rgba(25, 118, 210, 0.15)' 
                : '0 1px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: searchPanelOpen 
                  ? 'rgba(25, 118, 210, 0.12)' 
                  : 'rgba(25, 118, 210, 0.04)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              },
              '& .MuiButton-endIcon': {
                marginLeft: 1,
                transition: 'transform 0.2s ease',
                transform: searchPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              },
            }}
          >
            {searchPanelOpen ? 'Hide Search' : 'Search'}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Plus size={16} />} 
            onClick={handleCreate}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              backgroundColor: 'primary.main',
              color: 'white',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
              },
              '&:active': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(0px)',
              },
            }}
          >
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

      {/* Search Panel */}
      <Collapse in={searchPanelOpen}>
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            background: 'rgba(25, 118, 210, 0.02)',
            border: '1px solid',
            borderColor: 'rgba(25, 118, 210, 0.12)',
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              zIndex: 1,
            }
          }}
        >
          <CardContent sx={{ position: 'relative', zIndex: 2, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: '1rem',
                  '& svg': {
                    color: 'primary.main',
                  }
                }}
              >
                <Search size={18} />
                Search Filters
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Search size={16} />}
                  onClick={handleSearch}
                  disabled={loading}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 0.8,
                    fontWeight: 600,
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    },
                    '&:active': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(0px)',
                    },
                    '&:disabled': {
                      backgroundColor: 'grey.400',
                      color: 'white',
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleClearSearch}
                  disabled={loading}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 0.8,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                    },
                    '&:disabled': {
                      borderColor: 'grey.300',
                      color: 'grey.400',
                      transform: 'none',
                    },
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: 2, 
              mt: 1,
              '& .MuiFormLabel-root': {
                fontWeight: 500,
                color: 'text.primary',
                fontSize: '0.875rem',
                mb: 0.8,
                display: 'block',
              },
              '& .MuiTextField-root': {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                },
              },
            }}>
              <Box>
                <FormLabel>Username</FormLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by username"
                  value={searchFormData.username}
                  onChange={(e) => handleSearchFormChange('username', e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Email</FormLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by email"
                  value={searchFormData.email}
                  onChange={(e) => handleSearchFormChange('email', e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Status</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchFormData.accountStatus}
                    onChange={(e) => handleSearchFormChange('accountStatus', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="locked">Locked</MenuItem>
                    <MenuItem value="suspend">Suspended</MenuItem>
                    <MenuItem value="pending_verification">Pending Verification</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormLabel>Role</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchFormData.roleCode}
                    onChange={(e) => handleSearchFormChange('roleCode', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="EDITOR">EDITOR</MenuItem>
                    <MenuItem value="MANAGER">MANAGER</MenuItem>
                    <MenuItem value="ANALYST">ANALYST</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormLabel>Active</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchFormData.active}
                    onChange={(e) => handleSearchFormChange('active', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Users Card */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          border: '2px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <CardContent>
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
                {actionType === 'view' ? (
                  // View Mode - Clean Read-only Display
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.id')}:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {selectedUser?.id || '-'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.username')}:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {formData.username || '-'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.nickName')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {formData.nickname || '-'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.emailAddress')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {formData.email || '-'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.mobileNumber')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {formData.mobileCountryCode && formData.mobileNumber 
                          ? `+${formData.mobileCountryCode} ${formData.mobileNumber}`
                          : formData.mobileNumber || '-'
                        }
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        Account Status:
                      </Typography>
                      <Chip 
                        label={statusDisplayMap[formData.accountStatus]?.label || formData.accountStatus} 
                        size="medium" 
                        color={statusDisplayMap[formData.accountStatus]?.color || 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 0.5 }}>
                        User Roles:
                      </Typography>
                      {formData.roleCodes && formData.roleCodes.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {formData.roleCodes.map((role) => (
                            <Chip 
                              key={role} 
                              label={role} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No roles assigned
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        Account Active:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={formData.active ? 'Enabled' : 'Disabled'} 
                          size="medium" 
                          color={formData.active ? 'success' : 'default'}
                          sx={{ fontWeight: 500 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {formData.active ? '(User can login)' : '(User cannot login)'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.lastLoginAt')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {selectedUser?.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.lastLoginIp')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {selectedUser?.lastLoginIp || '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.passwordChangeAt')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {selectedUser?.passwordChangedAt ? new Date(selectedUser.passwordChangedAt).toLocaleString() : '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.createdAt')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.updatedAt')}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {selectedUser?.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : '-'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  // Edit/Create Mode - Clean Form Layout
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.username')}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.username}
                          onChange={(e) => handleFormChange('username', e.target.value)}
                          required
                          error={hasFieldError('username')}
                          helperText={getFieldError('username')}
                          variant="outlined"
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    
                    {actionType === 'create' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                          {t('users.form.password')}:
                        </Typography>
                        <Box sx={{ flex: 1, ml: 2 }}>
                          <TextField
                            type="password"
                            fullWidth
                            size="small"
                            value={formData.password}
                            onChange={(e) => handleFormChange('password', e.target.value)}
                            required
                            error={hasFieldError('password')}
                            helperText={getFieldError('password')}
                            variant="outlined"
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                backgroundColor: 'white'
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.nickName')}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.nickname}
                          onChange={(e) => handleFormChange('nickname', e.target.value)}
                          error={hasFieldError('nickname')}
                          helperText={getFieldError('nickname')}
                          variant="outlined"
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.emailAddress')}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          type="email"
                          fullWidth
                          size="small"
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          error={hasFieldError('email')}
                          helperText={getFieldError('email')}
                          variant="outlined"
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('users.form.mobileNumber')}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2, display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          value={formData.mobileCountryCode}
                          onChange={(e) => handleFormChange('mobileCountryCode', e.target.value)}
                          placeholder="65"
                          error={hasFieldError('mobileCountryCode')}
                          helperText={getFieldError('mobileCountryCode')}
                          variant="outlined"
                          sx={{ 
                            width: 100,
                            '& .MuiInputBase-root': { 
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
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.mobileNumber}
                          onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
                          placeholder="Mobile number"
                          error={hasFieldError('mobileNumber')}
                          helperText={getFieldError('mobileNumber')}
                          variant="outlined"
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        Account Status:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={formData.accountStatus}
                            onChange={(e) => handleFormChange('accountStatus', e.target.value)}
                            sx={{ 
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
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 0.5 }}>
                        User Roles:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            multiple
                            value={formData.roleCodes}
                            onChange={(e) => handleFormChange('roleCodes', e.target.value)}
                            sx={{ 
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
                                    sx={{ fontWeight: 500 }}
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
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        Account Active:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={formData.active}
                            onChange={(e) => handleFormChange('active', e.target.value === 'true')}
                            sx={{ 
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
                      </Box>
                    </Box>
                  </Box>
                )}
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
