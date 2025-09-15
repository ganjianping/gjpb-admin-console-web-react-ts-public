// Auth Types - Keep these for cross-module communication
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

/**
 * Shared authentication utilities
 * Only contains functions that might be used across multiple microfrontends
 * Module-specific auth functions should be in their respective modules
 */
class AuthService {
  /**
   * Check if user has specific role - utility function for any module
   * Gets role data from localStorage (populated during login)
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
   * Get user roles from stored data - utility for role checks
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
   * Get basic user info from localStorage - utility for any module
   */
  public getUserInfo(): UserInfo | null {
    try {
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
      console.error('[AuthService] Get user info error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
