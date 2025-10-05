import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { User, UserQueryParams } from '../services/userService';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { userService } from '../services/userService';
import { USER_CONSTANTS } from '../constants';

/**
 * Custom hook for user data management
 * 
 * This hook manages user data fetching, pagination, and filtering.
 * It provides a centralized way to handle user list state and operations.
 * 
 * @returns {Object} Object containing user data and management functions
 * @returns {User[]} allUsers - All loaded users
 * @returns {User[]} filteredUsers - Filtered users based on search criteria
 * @returns {Function} setFilteredUsers - Function to update filtered users
 * @returns {PaginatedResponse<User> | null} pagination - Pagination metadata
 * @returns {boolean} loading - Loading state
 * @returns {string | null} error - Error message if any
 * @returns {Function} loadUsers - Function to load users with optional params
 * @returns {Function} setError - Function to set error state
 * @returns {Function} handlePageChange - Function to handle page change
 * @returns {Function} handlePageSizeChange - Function to handle page size change
 * 
 * @example
 * ```tsx
 * const {
 *   allUsers,
 *   filteredUsers,
 *   pagination,
 *   loading,
 *   error,
 *   loadUsers,
 *   handlePageChange,
 *   handlePageSizeChange,
 * } = useUsers();
 * 
 * // Load users with search params
 * loadUsers({ username: 'john' });
 * 
 * // Change page
 * handlePageChange(2);
 * ```
 */
export const useUsers = () => {
  const { t } = useTranslation();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(USER_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  // Memoized function to load users
  // Dependencies optimized to prevent unnecessary re-renders
  const loadUsers = useCallback(async (params?: UserQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: UserQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: USER_CONSTANTS.SORT_FIELD,
        direction: USER_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const response = await userService.getUsers(queryParams);
      
      if (response.status.code === 200) {
        setAllUsers(response.data.content);
        setFilteredUsers(response.data.content);
        setPagination(response.data);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('users.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load users';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t]); // Optimized: removed currentPage, pageSize from dependencies to prevent circular updates

  // Load users only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadUsers(undefined, 0, USER_CONSTANTS.DEFAULT_PAGE_SIZE);
    }
  }, [loadUsers]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  // Effect to reload when page or pageSize changes (but not on initial mount)
  useEffect(() => {
    if (hasInitiallyLoaded.current) {
      loadUsers(undefined, currentPage, pageSize);
    }
  }, [currentPage, pageSize, loadUsers]);

  return {
    allUsers,
    filteredUsers,
    setFilteredUsers,
    pagination,
    loading,
    error,
    setError,
    currentPage,
    pageSize,
    loadUsers,
    handlePageChange,
    handlePageSizeChange,
  };
};
