import { useState, useEffect, useMemo } from 'react';
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
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
import { Plus, Users as UsersIcon, Shield, Download, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DataTable, createColumnHelper, createStatusChip } from '../../../shared-lib/src/components/DataTable';

// Redux
import { useAppDispatch } from '../hooks/useRedux';
import { setPageTitle } from '../redux/slices/uiSlice';

// Mock user data
type User = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  roles: string[];
  lastLogin: string;
  createdAt: string;
};

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'Admin User',
    status: 'active',
    roles: ['ADMIN'],
    lastLogin: '2025-06-06T08:30:00Z',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    username: 'jdoe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    status: 'active',
    roles: ['USER', 'EDITOR'],
    lastLogin: '2025-06-05T14:15:00Z',
    createdAt: '2024-02-20T11:30:00Z',
  },
  {
    id: '3',
    username: 'jsmith',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    status: 'suspended',
    roles: ['USER'],
    lastLogin: '2025-05-20T09:45:00Z',
    createdAt: '2024-03-15T15:20:00Z',
  },
  {
    id: '4',
    username: 'rwilson',
    email: 'robert.wilson@example.com',
    fullName: 'Robert Wilson',
    status: 'pending',
    roles: ['USER'],
    lastLogin: '',
    createdAt: '2025-06-01T10:00:00Z',
  },
  {
    id: '5',
    username: 'ebrown',
    email: 'emily.brown@example.com',
    fullName: 'Emily Brown',
    status: 'inactive',
    roles: ['USER', 'ANALYST'],
    lastLogin: '2025-04-10T16:30:00Z',
    createdAt: '2024-05-05T08:15:00Z',
  },
  {
    id: '6',
    username: 'mjones',
    email: 'michael.jones@example.com',
    fullName: 'Michael Jones',
    status: 'active',
    roles: ['USER', 'MANAGER'],
    lastLogin: '2025-06-05T11:20:00Z',
    createdAt: '2024-04-18T13:45:00Z',
  },
  {
    id: '7',
    username: 'swilliams',
    email: 'sarah.williams@example.com',
    fullName: 'Sarah Williams',
    status: 'active',
    roles: ['USER'],
    lastLogin: '2025-06-04T17:10:00Z',
    createdAt: '2024-02-28T09:30:00Z',
  },
];

// Column helper
const columnHelper = createColumnHelper<User>();

