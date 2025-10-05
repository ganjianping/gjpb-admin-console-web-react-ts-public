import { useMemo } from 'react';
import { Shield, Settings, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Role } from '../types/role.types';

interface UseRoleActionMenuProps {
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onAddChild: (role: Role) => void;
  onDelete: (role: Role) => void;
}

/**
 * Hook to create role action menu items
 */
export const useRoleActionMenu = ({ onView, onEdit, onAddChild, onDelete }: UseRoleActionMenuProps) => {
  const { t } = useTranslation();

  const actionMenuItems = useMemo(() => [
    {
      label: t('roles.actions.view'),
      icon: <Shield size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('roles.actions.edit'),
      icon: <Settings size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('common.add'),
      icon: <Plus size={16} />,
      action: onAddChild,
      color: 'success' as const,
    },
    {
      label: t('roles.actions.delete'),
      icon: <Shield size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onAddChild, onDelete]);

  return actionMenuItems;
};
