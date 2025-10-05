import { useMemo } from 'react';
import type { User } from '../services/userService';

/**
 * Action menu item interface
 */
export interface UserActionMenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * Custom hook for user action menu configuration
 * 
 * This hook provides memoized action menu items for user operations,
 * ensuring optimal performance by preventing unnecessary re-renders.
 * 
 * @param {Object} params - Hook parameters
 * @param {User} params.user - The user for which to generate action menu
 * @param {Function} params.onView - Callback when view action is clicked
 * @param {Function} params.onEdit - Callback when edit action is clicked
 * @param {Function} params.onDelete - Callback when delete action is clicked
 * @param {Function} params.t - Translation function from i18next
 * @returns {UserActionMenuItem[]} Array of action menu items
 * 
 * @example
 * ```tsx
 * const actionMenuItems = useUserActionMenu({
 *   user,
 *   onView: handleView,
 *   onEdit: handleEdit,
 *   onDelete: handleDelete,
 *   t,
 * });
 * ```
 */
export const useUserActionMenu = ({
  user,
  onView,
  onEdit,
  onDelete,
  t,
}: {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  t: (key: string) => string;
}): UserActionMenuItem[] => {
  return useMemo(
    () => [
      {
        label: t('users.actions.view'),
        onClick: () => onView(user),
      },
      {
        label: t('users.actions.edit'),
        onClick: () => onEdit(user),
      },
      {
        label: t('users.actions.delete'),
        onClick: () => onDelete(user),
      },
    ],
    [user, onView, onEdit, onDelete, t]
  );
};
