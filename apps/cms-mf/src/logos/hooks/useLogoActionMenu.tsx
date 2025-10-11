import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Logo } from '../types/logo.types';

/**
 * Parameters for useLogoActionMenu hook
 * @interface UseLogoActionMenuParams
 */
interface UseLogoActionMenuParams {
  /** Callback for viewing a logo */
  onView: (logo: Logo) => void;
  /** Callback for editing a logo */
  onEdit: (logo: Logo) => void;
  /** Callback for deleting a logo */
  onDelete: (logo: Logo) => void;
  /** Callback for copying filename */
  onCopyFilename: (logo: Logo) => void;
}

/**
 * Hook to create logo action menu items
 * 
 * Provides memoized action menu configuration for the data table.
 * The menu items are optimized with useMemo to prevent unnecessary re-renders.
 * 
 * @param {UseLogoActionMenuParams} params - Action callbacks
 * @returns {Array} Array of action menu items with labels, icons, and callbacks
 * 
 * @example
 * ```tsx
 * const actionMenuItems = useLogoActionMenu({
 *   onView: (logo) => handleView(logo),
 *   onEdit: (logo) => handleEdit(logo),
 *   onDelete: (logo) => handleDelete(logo),
 * });
 * ```
 * 
 * @see {@link LogoTable} for usage example
 */
export const useLogoActionMenu = ({
  onView,
  onEdit,
  onDelete,
  onCopyFilename,
}: UseLogoActionMenuParams) => {
  const { t } = useTranslation();

  const actionMenuItems = useMemo(() => [
    {
      label: t('logos.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('logos.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('logos.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('logos.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename]);

  return actionMenuItems;
};
