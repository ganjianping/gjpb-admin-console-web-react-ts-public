/**
 * Auth-MF Specific Types
 * 
 * Types that are specific to the auth-mf module.
 * These are separate from shared types to maintain modularity.
 */

// Re-export shared auth types for convenience
export type {
  LoginCredentials,
  AuthResponse,
  AuthTokens,
  UserInfo
} from '../../../shared-lib/src/services/auth-service';

import type { LoginCredentials, AuthResponse } from '../../../shared-lib/src/services/auth-service';

// Auth-MF specific UI types
export type ColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'red';
export type ThemeMode = 'light' | 'dark';

// Login form specific types
export interface LoginFormData extends LoginCredentials {
  rememberMe?: boolean;
}

// Login attempt tracking
export interface LoginAttemptInfo {
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

// Login security settings
export interface LoginSecurityConfig {
  maxAttempts: number;
  lockoutDurationMinutes: number;
  requireMFA?: boolean;
}

// Communication interfaces for shell
export interface ShellCommunication {
  // Auth events
  onAuthLoginSuccess?: (authResponse: AuthResponse) => void;
  onAuthLoginFailure?: (error: string) => void;
  onAuthLogoutRequest?: () => void;
  
  // Theme events
  onThemeModeChange?: (mode: ThemeMode) => void;
  onColorThemeChange?: (colorTheme: ColorTheme) => void;
  
  // Legacy dashboard events
  updateDashboardAfterLogin?: () => void;
}

// Login page state
export interface LoginPageState {
  isFormVisible: boolean;
  showSecurityWarning: boolean;
  selectedLanguage: string;
  colorDropdownOpen: boolean;
  languageDropdownOpen: boolean;
}
