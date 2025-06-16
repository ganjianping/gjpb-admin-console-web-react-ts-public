import { useState, useMemo } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Grid } from '../../../shared-lib/src/utils/grid';
import { Plus, Shield, Settings, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DataTable, createColumnHelper, createStatusChip } from '../../../shared-lib/src/components/DataTable';

// Mock role data
type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: 'active' | 'inactive';
  userCount: number;
  createdAt: string;
  updatedAt: string;
};

// Mock roles data
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'ADMIN',
    description: 'Full system administrator with all permissions',
    permissions: ['READ_USERS', 'WRITE_USERS', 'DELETE_USERS', 'MANAGE_ROLES', 'SYSTEM_CONFIG'],
    status: 'active',
    userCount: 2,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    name: 'MANAGER',
    description: 'Team manager with user management permissions',
    permissions: ['READ_USERS', 'WRITE_USERS', 'MANAGE_TEAM'],
    status: 'active',
    userCount: 3,
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  {
    id: '3',
    name: 'EDITOR',
    description: 'Content editor with content management permissions',
    permissions: ['READ_CONTENT', 'WRITE_CONTENT', 'PUBLISH_CONTENT'],
    status: 'active',
    userCount: 5,
    createdAt: '2024-03-01T14:20:00Z',
    updatedAt: '2024-03-01T14:20:00Z',
  },
  {
    id: '4',
    name: 'USER',
    description: 'Basic user with read-only permissions',
    permissions: ['READ_CONTENT'],
    status: 'active',
    userCount: 12,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '5',
    name: 'ANALYST',
    description: 'Data analyst with reporting permissions',
    permissions: ['READ_DATA', 'GENERATE_REPORTS', 'VIEW_ANALYTICS'],
    status: 'inactive',
    userCount: 0,
    createdAt: '2024-04-05T11:15:00Z',
    updatedAt: '2024-04-05T11:15:00Z',
  },
];

// Available permissions
const availablePermissions = [
  'READ_USERS',
  'WRITE_USERS',
  'DELETE_USERS',
  'MANAGE_ROLES',
  'SYSTEM_CONFIG',
  'READ_CONTENT',
  'WRITE_CONTENT',
  'PUBLISH_CONTENT',
  'READ_DATA',
  'GENERATE_REPORTS',
  'VIEW_ANALYTICS',
  'MANAGE_TEAM',
];

// Column helper
const columnHelper = createColumnHelper<Role>();

// Status chip definition
const roleStatusMap = {
  active: { label: 'Active', color: 'success' as const },
  inactive: { label: 'Inactive', color: 'default' as const },
};

const RolesPage = () => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'delete' | 'create' | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
    status: 'active',
  });

  // Role actions
  const handleView = (role: Role) => {
    setSelectedRole(role);
    setFormData(role);
    setActionType('view');
    setDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData(role);
    setActionType('edit');
    setDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setActionType('delete');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
      status: 'active',
    });
    setActionType('create');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRole(null);
    setActionType(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
      status: 'active',
    });
  };

  const handleFormChange = (field: keyof Role, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('roles.name'),
        cell: (info) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield size={16} />
            <Typography variant="body2" fontWeight="medium">
              {info.getValue()}
            </Typography>
          </Box>
        ),
      }),
      columnHelper.accessor('description', {
        header: t('roles.description'),
        cell: (info) => (
          <Typography variant="body2" color="text.secondary">
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor('permissions', {
        header: t('roles.permissions'),
        cell: (info) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 300 }}>
            {info.getValue().slice(0, 3).map((permission) => (
              <Chip
                key={permission}
                label={permission}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: '0.7rem' }}
              />
            ))}
            {info.getValue().length > 3 && (
              <Chip
                label={`+${info.getValue().length - 3} more`}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        ),
      }),
      columnHelper.accessor('userCount', {
        header: t('roles.userCount'),
        cell: (info) => (
          <Chip
            label={info.getValue()}
            size="small"
            color={info.getValue() > 0 ? 'primary' : 'default'}
            sx={{ fontWeight: 500 }}
          />
        ),
        size: 100,
      }),
      columnHelper.accessor('status', {
        header: t('roles.status'),
        cell: (info) => createStatusChip(info.getValue(), roleStatusMap),
        size: 120,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('roles.lastUpdated'),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        size: 120,
      }),
    ],
    [t]
  );

  // Action menu items
  const actionMenuItems = [
    {
      label: t('roles.actions.view'),
      icon: <Shield size={16} />,
      action: handleView,
      color: 'info' as const,
    },
    {
      label: t('roles.actions.edit'),
      icon: <Settings size={16} />,
      action: handleEdit,
      color: 'primary' as const,
    },
    {
      label: t('roles.actions.delete'),
      icon: <Shield size={16} />,
      action: handleDelete,
      color: 'error' as const,
      divider: true,
    },
  ];

  const getDialogTitle = () => {
    switch (actionType) {
      case 'view': return t('roles.viewRole');
      case 'edit': return t('roles.editRole');
      case 'create': return t('roles.createRole');
      case 'delete': return t('roles.deleteRole');
      default: return '';
    }
  };

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
          {t('navigation.roles')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('roles.export')}
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleCreate}>
            {t('roles.addRole')}
          </Button>
        </Box>
      </Box>

      {/* Roles Card */}
      <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <DataTable
            data={mockRoles}
            columns={columns}
            actionMenuItems={actionMenuItems}
            onRowClick={handleView}
            showSearch
            searchPlaceholder={t('roles.searchRoles')}
          />
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          {actionType === 'delete' ? (
            <DialogContentText>
              {t('roles.deleteConfirmation', { roleName: selectedRole?.name })}
              {selectedRole?.userCount && selectedRole.userCount > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.dark">
                    {t('roles.deleteWarning', { userCount: selectedRole.userCount })}
                  </Typography>
                </Box>
              )}
            </DialogContentText>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Grid container component="div" spacing={3}>
                <Grid item component="div" xs={12} sm={6}>
                  <TextField
                    label={t('roles.name')}
                    fullWidth
                    value={formData.name || ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    disabled={actionType === 'view'}
                    required
                  />
                </Grid>
                <Grid item component="div" xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.status === 'active'}
                          onChange={(e) => handleFormChange('status', e.target.checked ? 'active' : 'inactive')}
                          disabled={actionType === 'view'}
                        />
                      }
                      label={t('roles.active')}
                    />
                  </FormControl>
                </Grid>
                <Grid item component="div" xs={12}>
                  <TextField
                    label={t('roles.description')}
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    disabled={actionType === 'view'}
                  />
                </Grid>
                <Grid item component="div" xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t('roles.permissions')}</InputLabel>
                    <Select
                      multiple
                      value={formData.permissions || []}
                      label={t('roles.permissions')}
                      onChange={(e) => handleFormChange('permissions', e.target.value)}
                      disabled={actionType === 'view'}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {availablePermissions.map((permission) => (
                        <MenuItem key={permission} value={permission}>
                          {permission}
                        </MenuItem>
                      ))}
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
          ) : actionType === 'edit' || actionType === 'create' ? (
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
    </Box>
  );
};

export default RolesPage;
