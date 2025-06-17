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
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
import { Plus, Users as UsersIcon, Shield, Download, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, tabIndex]);

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
          setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
          handleCloseDialog();
          await loadUsers();
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
          setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
          handleCloseDialog();
          await loadUsers();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save user';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
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
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        handleCloseDialog();
        await loadUsers();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get dialog title
  const getDialogTitle = () => {
    if (actionType === 'view') return t('users.viewUser');
    if (actionType === 'edit') return t('users.editUser');
    if (actionType === 'create') return t('users.createUser');
    return t('users.deleteUser');
  };

  // Helper to render dialog action buttons
  const renderActionButtons = () => {
    if (actionType === 'delete') {
      return (
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleConfirmDelete}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : t('common.delete')}
        </Button>
      );
    }
    
    if (actionType === 'edit' || actionType === 'create') {
      return (
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={loading || !formData.username || (actionType === 'create' && !formData.password)}
        >
          {loading ? <CircularProgress size={20} /> : t('common.save')}
        </Button>
      );
    }
    
    return (
      <Button variant="contained" onClick={handleCloseDialog}>
        {t('common.close')}
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
        header: t('users.username'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('nickname', {
        header: t('users.nickname'),
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('email', {
        header: t('users.email'),
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('accountStatus', {
        header: t('users.status'),
        cell: (info) => createStatusChip(info.getValue(), statusDisplayMap),
        size: 120,
      }),
      columnHelper.accessor('roles', {
        header: t('users.roles'),
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
        header: t('users.lastLogin'),
        cell: (info) => {
          const value = info.getValue();
          return value ? new Date(value).toLocaleString() : 'Never';
        },
      }),
      columnHelper.accessor('active', {
        header: t('users.active'),
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
      label: t('users.actions.view'),
      icon: <UsersIcon size={16} />,
      action: handleView,
      color: 'info' as const,
    },
    {
      label: t('users.actions.edit'),
      icon: <Shield size={16} />,
      action: handleEdit,
      color: 'primary' as const,
    },
    {
      label: t('users.actions.delete'),
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
          {t('navigation.users')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('users.export')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload size={18} />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('users.import')}
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleCreate}>
            {t('users.addUser')}
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
                pageCount={pagination?.totalPages || 0}
                currentPage={currentPage}
                pageSize={pageSize}
                totalRows={pagination?.totalElements || 0}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </TabPanel>
          ))}
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {getDialogTitle()}
        </DialogTitle>
        <DialogContent>
          {actionType === 'delete' ? (
            <DialogContentText>
              {t('users.deleteConfirmation', { username: selectedUser?.username })}
            </DialogContentText>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Grid container component="div" spacing={3}>
                <Grid item component="div" xs={12} sm={6}>
                  <TextField
                    label={`${t('users.username')} *`}
                    fullWidth
                    value={formData.username}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    disabled={actionType === 'view'}
                    required
                  />
                </Grid>
                {actionType === 'create' && (
                  <Grid item component="div" xs={12} sm={6}>
                    <TextField
                      label={`${t('users.password')} *`}
                      type="password"
                      fullWidth
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      required
                    />
                  </Grid>
                )}
                <Grid item component="div" xs={12} sm={6}>
                  <TextField
                    label={t('users.nickname')}
                    fullWidth
                    value={formData.nickname}
                    onChange={(e) => handleFormChange('nickname', e.target.value)}
                    disabled={actionType === 'view'}
                  />
                </Grid>
                <Grid item component="div" xs={12} sm={6}>
                  <TextField
                    label={t('users.email')}
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    disabled={actionType === 'view'}
                  />
                </Grid>
                <Grid item component="div" xs={12} sm={6}>
                  <TextField
                    label={t('users.mobileCountryCode')}
                    fullWidth
                    value={formData.mobileCountryCode}
                    onChange={(e) => handleFormChange('mobileCountryCode', e.target.value)}
                    disabled={actionType === 'view'}
                    placeholder="65"
                  />
                </Grid>
                <Grid item component="div" xs={12} sm={6}>
                  <TextField
                    label={t('users.mobileNumber')}
                    fullWidth
                    value={formData.mobileNumber}
                    onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
                    disabled={actionType === 'view'}
                  />
                </Grid>
                <Grid item component="div" xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t('users.status')}</InputLabel>
                    <Select
                      value={formData.accountStatus}
                      label={t('users.status')}
                      onChange={(e) => handleFormChange('accountStatus', e.target.value)}
                      disabled={actionType === 'view'}
                    >
                      <MenuItem value="active">{statusDisplayMap.active.label}</MenuItem>
                      <MenuItem value="locked">{statusDisplayMap.locked.label}</MenuItem>
                      <MenuItem value="suspend">{statusDisplayMap.suspend.label}</MenuItem>
                      <MenuItem value="pending_verification">{statusDisplayMap.pending_verification.label}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item component="div" xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t('users.roles')}</InputLabel>
                    <Select
                      multiple
                      value={formData.roleCodes}
                      label={t('users.roles')}
                      onChange={(e) => handleFormChange('roleCodes', e.target.value)}
                      disabled={actionType === 'view'}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
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
                <Grid item component="div" xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t('users.active')}</InputLabel>
                    <Select
                      value={formData.active}
                      label={t('users.active')}
                      onChange={(e) => handleFormChange('active', e.target.value === 'true')}
                      disabled={actionType === 'view'}
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
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
