import type { AuthResponse } from '../../../shared-lib/src/services/auth-service';

// Global window interface for auth communication
declare global {
  interface Window {
    // Auth communication methods
    onAuthLoginSuccess?: (authResponse: AuthResponse) => void;
    onAuthLoginFailure?: (error: string) => void;
    onAuthLogoutRequest?: () => void;
    
    // Theme control methods (existing pattern from dashboard)
    updateDashboardAfterLogin?: () => void;
  }
}

// Auth communication helper
export class AuthCommunication {
  /**
   * Notify shell of successful login
   */
  static notifyLoginSuccess(authResponse: AuthResponse): void {
    try {
      if (typeof window !== 'undefined' && window.onAuthLoginSuccess) {
        window.onAuthLoginSuccess(authResponse);
        console.log('[AuthCommunication] Login success notification sent');
      } else {
        console.warn('[AuthCommunication] Login success handler not available');
      }
    } catch (error) {
      console.error('[AuthCommunication] Error notifying login success:', error);
    }
  }

  /**
   * Notify shell of login failure
   */
  static notifyLoginFailure(error: string): void {
    try {
      if (typeof window !== 'undefined' && window.onAuthLoginFailure) {
        window.onAuthLoginFailure(error);
        console.log('[AuthCommunication] Login failure notification sent');
      } else {
        console.warn('[AuthCommunication] Login failure handler not available');
      }
    } catch (error_) {
      console.error('[AuthCommunication] Error notifying login failure:', error_);
    }
  }

  /**
   * Request logout from shell
   */
  static requestLogout(): void {
    try {
      if (typeof window !== 'undefined' && window.onAuthLogoutRequest) {
        window.onAuthLogoutRequest();
        console.log('[AuthCommunication] Logout request sent');
      } else {
        console.warn('[AuthCommunication] Logout request handler not available');
      }
    } catch (error) {
      console.error('[AuthCommunication] Error requesting logout:', error);
    }
  }

  /**
   * Check if shell handlers are available
   */
  static isShellConnected(): boolean {
    return typeof window !== 'undefined' && 
           (!!window.onAuthLoginSuccess || !!window.onAuthLoginFailure);
  }
}

export default AuthCommunication;
