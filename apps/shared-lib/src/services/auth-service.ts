import { APP_CONFIG, APP_ENV } from '../utils/config';
import { apiClient } from './api-client';
import { setCookie, getCookie, removeCookie } from '../utils/cookie';
import { mockApiService } from './mock-api-service';

// Auth Types
export interface LoginCredentials {
  username?: string;
  email?: string;
  mobileCountryCode?: string;
  mobileNumber?: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserInfo {
  username: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  nickname: string;
  accountStatus: string;
  lastLoginAt: string;
  lastLoginIp: string;
  lastFailedLoginAt: string | null;
  failedLoginAttempts: number;
  roleCodes: string[];
}

export type AuthResponse = AuthTokens & UserInfo;

// Check if we should use mock API
const useMockAPI = APP_ENV.MODE === 'mock' || (APP_ENV.DEV && import.meta.env.VITE_USE_MOCK === 'true');

class AuthService {
  /**
   * Login with credentials
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      let authResponse: AuthResponse;
      
      // Use mock API in development mode
      if (useMockAPI) {
        authResponse = await mockApiService.login(credentials);
      } else {
        console.log('[AuthService] Making login request to:', APP_CONFIG.AUTH.LOGIN_URL);
        const response = await apiClient.post<AuthResponse>(APP_CONFIG.AUTH.LOGIN_URL, credentials);
        
        if (response.status.code === 200 && response.data) {
          authResponse = response.data;
        } else {
          throw new Error('Login failed');
        }
      }
      
      // Store tokens in HTTP-only cookies
      const { accessToken, refreshToken, tokenType, expiresIn } = authResponse;
      
      // Store tokens with explicit SameSite protection
      setCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY, accessToken, expiresIn, '/', import.meta.env.PROD, 'Lax');
      setCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY, refreshToken, undefined, '/', import.meta.env.PROD, 'Lax');
      setCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY, tokenType, undefined, '/', import.meta.env.PROD, 'Lax');
      
      // Store user info in localStorage for convenience (all fields from backend response)
      localStorage.setItem('gjpb_user_info', JSON.stringify({
        username: authResponse.username,
        email: authResponse.email,
        mobileCountryCode: authResponse.mobileCountryCode,
        mobileNumber: authResponse.mobileNumber,
        nickname: authResponse.nickname,
        accountStatus: authResponse.accountStatus,
        lastLoginAt: authResponse.lastLoginAt,
        lastLoginIp: authResponse.lastLoginIp,
        lastFailedLoginAt: authResponse.lastFailedLoginAt,
        failedLoginAttempts: authResponse.failedLoginAttempts,
        roleCodes: authResponse.roleCodes,
      }));
      
      return authResponse;
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  public async logout(): Promise<void> {
    try {
      // Clear auth tokens
      removeCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY);
      removeCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY);
      removeCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY);
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
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
      console.error('[AuthService] Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current user info - now gets data from localStorage (populated during login)
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
      console.error('[AuthService] Get current user error:', error);
      return null;
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

  /**
   * Get user roles from stored data
   */
  private getUserRoles(): string[] {
    try {
      const userInfo = localStorage.getItem('gjpb_user_info');
      if (userInfo) {
        const { roleCodes } = JSON.parse(userInfo);
        return roleCodes ?? [];
      }
      return [];
    } catch (error) {
      console.error('[AuthService] Get user roles error:', error);
      return [];
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
        console.info('[AuthService] Token expiring soon, refreshing proactively');
        await this.refreshToken();
      }
    } catch (error) {
      console.error('[AuthService] Token validation error:', error);
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
      console.warn('[AuthService] Could not decode token for expiry check:', error);
      // If we can't decode the token, assume it needs refresh
      return true;
    }
  }
}

export const authService = new AuthService();
export default authService;
