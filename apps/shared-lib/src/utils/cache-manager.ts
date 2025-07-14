/**
 * Cache management utilities for clearing all application caches
 */

import { rolesService } from '../../../user-mf/src/roles/services/rolesCacheService';

/**
 * Clear all application caches
 * This should be called when user logs out or logs in
 */
export const clearAllCaches = (): void => {
  console.log('=== Clearing all application caches ===');
  
  // Clear roles cache (localStorage)
  rolesService.clearCache();
  
  // Add other cache clearances here as needed
  // Example: permissionsCache.clearCache();
  // Example: settingsCache.clearCache();
  
  console.log('All caches cleared (including localStorage)');
};

/**
 * Get cache status for debugging
 */
export const getCacheStatus = (): Record<string, any> => {
  return {
    roles: {
      loaded: rolesService.isRolesLoaded(),
      count: rolesService.getRolesCount(),
    },
    // Add other cache status here as needed
  };
};
