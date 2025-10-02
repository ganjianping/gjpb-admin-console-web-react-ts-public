import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../config/i18n.config'; // Initialize user translations
import type { User, UserQueryParams } from '../services/userService';
import type { PaginatedResponse } from '../../../../shared-lib/src/types/api.types';
import { userService } from '../services/userService';

export const useUsers = () => {
  const { t } = useTranslation();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const hasInitiallyLoaded = useRef(false);

  const loadUsersInternal = async (params?: UserQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: UserQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: 'updatedAt',
        direction: 'desc',
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
  };

  const loadUsers = useCallback((params?: UserQueryParams) => {
    return loadUsersInternal(params, currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Load users only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadUsersInternal(undefined, 0, 20); // Use hardcoded initial values
    }
  }, []); // NO dependencies - only run once on mount

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Manually trigger reload when page changes
    if (hasInitiallyLoaded.current) {
      loadUsersInternal(undefined, page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    // Manually trigger reload when page size changes
    if (hasInitiallyLoaded.current) {
      loadUsersInternal(undefined, 0, newPageSize);
    }
  };

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
