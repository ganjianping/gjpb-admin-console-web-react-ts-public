/**
 * Cache management utilities for clearing all application caches
 */

import CacheManagerService from '../services/cache-registry.service';

/**
 * Clear all application caches
 * This should be called when user logs out or logs in
 */
export const clearAllCaches = (): void => {
  console.log('=== Clearing all application caches ===');
  
  // Use the centralized cache registry to clear all registered caches
  CacheManagerService.clearAllCaches();
  
  console.log('All caches cleared (including localStorage)');
};

/**
 * Get cache status for debugging
 */
export const getCacheStatus = (): Record<string, any> => {
  return {
    message: 'Cache status reporting should be implemented by individual modules',
    timestamp: new Date().toISOString(),
  };
};
