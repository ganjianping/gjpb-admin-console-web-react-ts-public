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
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Collapse,
} from '@mui/material';
import { Plus, Shield, Settings, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'; // Initialize role translations
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/components/DataTable';
import { RoleSearchPanel } from '../components';
import { useRoleSearch } from '../hooks';
import type { Role } from '../types/role.types';

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

  // Search functionality
  const {
    searchPanelOpen,
    searchFormData,
    applyClientSideFiltersWithData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
  } = useRoleSearch(mockRoles);

  // Apply search filters
  const filteredRoles = useMemo(() => {
    return applyClientSideFiltersWithData(searchFormData);
  }, [searchFormData, applyClientSideFiltersWithData]);

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
          {t('roles.pageTitle')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
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
              borderColor: 'primary.main',
              color: 'primary.main',
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
            {searchPanelOpen ? t('roles.hideSearch') : t('roles.showSearch')}
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleCreate}>
            {t('roles.addRole')}
          </Button>
        </Box>
      </Box>

      {/* Search Panel */}
      <Box sx={{ mb: 2 }}>
        <Collapse in={searchPanelOpen}>
          <RoleSearchPanel
            searchFormData={searchFormData}
            loading={false}
            onFormChange={handleSearchFormChange}
            onSearch={() => {}}
            onClear={handleClearSearch}
          />
        </Collapse>
      </Box>

      {/* Roles Card */}
      <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <DataTable
            data={filteredRoles}
            columns={columns}
            actionMenuItems={actionMenuItems}
            onRowClick={handleView}
            showSearch={false}
          />
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          pb: 2,
          background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                display: 'inline-flex'
              }}
            >
              <Shield size={24} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getDialogTitle()}
              </Typography>
              {selectedRole && (
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  {(() => {
                    if (actionType === 'view') return t('roles.form.viewRoleDetails');
                    if (actionType === 'edit') return t('roles.form.modifyRoleInfo');
                    if (actionType === 'delete') return t('roles.form.confirmDeletion');
                    return t('roles.form.addNewRole');
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
                  <Shield size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('roles.confirmDeletion') || 'Confirm Deletion'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('roles.actionCannotBeUndone') || 'This action cannot be undone'}
                  </Typography>
                </Box>
              </Box>
              <DialogContentText sx={{ fontSize: '1rem' }}>
                {t('roles.deleteConfirmation', { roleName: selectedRole?.name }) || 
                 `Are you sure you want to delete role "${selectedRole?.name}"? This action cannot be undone.`}
              </DialogContentText>
              {selectedRole?.userCount && selectedRole.userCount > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.dark">
                    {t('roles.deleteWarning', { userCount: selectedRole.userCount }) ||
                     `Warning: This role is assigned to ${selectedRole.userCount} user(s). Deleting it will remove their permissions.`}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              {/* Form Content */}
              <Box sx={{ p: 4 }}>
                {actionType === 'view' ? (
                  // View Mode - Clean Read-only Display
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.roleName') || 'Role Name'}:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {formData.name || '-'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 0.2 }}>
                        {t('roles.form.description') || 'Description'}:
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.5 }}>
                        {formData.description || '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 0.5 }}>
                        {t('roles.form.permissions') || 'Permissions'}:
                      </Typography>
                      {formData.permissions && formData.permissions.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {formData.permissions.map((permission) => (
                            <Chip 
                              key={permission} 
                              label={permission} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No permissions assigned
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.activeStatus') || 'Active Status'}:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={formData.status === 'active' ? 'Active' : 'Inactive'} 
                          size="medium" 
                          color={formData.status === 'active' ? 'success' : 'default'}
                          sx={{ fontWeight: 500 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {formData.status === 'active' ? '(Available for assignment)' : '(Not available for assignment)'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  // Edit/Create Mode - Clean Form Layout
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.roleName') || 'Role Name'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.name ?? ''}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          required
                          variant="outlined"
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
                        {t('roles.form.description') || 'Description'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          rows={3}
                          value={formData.description ?? ''}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          variant="outlined"
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 0.5 }}>
                        {t('roles.form.permissions') || 'Permissions'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <FormControl fullWidth size="small" variant="outlined">
                          <Select
                            multiple
                            value={formData.permissions ?? []}
                            onChange={(e) => handleFormChange('permissions', e.target.value)}
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
                            sx={{ 
                              backgroundColor: 'white'
                            }}
                          >
                            {availablePermissions.map((permission) => (
                              <MenuItem key={permission} value={permission}>
                                {permission}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.activeStatus') || 'Active Status'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.status === 'active'}
                              onChange={(e) => handleFormChange('status', e.target.checked ? 'active' : 'inactive')}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formData.status === 'active' ? 'Active' : 'Inactive'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {formData.status === 'active' ? 'Available for assignment' : 'Not available for assignment'}
                              </Typography>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            size="large"
            sx={{ 
              minWidth: 100, 
              py: 1,
              px: 2 
            }}
          >
            {t('common.close') || 'Close'}
          </Button>
          
          {actionType === 'delete' && (
            <Button 
              variant="contained" 
              color="error" 
              size="large"
              onClick={handleCloseDialog}
              sx={{ 
                minWidth: 100, 
                py: 1,
                px: 2 
              }}
            >
              {t('common.delete') || 'Delete'}
            </Button>
          )}
          
          {(actionType === 'edit' || actionType === 'create') && (
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
              {t('common.save') || 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesPage;