// Status chip definition
const userStatusMap = {
  active: { label: 'Active', color: 'success' as const },
  inactive: { label: 'Inactive', color: 'default' as const },
  suspended: { label: 'Suspended', color: 'error' as const },
  pending: { label: 'Pending', color: 'warning' as const },
};

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
function TabPanel(props: TabPanelProps) {
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

const UsersPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'delete' | null>(null);

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle(t('navigation.users')));
  }, [dispatch, t]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // User actions
  const handleView = (user: User) => {
    setSelectedUser(user);
    setActionType('view');
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setActionType('edit');
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
  };

  // Filter users based on tab
  const filteredUsers = useMemo(() => {
    switch (tabIndex) {
      case 0: // All Users
        return mockUsers;
      case 1: // Active
        return mockUsers.filter((user) => user.status === 'active');
      case 2: // Inactive
        return mockUsers.filter((user) => user.status === 'inactive');
      case 3: // Pending
        return mockUsers.filter((user) => user.status === 'pending');
      default:
        return mockUsers;
    }
  }, [tabIndex]);

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('username', {
        header: t('users.username'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('fullName', {
        header: t('users.fullName'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('email', {
        header: t('users.email'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: t('users.status'),
        cell: (info) => createStatusChip(info.getValue(), userStatusMap),
        size: 120,
      }),
      columnHelper.accessor('roles', {
        header: t('users.roles'),
        cell: (info) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {info.getValue().map((role) => (
              <Chip
                key={role}
                label={role}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            ))}
          </Box>
        ),
      }),
      columnHelper.accessor('lastLogin', {
        header: t('users.lastLogin'),
        cell: (info) => {
          const value = info.getValue();
          return value ? new Date(value).toLocaleString() : 'Never';
        },
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
          <Button variant="contained" startIcon={<Plus size={18} />}>
            {t('users.addUser')}
          </Button>
        </Box>
      </Box>

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
                    label={mockUsers.length}
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
                    label={mockUsers.filter((user) => user.status === 'active').length}
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
                  <span>{t('users.tabs.inactive')}</span>
                  <Chip
                    label={mockUsers.filter((user) => user.status === 'inactive').length}
                    size="small"
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
                    label={mockUsers.filter((user) => user.status === 'pending').length}
                    size="small"
                    color="warning"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        <CardContent>
          {/* All Users Tab */}
          <TabPanel value={tabIndex} index={0}>
            <DataTable
              data={filteredUsers}
              columns={columns}
              actionMenuItems={actionMenuItems}
              onRowClick={handleView}
              showSearch
              searchPlaceholder={t('users.searchUsers')}
            />
          </TabPanel>

          {/* Active Users Tab */}
          <TabPanel value={tabIndex} index={1}>
            <DataTable
              data={filteredUsers}
              columns={columns}
              actionMenuItems={actionMenuItems}
              onRowClick={handleView}
              showSearch
              searchPlaceholder={t('users.searchUsers')}
            />
          </TabPanel>

          {/* Inactive Users Tab */}
          <TabPanel value={tabIndex} index={2}>
            <DataTable
              data={filteredUsers}
              columns={columns}
              actionMenuItems={actionMenuItems}
              onRowClick={handleView}
              showSearch
              searchPlaceholder={t('users.searchUsers')}
            />
          </TabPanel>

          {/* Pending Users Tab */}
          <TabPanel value={tabIndex} index={3}>
            <DataTable
              data={filteredUsers}
              columns={columns}
              actionMenuItems={actionMenuItems}
              onRowClick={handleView}
              showSearch
              searchPlaceholder={t('users.searchUsers')}
            />
          </TabPanel>
        </CardContent>
      </Card>

      {/* User Dialog */}
      {selectedUser && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {actionType === 'view'
              ? t('users.viewUser')
              : actionType === 'edit'
              ? t('users.editUser')
              : t('users.deleteUser')}
          </DialogTitle>
          <DialogContent>
            {actionType === 'delete' ? (
              <DialogContentText>
                {t('users.deleteConfirmation', { username: selectedUser.username })}
              </DialogContentText>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Grid container component="div" spacing={3}>
                  <Grid item component="div" xs={12} sm={6}>
                    <TextField
                      label={t('users.username')}
                      fullWidth
                      value={selectedUser.username}
                      disabled={actionType === 'view'}
                    />
                  </Grid>
                  <Grid item component="div" xs={12} sm={6}>
                    <TextField
                      label={t('users.email')}
                      type="email"
                      fullWidth
                      value={selectedUser.email}
                      disabled={actionType === 'view'}
                    />
                  </Grid>
                  <Grid item component="div" xs={12}>
                    <TextField
                      label={t('users.fullName')}
                      fullWidth
                      value={selectedUser.fullName}
                      disabled={actionType === 'view'}
                    />
                  </Grid>
                  <Grid item component="div" xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('users.status')}</InputLabel>
                      <Select
                        value={selectedUser.status}
                        label={t('users.status')}
                        disabled={actionType === 'view'}
                      >
                        <MenuItem value="active">{userStatusMap.active.label}</MenuItem>
                        <MenuItem value="inactive">{userStatusMap.inactive.label}</MenuItem>
                        <MenuItem value="suspended">{userStatusMap.suspended.label}</MenuItem>
                        <MenuItem value="pending">{userStatusMap.pending.label}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item component="div" xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('users.roles')}</InputLabel>
                      <Select
                        multiple
                        value={selectedUser.roles}
                        label={t('users.roles')}
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
                        <MenuItem value="EDITOR">EDITOR</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="MANAGER">MANAGER</MenuItem>
                        <MenuItem value="ANALYST">ANALYST</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
            {actionType === 'delete' ? (
              <Button variant="contained" color="error" onClick={handleCloseDialog}>
                {t('common.delete')}
              </Button>
            ) : actionType === 'edit' ? (
              <Button variant="contained" onClick={handleCloseDialog}>
                {t('common.save')}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleCloseDialog}>
                {t('common.close')}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default UsersPage;
