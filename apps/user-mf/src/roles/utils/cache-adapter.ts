// User-MF Cache Adapter - implements CacheProvider interface for user-mf module
import type { CacheProvider } from '../../../../shared-lib/src/core/cache-registry.service';
import { rolesService } from '../services/rolesCacheService';

export class UserMfCacheProvider implements CacheProvider {
  getCacheKey(): string {
    return 'user-mf-cache';
  }

  clearCache(): void {
    // Clear roles cache
    rolesService.clearCache();
    // Add other user-mf specific cache clearing here
  }
}

// Create and export singleton instance
export const userMfCacheProvider = new UserMfCacheProvider();
