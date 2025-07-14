import { useState, useEffect, useCallback } from 'react';
import { rolesService } from '../services/rolesCacheService';
import type { CachedRole } from '../utils/rolesCache';

/**
 * Custom hook to manage roles data with localStorage caching
 * @returns Object containing roles data and loading state
 */
export const useRoles = () => {
  const [roles, setRoles] = useState<CachedRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize roles on mount - only use cached if available, don't load
  useEffect(() => {
    // If roles are already cached in localStorage, use them immediately
    if (rolesService.isRolesLoaded()) {
      const cachedRoles = rolesService.getCachedRoles();
      setRoles(cachedRoles);
    } else {
      // Clear local state to ensure consistency
      setRoles([]);
    }
  }, []);

  const loadRoles = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const rolesData = await rolesService.getRoles(forceRefresh);
      setRoles(rolesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get roles by codes
  const getRolesByCode = (codes: string[]): CachedRole[] => {
    return roles.filter(role => codes.includes(role.code));
  };

  // Get role by code
  const getRoleByCode = (code: string): CachedRole | undefined => {
    return roles.find(role => role.code === code);
  };

  // Check if roles are cached (only check service cache, not local state)
  const isCached = rolesService.isRolesLoaded();

  // Get cache status
  const cacheStatus = {
    isLoaded: rolesService.isRolesLoaded(),
    count: rolesService.getRolesCount(),
  };

  return {
    roles,
    loading,
    error,
    loadRoles,
    getRolesByCode,
    getRoleByCode,
    isCached,
    cacheStatus,
  };
};
