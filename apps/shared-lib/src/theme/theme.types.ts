// Shared theme types for all microfrontends
export type ThemeMode = 'light' | 'dark';

export type ColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'red';

export type Language = 'en' | 'zh';

export interface ThemeState {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  language: Language;
}

export interface ColorThemeOption {
  value: ColorTheme;
  label: string;
  color: string;
}

export interface LanguageOption {
  value: Language;
  label: string;
  flag: string;
}

// Microfrontend communication interface
export interface MicrofrontendCommunication {
  // Theme communication
  requestThemeChange: (themeMode: ThemeMode) => void;
  requestColorThemeChange: (colorTheme: ColorTheme) => void;
  requestLanguageChange: (language: Language) => void;
  
  // Check if communication is available
  isThemeCommunicationAvailable: () => boolean;
  
  // Authentication communication
  notifyLoginSuccess: (authResponse: any) => void;
  notifyLoginFailure: (error: string) => void;
}

// Window interface extension for microfrontend communication
declare global {
  interface Window {
    onThemeModeChange?: (mode: ThemeMode) => void;
    onColorThemeChange?: (colorTheme: ColorTheme) => void;
    onLanguageChange?: (language: Language) => void;
    onAuthLoginSuccess?: (authResponse: any) => void;
    onAuthLoginFailure?: (error: string) => void;
  }
}

export {};