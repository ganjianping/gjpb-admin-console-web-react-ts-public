import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { AppSetting } from '../types/app-setting.types';

interface UseAppSettingActionMenuParams {
  onView: (appSetting: AppSetting) => void;
  onEdit: (appSetting: AppSetting) => void;
  onDelete: (appSetting: AppSetting) => void;
}

/**
 * Hook to create app setting action menu items
 * Provides memoized action menu configuration for the data table
 */
export const useAppSettingActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseAppSettingActionMenuParams) => {
  const { t } = useTranslation();

  const actionMenuItems = useMemo(() => [
    {
      label: t('appSettings.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('appSettings.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('appSettings.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete]);

  return actionMenuItems;
};
