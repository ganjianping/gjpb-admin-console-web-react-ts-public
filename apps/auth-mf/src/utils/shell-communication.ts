import type { AuthResponse } from '../../../shared-lib/src/features/api/auth-service';
import type { ColorTheme, ThemeMode } from '../../../shared-lib/src/features/theme/theme.types';

// Shell communication interface
export interface ShellCommunication {
  // Auth events
  onAuthLoginSuccess?: (authResponse: AuthResponse) => void;
  onAuthLoginFailure?: (error: string) => void;
  onAuthLogoutRequest?: () => void;
  
  // Theme events (auth-mf can request theme changes)
  onThemeModeChange?: (mode: ThemeMode) => void;
  onColorThemeChange?: (colorTheme: ColorTheme) => void;
  
  // Dashboard events (legacy support)
  updateDashboardAfterLogin?: () => void;
}

// Global window interface for shell communication
declare global {
  interface Window extends ShellCommunication {}
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
   * Request theme mode change from shell
   */
  static requestThemeModeChange(mode: ThemeMode): void {
    try {
      if (typeof window !== 'undefined' && window.onThemeModeChange) {
        window.onThemeModeChange(mode);
        console.log('[AuthCommunication] Theme mode change request sent:', mode);
      } else {
        console.warn('[AuthCommunication] Theme mode change handler not available');
      }
    } catch (error) {
      console.error('[AuthCommunication] Error requesting theme mode change:', error);
    }
  }

  /**
   * Request color theme change from shell
   */
  static requestColorThemeChange(colorTheme: ColorTheme): void {
    try {
      if (typeof window !== 'undefined' && window.onColorThemeChange) {
        window.onColorThemeChange(colorTheme);
        console.log('[AuthCommunication] Color theme change request sent:', colorTheme);
      } else {
        console.warn('[AuthCommunication] Color theme change handler not available');
      }
    } catch (error) {
      console.error('[AuthCommunication] Error requesting color theme change:', error);
    }
  }

  /**
   * Check if shell handlers are available
   */
  static isShellConnected(): boolean {
    return typeof window !== 'undefined' && 
           (!!window.onAuthLoginSuccess || !!window.onAuthLoginFailure);
  }

  /**
   * Check if theme communication is available
   */
  static isThemeCommunicationAvailable(): boolean {
    return typeof window !== 'undefined' && 
           (!!window.onThemeModeChange || !!window.onColorThemeChange);
  }
}

export default AuthCommunication;
