import { useState, useCallback } from 'react';
import type { Role } from '../types/role.types';
import type { RoleActionType, RoleFormData } from '../types/role-dialog.types';

const initialFormData: RoleFormData = {
  name: '',
  description: '',
  status: 'active',
  code: '',
  sortOrder: 0,
  level: 0,
  parentRoleId: null,
  systemRole: false,
};

/**
 * Hook to manage role dialog state and actions
 */
export const useRoleDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [actionType, setActionType] = useState<RoleActionType>(null);
  const [formData, setFormData] = useState<RoleFormData>(initialFormData);

  const handleView = useCallback((role: Role) => {
    setSelectedRole(role);
    setFormData(role);
    setActionType('view');
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((role: Role) => {
    setSelectedRole(role);
    setFormData(role);
    setActionType('edit');
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback((role: Role) => {
    setSelectedRole(role);
    setActionType('delete');
    setDialogOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedRole(null);
    setFormData(initialFormData);
    setActionType('create');
    setDialogOpen(true);
  }, []);

  const handleAddChildRole = useCallback((parentRole: Role) => {
    setSelectedRole(null);
    setFormData({
      ...initialFormData,
      level: (parentRole.level || 0) + 1,
      parentRoleId: parentRole.id,
    });
    setActionType('create');
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback((clearErrors?: () => void) => {
    console.log('🔒 Closing dialog, current state:', { dialogOpen, actionType });
    setDialogOpen(false);
    setSelectedRole(null);
    setActionType(null);
    setFormData(initialFormData);
    if (clearErrors) {
      clearErrors();
    }
    console.log('🔒 Dialog close function completed');
  }, [dialogOpen, actionType]);

  const handleFormChange = useCallback((field: keyof Role, value: any, clearFieldError?: (field: string) => void) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (clearFieldError) {
      clearFieldError(field as string);
    }
  }, []);

  return {
    dialogOpen,
    selectedRole,
    actionType,
    formData,
    handleView,
    handleEdit,
    handleDelete,
    handleCreate,
    handleAddChildRole,
    handleCloseDialog,
    handleFormChange,
  };
};
