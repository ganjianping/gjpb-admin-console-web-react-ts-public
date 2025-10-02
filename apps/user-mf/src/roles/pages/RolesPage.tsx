import { useState, useMemo, useEffect } from 'react';
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
  FormControlLabel,
  Switch,
  Collapse,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import { Plus, Shield, Settings, Search, ChevronDown, ChevronUp, ChevronRight, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../config/i18n.config'; // Initialize role translations
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/components/DataTable';
import { RoleSearchPanel } from '../components';
import { useRoleSearch } from '../hooks';
import { roleService } from '../services';
import type { Role } from '../types/role.types';

// Column helper
const columnHelper = createColumnHelper<Role>();

// Status chip definition
const roleStatusMap = {
  active: { label: 'Active', color: 'success' as const },
  inactive: { label: 'Inactive', color: 'default' as const },
};

const RolesPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'delete' | 'create' | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    status: 'active',
    code: '',
    sortOrder: 0,
    level: 0,
    parentRoleId: null,
    systemRole: false,
  });
  
  // Error handling state
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string[] | string>>({});
  const [dialogErrorMessage, setDialogErrorMessage] = useState<string>('');

  // Debug dialog state changes
  useEffect(() => {
    console.log('🔍 Dialog state changed:', { dialogOpen, actionType });
  }, [dialogOpen, actionType]);

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
      status: 'active',
      code: '',
      sortOrder: 0,
      level: 0,
      parentRoleId: null,
      systemRole: false,
    });
    setActionType('create');
    setDialogOpen(true);
  };

  const handleAddChildRole = (parentRole: Role) => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      status: 'active',
      code: '',
      sortOrder: 0,
      level: (parentRole.level || 0) + 1,
      parentRoleId: parentRole.id,
      systemRole: false,
    });
    setActionType('create');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('🔒 Closing dialog, current state:', { dialogOpen, actionType });
    setDialogOpen(false);
    setSelectedRole(null);
    setActionType(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      status: 'active',
      level: 0,
      sortOrder: 0,
      systemRole: false,
      parentRoleId: null,
    });
    setFormErrors({});
    setDialogErrorMessage('');
    console.log('🔒 Dialog close function completed');
  };

  const handleFormChange = (field: keyof Role, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Helper functions for error handling (similar to UserDialog)
  const getErrorMessage = (field: string) => {
    const error = formErrors[field];
    if (Array.isArray(error)) {
      return error.join(', ');
    } else if (error) {
      return String(error);
    }
    return '';
  };

  const hasError = (field: string) => {
    return Boolean(formErrors[field]);
  };

  // Get general errors that don't map to specific fields
  const getGeneralErrors = () => {
    const generalErrors = [];
    
    // Check for general error
    if (formErrors.general) {
      generalErrors.push(formErrors.general);
    }
    
    // Check for any other general errors that don't have field mapping
    const fieldNames = ['code', 'name', 'description', 'level', 'sortOrder', 'parentRoleId', 'general'];
    Object.keys(formErrors).forEach(key => {
      if (!fieldNames.includes(key)) {
        generalErrors.push(formErrors[key]);
      }
    });
    
    return generalErrors;
  };

  // Helper function to process API errors (similar to UserDialog)
  const processApiErrors = (apiErrors: any): Record<string, string | string[]> => {
    console.log('Processing Role API errors - raw input:', JSON.stringify(apiErrors, null, 2));
    const formattedErrors: Record<string, string | string[]> = {};
    
    if (apiErrors && typeof apiErrors === 'object') {
      // Handle the errors object directly (as shown in the API response)
      Object.keys(apiErrors).forEach(key => {
        const value = apiErrors[key];
        console.log(`Processing role error for key "${key}":`, value);
        
        // Map field-specific errors directly for all role fields
        if (['code', 'name', 'description', 'level', 'sortOrder', 'parentRoleId'].includes(key)) {
          formattedErrors[key] = Array.isArray(value) ? value : String(value);
          console.log(`✅ Mapped role field error: ${key} -> ${formattedErrors[key]}`);
        } else {
          // For non-field-specific errors, add as general error
          formattedErrors.general = Array.isArray(value) ? value : String(value);
          console.log(`⚠️ Mapped role general error: ${key} -> ${formattedErrors.general}`);
        }
      });
    }
    
    console.log('Final formatted role errors:', formattedErrors);
    return formattedErrors;
  };

  const handleSave = async () => {
    try {
      // Clear previous errors
      setFormErrors({});
      setDialogErrorMessage('');
      
      if (actionType === 'create') {
        // Create new role
        const createData = {
          code: formData.code || '',
          name: formData.name || '',
          description: formData.description || '',
          sortOrder: formData.sortOrder || 0,
          level: formData.level || 0,
          parentRoleId: formData.parentRoleId || undefined,
          active: formData.status === 'active',
        };
        
        // Call the role service to create the role
        console.log('🚀 Creating role:', createData);
        const response = await roleService.createRole(createData);
        console.log('🚀 API Response received:', response);
        console.log('🚀 Response status code:', response.status.code);
        console.log('🚀 Response status errors:', response.status.errors);
        
        if (response.status.code === 200 || response.status.code === 201) {
          console.log('✅ Create success - closing dialog immediately');
          
          // If creating a child role, prioritize the parent in the list
          if (formData.parentRoleId) {
            console.log('🔼 Setting priority parent:', formData.parentRoleId);
            setPriorityParent(formData.parentRoleId);
          }
          
          // Show success message first
          setSuccessMessage(t('roles.messages.createSuccess') || 'Role created successfully');
          setShowSuccessSnackbar(true);
          
          // Close dialog with setTimeout to ensure it works
          setTimeout(() => {
            console.log('🔒 Closing dialog after timeout');
            setDialogOpen(false);
            setSelectedRole(null);
            setActionType(null);
            setFormData({
              code: '',
              name: '',
              description: '',
              status: 'active',
              level: 0,
              sortOrder: 0,
              systemRole: false,
              parentRoleId: null,
            });
            setFormErrors({});
            setDialogErrorMessage('');
            handleSearchPanelClose();
          }, 10);
          
          // Refresh the list after a longer delay
          setTimeout(async () => {
            try {
              await handleSearch(0);
              // Clear priority parent after refresh to return to normal sorting
              if (formData.parentRoleId) {
                setTimeout(() => {
                  console.log('🔽 Clearing priority parent after refresh');
                  clearPriorityParent();
                }, 1000);
              }
            } catch (error) {
              console.error('Error refreshing roles after create:', error);
            }
          }, 500);
          
          // Early return to avoid any further processing
          return;
        } else {
          // Handle API errors
          console.log('🚨 API Error Response - Full Response:', JSON.stringify(response, null, 2));
          let errorMsg = response.status.message || 'Failed to create role';
          console.log('🚨 Error message:', errorMsg);
          
          // Extract field-specific validation errors using processApiErrors
          if (response.status.errors && typeof response.status.errors === 'object') {
            console.log('🚨 API errors received:', response.status.errors); // Debug log
            console.log('🚨 Type of status.errors:', typeof response.status.errors);
            console.log('🚨 Processing errors with processApiErrors...');
            const processedErrors = processApiErrors(response.status.errors);
            console.log('🚨 Processed errors result:', processedErrors);
            
            if (Object.keys(processedErrors).length > 0) {
              console.log('🚨 Setting form errors:', processedErrors);
              setFormErrors(processedErrors);
              // Show general validation error in dialog if there are field errors
              setDialogErrorMessage(t('roles.messages.validationError') || 'Please correct the errors below');
            } else {
              console.log('🚨 No processed errors, showing general error');
              // If no field-specific errors, show general error
              setErrorMessage(errorMsg);
              setShowErrorSnackbar(true);
            }
          } else {
            console.log('🚨 No status.errors found, showing general error');
            // Handle non-validation errors (like duplicate code)
            console.error('Failed to create role:', errorMsg);
            setErrorMessage(errorMsg);
            setShowErrorSnackbar(true);
          }
        }
        
      } else if (actionType === 'edit' && selectedRole) {
        // Update existing role
        const updateData = {
          code: formData.code || '',
          name: formData.name || '',
          description: formData.description || '',
          sortOrder: formData.sortOrder || 0,
          level: formData.level || 0,
          parentRoleId: formData.parentRoleId || undefined,
          active: formData.status === 'active',
        };
        
        // Call the role service to update the role
        console.log('Updating role:', selectedRole.id, updateData);
        const response = await roleService.updateRole(selectedRole.id, updateData);
        
        if (response.status.code === 200) {
          // If updating a child role, prioritize the parent in the list
          if (formData.parentRoleId) {
            console.log('🔼 Setting priority parent for update:', formData.parentRoleId);
            setPriorityParent(formData.parentRoleId);
          }
          
          // After successful update, close dialog first, then refresh the roles list
          handleCloseDialog();
          handleSearchPanelClose(); // Close the search panel to show role list
          setSuccessMessage(t('roles.messages.updateSuccess') || 'Role updated successfully');
          setShowSuccessSnackbar(true);
          
          // Refresh the list from page 0
          try {
            await handleSearch(0);
            // Clear priority parent after refresh to return to normal sorting
            if (formData.parentRoleId) {
              setTimeout(() => {
                console.log('🔽 Clearing priority parent after update refresh');
                clearPriorityParent();
              }, 1000);
            }
          } catch (error) {
            console.error('Error refreshing roles after update:', error);
          }
        } else {
          // Handle API errors
          let errorMsg = response.status.message || 'Failed to update role';
          
          // Extract field-specific validation errors using processApiErrors
          if (response.status.errors && typeof response.status.errors === 'object') {
            console.log('API errors received for update:', response.status.errors); // Debug log
            const processedErrors = processApiErrors(response.status.errors);
            
            if (Object.keys(processedErrors).length > 0) {
              setFormErrors(processedErrors);
              // Show general validation error in dialog if there are field errors
              setDialogErrorMessage(t('roles.messages.validationError') || 'Please correct the errors below');
            } else {
              // If no field-specific errors, show general error
              setErrorMessage(errorMsg);
              setShowErrorSnackbar(true);
            }
          } else {
            // Handle non-validation errors
            console.error('Failed to update role:', errorMsg);
            setErrorMessage(errorMsg);
            setShowErrorSnackbar(true);
          }
        }
      } else if (actionType === 'delete' && selectedRole) {
        // Delete existing role
        console.log('Deleting role:', selectedRole.id);
        const response = await roleService.deleteRole(selectedRole.id);
        
        if (response.status.code === 200 || response.status.code === 204) {
          // After successful deletion, close dialog first, then refresh the roles list
          handleCloseDialog();
          handleSearchPanelClose(); // Close the search panel to show role list
          setSuccessMessage(t('roles.messages.deleteSuccess') || 'Role deleted successfully');
          setShowSuccessSnackbar(true);
          
          // Refresh the list from page 0
          try {
            await handleSearch(0);
          } catch (error) {
            console.error('Error refreshing roles after delete:', error);
          }
        } else {
          // Handle delete error
          let errorMsg = response.status.message || 'Failed to delete role';
          console.error('Failed to delete role:', errorMsg);
          setErrorMessage(errorMsg);
          setShowErrorSnackbar(true);
        }
      }
    } catch (error) {
      console.error('🚨 Caught error in handleSave:', error);
      console.log('🚨 Error type:', typeof error);
      console.log('🚨 Error instanceof Error:', error instanceof Error);
      
      // Check if this is an ApiError with validation errors (from the api-client interceptor)
      if (error && typeof error === 'object' && 'errors' in error && 'code' in error) {
        const apiError = error as any;
        console.log('🚨 Found ApiError with validation errors:', apiError.errors);
        console.log('🚨 ApiError code:', apiError.code);
        console.log('🚨 ApiError message:', apiError.message);
        
        if (apiError.errors && typeof apiError.errors === 'object') {
          console.log('🚨 Processing ApiError validation errors:', apiError.errors);
          const processedErrors = processApiErrors(apiError.errors);
          console.log('🚨 Processed ApiError errors:', processedErrors);
          
          if (Object.keys(processedErrors).length > 0) {
            setFormErrors(processedErrors);
            setDialogErrorMessage(t('roles.messages.validationError') || 'Please correct the errors below');
            return; // Don't show general error if we have field errors
          }
        }
      }
      
      // Check if this is an Axios error with API validation response (legacy fallback)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.log('🚨 Axios error response:', axiosError.response);
        console.log('🚨 Axios error response data:', axiosError.response?.data);
        
        if (axiosError.response?.data?.status?.errors) {
          console.log('🚨 Found validation errors in axios error:', axiosError.response.data.status.errors);
          const processedErrors = processApiErrors(axiosError.response.data.status.errors);
          console.log('🚨 Processed axios errors:', processedErrors);
          
          if (Object.keys(processedErrors).length > 0) {
            setFormErrors(processedErrors);
            setDialogErrorMessage(t('roles.messages.validationError') || 'Please correct the errors below');
            return; // Don't show general error if we have field errors
          }
        }
      }
      
      // Fallback to general error
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      setShowErrorSnackbar(true);
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

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('roles.name'),
        cell: (info) => {
          const role = info.row.original;
          const indentLevel = (role.displayLevel || 0) * 20; // 20px per display level
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: `${indentLevel}px` }}>
              {role.hasChildren ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    color: 'primary.main',
                  }}
                >
                  {role.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </Box>
              ) : (
                <Box sx={{ width: 16 }} /> // Spacer for alignment
              )}
              <Shield size={16} />
              <Typography variant="body2" fontWeight="medium">
                {info.getValue()}
              </Typography>
            </Box>
          );
        },
      }),
      columnHelper.accessor('code', {
        header: t('roles.code'),
        cell: (info) => (
          <Chip
            label={info.getValue()}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
          />
        ),
        size: 120,
      }),
      columnHelper.accessor('level', {
        header: t('roles.level'),
        cell: (info) => (
          <Chip
            label={`Level ${info.getValue()}`}
            size="small"
            color="primary"
            sx={{ fontWeight: 500 }}
          />
        ),
        size: 100,
      }),
      columnHelper.accessor('systemRole', {
        header: t('roles.systemRole'),
        cell: (info) => (
          <Chip
            label={info.getValue() ? 'System' : 'Custom'}
            size="small"
            color={info.getValue() ? 'error' : 'default'}
            sx={{ fontWeight: 500 }}
          />
        ),
        size: 120,
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
      label: t('common.add'),
      icon: <Plus size={16} />,
      action: handleAddChildRole,
      color: 'success' as const,
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
                : theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)'
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
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth={actionType === 'delete' ? 'sm' : 'md'} 
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
          background: actionType === 'delete' 
            ? 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)'
            : 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                backgroundColor: actionType === 'delete' ? 'error.main' : 'primary.main',
                color: actionType === 'delete' ? 'error.contrastText' : 'primary.contrastText',
                display: 'inline-flex'
              }}
            >
              {actionType === 'delete' ? <AlertTriangle size={24} /> : <Shield size={24} />}
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
            <Box sx={{ p: 4 }}>
              <DialogContentText sx={{ 
                fontSize: '1.1rem', 
                color: 'text.primary',
                textAlign: 'center',
                mb: 2
              }}>
                {t('roles.deleteConfirmation', { roleName: selectedRole?.name }) || 
                 `Are you sure you want to delete role "${selectedRole?.name}"?`}
              </DialogContentText>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textAlign: 'center' }}
              >
                {t('roles.actionCannotBeUndone') || 'This action cannot be undone.'}
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Form Content */}
              <Box sx={{ p: 4 }}>
                {/* Dialog Error Message */}
                {dialogErrorMessage && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {dialogErrorMessage}
                  </Alert>
                )}
                
                {/* General Errors */}
                {getGeneralErrors().length > 0 && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {getGeneralErrors().map((error, index) => (
                      <div key={`error-${index}-${error}`}>{error}</div>
                    ))}
                  </Alert>
                )}
                
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
                        {t('roles.form.roleCode') || 'Role Code'}:
                      </Typography>
                      <Chip 
                        label={formData.code || '-'} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.level') || 'Level'}:
                      </Typography>
                      <Chip 
                        label={`Level ${formData.level ?? 0}`} 
                        size="small" 
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.systemRole') || 'System Role'}:
                      </Typography>
                      <Chip 
                        label={formData.systemRole ? 'System Role' : 'Custom Role'} 
                        size="small" 
                        color={formData.systemRole ? 'error' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
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

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        ID:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
                        {formData.id || '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.sortOrder') || 'Sort Order'}:
                      </Typography>
                      <Chip 
                        label={formData.sortOrder || 0} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('roles.form.parentRole') || 'Parent Role'}:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
                        {formData.parentRoleId || '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('common.createdAt') || 'Created At'}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('common.updatedAt') || 'Updated At'}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('common.createdBy') || 'Created By'}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {formData.createdBy || '-'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500 }}>
                        {t('common.updatedBy') || 'Updated By'}:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {formData.updatedBy || '-'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  // Edit/Create Mode - Clean Form Layout
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140, fontWeight: 500, pt: 1 }}>
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
                          error={hasError('name')}
                          helperText={getErrorMessage('name')}
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
                          error={hasError('description')}
                          helperText={getErrorMessage('description')}
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
                        {t('roles.form.roleCode') || 'Role Code'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.code ?? ''}
                          onChange={(e) => handleFormChange('code', e.target.value)}
                          required
                          variant="outlined"
                          error={hasError('code')}
                          helperText={getErrorMessage('code')}
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
                        {t('roles.form.level') || 'Level'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={formData.level ?? 0}
                          onChange={(e) => handleFormChange('level', parseInt(e.target.value) || 0)}
                          required
                          variant="outlined"
                          error={hasError('level')}
                          helperText={getErrorMessage('level')}
                          slotProps={{ htmlInput: { min: 0, max: 10 } }}
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
                        {t('roles.form.sortOrder') || 'Sort Order'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={formData.sortOrder ?? 0}
                          onChange={(e) => handleFormChange('sortOrder', parseInt(e.target.value) || 0)}
                          variant="outlined"
                          error={hasError('sortOrder')}
                          helperText={getErrorMessage('sortOrder')}
                          slotProps={{ htmlInput: { min: 0 } }}
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
                        {t('roles.form.parentRole') || 'Parent Role'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={formData.parentRoleId ?? ''}
                          onChange={(e) => handleFormChange('parentRoleId', e.target.value || null)}
                          variant="outlined"
                          placeholder="Enter parent role ID (optional)"
                          error={hasError('parentRoleId')}
                          helperText={getErrorMessage('parentRoleId')}
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
                        {t('roles.form.systemRole') || 'System Role'}:
                      </Typography>
                      <Box sx={{ flex: 1, ml: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.systemRole ?? false}
                              onChange={(e) => handleFormChange('systemRole', e.target.checked)}
                              color="error"
                            />
                          }
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formData.systemRole ? 'System Role' : 'Custom Role'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {formData.systemRole ? 'Built-in system role' : 'User-defined custom role'}
                              </Typography>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
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
              onClick={handleSave}
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
              onClick={handleSave}
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

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowErrorSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowErrorSnackbar(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RolesPage;
