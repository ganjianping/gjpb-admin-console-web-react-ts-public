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
        const response = await apiClient.post<AuthResponse>(APP_CONFIG.AUTH.LOGIN_URL, credentials);
        
        if (response.status.code === 200 && response.data) {
          authResponse = response.data;
        } else {
          throw new Error('Login failed');
        }
      }
      
      // Store tokens in HTTP-only cookies
      const { accessToken, refreshToken, tokenType, expiresIn } = authResponse;
      
      // Store tokens in cookies
      setCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY, accessToken, expiresIn);
      setCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY, refreshToken);
      setCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY, tokenType);
      
      // Store user info in localStorage for convenience
      localStorage.setItem('gjpb_user_info', JSON.stringify({
        username: authResponse.username,
        email: authResponse.email,
        nickname: authResponse.nickname,
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
      
      // Store new tokens
      setCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY, accessToken, expiresIn);
      setCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY, newRefreshToken);
      setCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY, tokenType);
      
      return tokenResponse;
    } catch (error) {
      console.error('[AuthService] Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current user info
   */
  public async getCurrentUser(): Promise<UserInfo | null> {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    try {
      const response = await apiClient.get<UserInfo>('/v1/users/me');
      return response.data;
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
}

export const authService = new AuthService();
export default authService;
