import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Website } from '../types/website.types';

/**
 * Parameters for useWebsiteActionMenu hook
 * @interface UseWebsiteActionMenuParams
 */
interface UseWebsiteActionMenuParams {
  /** Callback for viewing a website */
  onView: (website: Website) => void;
  /** Callback for editing a website */
  onEdit: (website: Website) => void;
  /** Callback for deleting a website */
  onDelete: (website: Website) => void;
}

/**
 * Hook to create website action menu items
 * 
 * Provides memoized action menu configuration for the data table.
 * The menu items are optimized with useMemo to prevent unnecessary re-renders.
 * 
 * @param {UseWebsiteActionMenuParams} params - Action callbacks
 * @returns {Array} Array of action menu items with labels, icons, and callbacks
 * 
 * @example
 * ```tsx
 * const actionMenuItems = useWebsiteActionMenu({
 *   onView: (website) => handleView(website),
 *   onEdit: (website) => handleEdit(website),
 *   onDelete: (website) => handleDelete(website),
 * });
 * ```
 * 
 * @see {@link WebsiteTable} for usage example
 */
export const useWebsiteActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseWebsiteActionMenuParams) => {
  const { t } = useTranslation();

  const actionMenuItems = useMemo(() => [
    {
      label: t('websites.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('websites.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('websites.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete]);

  return actionMenuItems;
};
