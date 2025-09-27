/// <reference types="vite/client" />

// Extend the Window interface to include microfrontend communication methods
declare global {
  interface Window {
    onAuthLoginSuccess?: (authResponse: any) => void;
    onAuthLoginFailure?: (error: any) => void;
    onAuthLogoutRequest?: () => void;
    onThemeModeChange?: (mode: string) => void;
    onColorThemeChange?: (colorTheme: string) => void;
  }
}
