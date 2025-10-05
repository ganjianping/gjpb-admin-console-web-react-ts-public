import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { AppSetting } from '../types/app-setting.types';

/**
 * Parameters for useAppSettingActionMenu hook
 * @interface UseAppSettingActionMenuParams
 */
interface UseAppSettingActionMenuParams {
  /** Callback for viewing an app setting */
  onView: (appSetting: AppSetting) => void;
  /** Callback for editing an app setting */
  onEdit: (appSetting: AppSetting) => void;
  /** Callback for deleting an app setting */
  onDelete: (appSetting: AppSetting) => void;
}

/**
 * Hook to create app setting action menu items
 * 
 * Provides memoized action menu configuration for the data table.
 * The menu items are optimized with useMemo to prevent unnecessary re-renders.
 * 
 * @param {UseAppSettingActionMenuParams} params - Action callbacks
 * @returns {Array} Array of action menu items with labels, icons, and callbacks
 * 
 * @example
 * ```tsx
 * const actionMenuItems = useAppSettingActionMenu({
 *   onView: (setting) => handleView(setting),
 *   onEdit: (setting) => handleEdit(setting),
 *   onDelete: (setting) => handleDelete(setting),
 * });
 * ```
 * 
 * @see {@link AppSettingTable} for usage example
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
