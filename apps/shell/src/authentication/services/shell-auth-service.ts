import { APP_CONFIG, APP_ENV } from '../../../../shared-lib/src/core/config';
import { getCookie, removeCookie, setCookie } from '../../../../shared-lib/src/core/cookie';
import { clearAllCaches } from '../../../../shared-lib/src/core/cache-manager';
import { apiClient } from '../../../../shared-lib/src/api/api-client';
import { mockApiService } from '../../../../shared-lib/src/api/mock-api-service';
import type { UserInfo, AuthTokens } from '../../../../shared-lib/src/api/auth-service';

// Check if we should use mock API
const useMockAPI = APP_ENV.MODE === 'mock' || (APP_ENV.DEV && import.meta.env.VITE_USE_MOCK === 'true');

/**
 * Shell-specific authentication service
 * Handles global auth state, token management, and user session
 */
class ShellAuthService {
  /**
   * Logout the current user
   */
  public async logout(): Promise<void> {
    try {
      // Clear auth tokens
      removeCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY);
      removeCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY);
      removeCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY);
      
      // Clear user info from localStorage
      localStorage.removeItem('gjpb_user_info');
      
      // Clear all application caches
      clearAllCaches();
    } catch (error) {
      console.error('[ShellAuthService] Logout error:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!getCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY);
  }

  /**
   * Refresh the access token
   */
  public async refreshToken(): Promise<AuthTokens> {
    const refreshToken = getCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      let tokenResponse: AuthTokens;
      
      // Use mock API in development mode
      if (useMockAPI) {
        tokenResponse = await mockApiService.refreshToken(refreshToken) as AuthTokens;
      } else {
        const response = await apiClient.put<AuthTokens>(
          APP_CONFIG.AUTH.REFRESH_TOKEN_URL,
          { refreshToken }
        );
        
        if (response.status.code === 200 && response.data) {
          tokenResponse = response.data;
        } else {
          throw new Error('Token refresh failed');
        }
      }
      
      const { accessToken, refreshToken: newRefreshToken, tokenType, expiresIn } = tokenResponse;
      
      // Store new tokens with explicit SameSite protection
      setCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY, accessToken, expiresIn, '/', import.meta.env.PROD, 'Lax');
      setCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY, newRefreshToken, undefined, '/', import.meta.env.PROD, 'Lax');
      setCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY, tokenType, undefined, '/', import.meta.env.PROD, 'Lax');
      
      return tokenResponse;
    } catch (error) {
      console.error('[ShellAuthService] Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current user info from localStorage (populated during login)
   */
  public async getCurrentUser(): Promise<UserInfo | null> {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    try {
      // Get user info from localStorage (stored during login)
      const userInfo = localStorage.getItem('gjpb_user_info');
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        return {
          username: userData.username,
          email: userData.email,
          mobileCountryCode: userData.mobileCountryCode ?? '',
          mobileNumber: userData.mobileNumber ?? '',
          nickname: userData.nickname,
          accountStatus: userData.accountStatus ?? 'active',
          lastLoginAt: userData.lastLoginAt ?? '',
          lastLoginIp: userData.lastLoginIp ?? '',
          lastFailedLoginAt: userData.lastFailedLoginAt ?? null,
          failedLoginAttempts: userData.failedLoginAttempts ?? 0,
          roleCodes: userData.roleCodes ?? []
        };
      }
      return null;
    } catch (error) {
      console.error('[ShellAuthService] Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if access token will expire soon and refresh if needed
   * @returns Promise that resolves when token is refreshed (if needed)
   */
  public async ensureValidToken(): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      // Check if token needs proactive refresh
      if (this.shouldRefreshToken()) {
        console.info('[ShellAuthService] Token expiring soon, refreshing proactively');
        await this.refreshToken();
      }
    } catch (error) {
      console.error('[ShellAuthService] Token validation error:', error);
      throw error;
    }
  }

  /**
   * Check if token is close to expiring (within TOKEN_EXPIRY_BUFFER)
   * @returns true if token should be refreshed proactively
   */
  public shouldRefreshToken(): boolean {
    const accessToken = getCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY);
    
    if (!accessToken) {
      return false;
    }

    try {
      // Decode JWT token to check expiry (simple base64 decode)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const bufferTime = APP_CONFIG.AUTH.TOKEN_EXPIRY_BUFFER * 1000; // Convert to milliseconds
      
      // Return true if token expires within the buffer time
      return (expiryTime - currentTime) <= bufferTime;
    } catch (error) {
      console.warn('[ShellAuthService] Could not decode token for expiry check:', error);
      // If we can't decode the token, assume it needs refresh
      return true;
    }
  }

  /**
   * Get user roles from stored data
   */
  public getUserRoles(): string[] {
    try {
      const userInfo = localStorage.getItem('gjpb_user_info');
      if (userInfo) {
        const { roleCodes } = JSON.parse(userInfo);
        return roleCodes ?? [];
      }
      return [];
    } catch (error) {
      console.error('[ShellAuthService] Get user roles error:', error);
      return [];
    }
  }

  /**
   * Check if user has specific role
   */
  public hasRole(roleCodes: string | string[]): boolean {
    const userRoles = this.getUserRoles();
    
    if (!userRoles || userRoles.length === 0) {
      return false;
    }
    
    const requiredRoles = Array.isArray(roleCodes) ? roleCodes : [roleCodes];
    return requiredRoles.some(role => userRoles.includes(role));
  }
}

export const shellAuthService = new ShellAuthService();
export default shellAuthService;
