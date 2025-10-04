/**
 * Shared microfrontend communication service
 * Provides unified communication between shell and microfrontends
 */
import type { ThemeMode, ColorTheme, Language, MicrofrontendCommunication } from '../theme/theme.types';

export class MicrofrontendThemeCommunication implements MicrofrontendCommunication {
  private static instance: MicrofrontendThemeCommunication;
  private readonly appName: string;

  private constructor(appName: string) {
    this.appName = appName;
  }

  static getInstance(appName: string): MicrofrontendThemeCommunication {
    if (!MicrofrontendThemeCommunication.instance) {
      MicrofrontendThemeCommunication.instance = new MicrofrontendThemeCommunication(appName);
    }
    return MicrofrontendThemeCommunication.instance;
  }

  /**
   * Request theme mode change from shell
   */
  requestThemeChange(themeMode: ThemeMode): void {
    try {
      if (typeof window !== 'undefined' && window.onThemeModeChange) {
        console.log(`[${this.appName}] 🎨 Requesting theme change to: ${themeMode}`);
        window.onThemeModeChange(themeMode);
      } else {
        console.warn(`[${this.appName}] 🎨 Theme communication not available - shell handler missing`);
        // Fallback: handle locally
        this.handleThemeLocally(themeMode);
      }
    } catch (error) {
      console.error(`[${this.appName}] 🎨 Error requesting theme change:`, error);
      this.handleThemeLocally(themeMode);
    }
  }

  /**
   * Request color theme change from shell
   */
  requestColorThemeChange(colorTheme: ColorTheme): void {
    try {
      if (typeof window !== 'undefined' && window.onColorThemeChange) {
        console.log(`[${this.appName}] 🎨 Requesting color theme change to: ${colorTheme}`);
        window.onColorThemeChange(colorTheme);
      } else {
        console.warn(`[${this.appName}] 🎨 Color theme communication not available - shell handler missing`);
        // Fallback: handle locally
        this.handleColorThemeLocally(colorTheme);
      }
    } catch (error) {
      console.error(`[${this.appName}] 🎨 Error requesting color theme change:`, error);
      this.handleColorThemeLocally(colorTheme);
    }
  }

  /**
   * Request language change from shell
   */
  requestLanguageChange(language: Language): void {
    try {
      if (typeof window !== 'undefined' && window.onLanguageChange) {
        console.log(`[${this.appName}] 🌍 Requesting language change to: ${language}`);
        window.onLanguageChange(language);
      } else {
        console.warn(`[${this.appName}] 🌍 Language communication not available - shell handler missing`);
        // Fallback: handle locally
        this.handleLanguageLocally(language);
      }
    } catch (error) {
      console.error(`[${this.appName}] 🌍 Error requesting language change:`, error);
      this.handleLanguageLocally(language);
    }
  }

  /**
   * Check if theme communication is available
   */
  isThemeCommunicationAvailable(): boolean {
    return typeof window !== 'undefined' && 
           (!!window.onThemeModeChange || !!window.onColorThemeChange || !!window.onLanguageChange);
  }

  /**
   * Notify shell of successful login
   */
  notifyLoginSuccess(authResponse: any): void {
    try {
      if (typeof window !== 'undefined' && window.onAuthLoginSuccess) {
        console.log(`[${this.appName}] ✅ Notifying shell of login success`);
        window.onAuthLoginSuccess(authResponse);
      } else {
        console.warn(`[${this.appName}] ✅ Login success communication not available`);
      }
    } catch (error) {
      console.error(`[${this.appName}] ✅ Error notifying login success:`, error);
    }
  }

  /**
   * Notify shell of login failure
   */
  notifyLoginFailure(error: string): void {
    try {
      if (typeof window !== 'undefined' && window.onAuthLoginFailure) {
        console.log(`[${this.appName}] ❌ Notifying shell of login failure:`, error);
        window.onAuthLoginFailure(error);
      } else {
        console.warn(`[${this.appName}] ❌ Login failure communication not available`);
      }
    } catch (error) {
      console.error(`[${this.appName}] ❌ Error notifying login failure:`, error);
    }
  }

  /**
   * Fallback: Handle theme locally when shell communication is not available
   */
  private handleThemeLocally(themeMode: ThemeMode): void {
    console.log(`[${this.appName}] 🎨 Handling theme locally: ${themeMode}`);
    localStorage.setItem('gjpb_theme', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }

  /**
   * Fallback: Handle color theme locally
   */
  private handleColorThemeLocally(colorTheme: ColorTheme): void {
    console.log(`[${this.appName}] 🎨 Handling color theme locally: ${colorTheme}`);
    localStorage.setItem('gjpb_color_theme', colorTheme);
    document.documentElement.setAttribute('data-color-theme', colorTheme);
  }

  /**
   * Fallback: Handle language locally
   */
  private handleLanguageLocally(language: Language): void {
    console.log(`[${this.appName}] 🌍 Handling language locally: ${language}`);
    localStorage.setItem('gjpb_language', language);
  }
}

// Export convenience function
export const createMicrofrontendCommunication = (appName: string): MicrofrontendThemeCommunication => {
  return MicrofrontendThemeCommunication.getInstance(appName);
};

export default MicrofrontendThemeCommunication;