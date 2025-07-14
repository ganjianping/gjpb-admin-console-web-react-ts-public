/**
 * localStorage-based cache for roles data
 * Persists until the user logs out
 */

export interface CachedRole {
  code: string;
  name: string;
}

export interface ApiRole {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
  level: number;
  parentRoleId: string | null;
  systemRole: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

const ROLES_CACHE_KEY = 'gjpb_roles';

class RolesCache {
  private loadingPromise: Promise<CachedRole[]> | null = null;

  /**
   * Get cached roles from localStorage
   */
  private getCachedRolesFromStorage(): CachedRole[] {
    try {
      const cachedData = localStorage.getItem(ROLES_CACHE_KEY);
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        return parsed;
      }
    } catch (error) {
      console.error('=== RolesCache: Failed to parse localStorage data ===', error);
      this.clearCache();
    }
    return [];
  }

  /**
   * Save roles to localStorage
   */
  private saveCachedRolesToStorage(roles: CachedRole[]): void {
    try {
      localStorage.setItem(ROLES_CACHE_KEY, JSON.stringify(roles));
    } catch (error) {
      console.error('=== RolesCache: Failed to save to localStorage ===', error);
    }
  }

  /**
   * Get cached roles or fetch them if not loaded
   */
  async getRoles(fetchFn: () => Promise<ApiRole[]>, forceRefresh = false): Promise<CachedRole[]> {
    // If forcing refresh, clear cache first
    if (forceRefresh) {
      console.log('=== RolesCache: Force refresh - clearing cache ===');
      this.clearCache();
    }
    
    // Check if already cached in localStorage
    const cachedRoles = this.getCachedRolesFromStorage();
    if (cachedRoles.length > 0) {
      return cachedRoles;
    }

    // If currently loading, return the same promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Start loading
    this.loadingPromise = this.fetchAndCacheRoles(fetchFn);
    
    try {
      const result = await this.loadingPromise;
      return result;
    } finally {
      this.loadingPromise = null;
    }
  }

  /**
   * Separate method for fetching and caching to better track the flow
   */
  private async fetchAndCacheRoles(fetchFn: () => Promise<ApiRole[]>): Promise<CachedRole[]> {
    try {
      const apiRoles = await fetchFn();
      
      // Check if apiRoles is valid
      if (!apiRoles || !Array.isArray(apiRoles)) {
        console.error('=== RolesCache: Invalid API response - not an array ===', apiRoles);
        throw new Error('Invalid API response: expected array of roles');
      }
      
      if (apiRoles.length === 0) {
        // Still save empty array to cache to prevent repeated API calls
        this.saveCachedRolesToStorage([]);
        return [];
      }
      
      // Transform API roles to cached format (only code and name)
      const simplifiedRoles: CachedRole[] = apiRoles.map((role) => ({
        code: role.code,
        name: role.name
      }));
      
      // Save to localStorage
      this.saveCachedRolesToStorage(simplifiedRoles);
      
      return simplifiedRoles;
    } catch (error) {
      console.error('=== RolesCache: Failed to fetch and cache roles ===', error);
      throw error;
    }
  }

  /**
   * Get cached roles without fetching (returns empty array if not loaded)
   */
  getCachedRoles(): CachedRole[] {
    return this.getCachedRolesFromStorage();
  }

  /**
   * Check if roles are loaded
   */
  isRolesLoaded(): boolean {
    return this.getCachedRolesFromStorage().length > 0;
  }

  /**
   * Clear the cache (useful for logout)
   */
  clearCache(): void {
    localStorage.removeItem(ROLES_CACHE_KEY);
    this.loadingPromise = null;
  }

  /**
   * Get roles count
   */
  getRolesCount(): number {
    return this.getCachedRolesFromStorage().length;
  }
}

// Export singleton instance
export const rolesCache = new RolesCache();
