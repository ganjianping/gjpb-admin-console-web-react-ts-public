/**
 * Centralized roles management service
 * Handles caching and loading of roles data
 */

import { rolesCache, type CachedRole } from '../utils/rolesCache';
import { roleService } from './roleService';

class RolesService {
  private static instance: RolesService | null = null;

  private constructor() {}

  static getInstance(): RolesService {
    RolesService.instance ??= new RolesService();
    return RolesService.instance;
  }

  /**
   * Parse API response and extract roles data
   */
  private parseApiResponse(response: any): any[] {
    // Check if response.data.data exists (nested structure)
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Check if response.data is the array (flat structure)
    else if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    // Check if response is the array directly (direct structure)
    else if (Array.isArray(response)) {
      return response;
    }
    // No valid structure found
    else {
      console.error('=== RolesService: Invalid API response structure ===');
      console.error('Expected: response.data.data (array) OR response.data (array) OR response (array)');
      console.error('Actual response:', response);
      throw new Error('Invalid API response structure. Please check the API endpoint or contact support.');
    }
  }

  /**
   * Create user-friendly error message based on error type
   */
  private createErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
      return 'Failed to load roles. Please try again.';
    }

    if (error.message.includes('Invalid API response structure')) {
      return 'API response format is invalid. Please contact support.';
    } else if (error.message.includes('Network Error') || error.message.includes('timeout')) {
      return 'Network error. Please check your connection and try again.';
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return 'Authentication failed. Please log in again.';
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return 'You do not have permission to access roles data.';
    } else if (error.message.includes('404')) {
      return 'Roles API endpoint not found. Please contact support.';
    } else if (error.message.includes('500')) {
      return 'Server error. Please try again later or contact support.';
    }

    return 'Failed to load roles. Please try again.';
  }

  /**
   * Get roles - uses cache if available, otherwise fetches from API
   */
  async getRoles(forceRefresh = false): Promise<CachedRole[]> {
    // Let the rolesCache handle all caching logic
    return rolesCache.getRoles(async () => {
      try {
        const response = await roleService.getRoles();

        // Parse the response and extract roles data
        const rolesData = this.parseApiResponse(response);

        // Filter only active roles and return full API role objects
        const activeRoles = rolesData.filter(role => role?.active);
        return activeRoles;
      } catch (error) {
        console.error('=== RolesService: API call failed ===', error);
        
        // Create user-friendly error message and re-throw for UI handling
        const errorMessage = this.createErrorMessage(error);
        throw new Error(errorMessage);
      }
    }, forceRefresh);
  }

  /**
   * Get cached roles without fetching
   */
  getCachedRoles(): CachedRole[] {
    return rolesCache.getCachedRoles();
  }

  /**
   * Check if roles are loaded
   */
  isRolesLoaded(): boolean {
    return rolesCache.isRolesLoaded();
  }

  /**
   * Clear roles cache
   */
  clearCache(): void {
    rolesCache.clearCache();
  }

  /**
   * Get roles count
   */
  getRolesCount(): number {
    return rolesCache.getRolesCount();
  }
}

export const rolesService = RolesService.getInstance();
