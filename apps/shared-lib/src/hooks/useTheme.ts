/**
 * Shared theme synchronization hook
 * Manages theme state, localStorage sync, and microfrontend communication
 */
import { useState, useEffect, useCallback } from 'react';
import type { ThemeMode, ColorTheme, Language, ThemeState } from '../types/theme.types';
import { MicrofrontendThemeCommunication } from '../services/microfrontend-communication.service';
import {
  getInitialThemeMode,
  getInitialColorTheme,
  getInitialLanguage,
  applyThemeMode,
  applyColorTheme,
  applyLanguage,
  createSystemPreferenceListener
} from '../utils/theme.utils';

interface UseThemeOptions {
  appName: string;
  enableSystemPreferenceSync?: boolean;
  enableDebugging?: boolean;
}

export const useTheme = ({ 
  appName, 
  enableSystemPreferenceSync = true,
  enableDebugging = false 
}: UseThemeOptions) => {
  // Initialize communication service
  const communication = MicrofrontendThemeCommunication.getInstance(appName);
  
  // Theme state
  const [themeState, setThemeState] = useState<ThemeState>(() => ({
    themeMode: getInitialThemeMode(),
    colorTheme: getInitialColorTheme(),
    language: getInitialLanguage()
  }));

  const debug = useCallback((message: string, ...args: any[]) => {
    if (enableDebugging) {
      console.log(`[${appName}] 🎨 ${message}`, ...args);
    }
  }, [appName, enableDebugging]);

  // Handle storage changes from other tabs/windows or shell
  useEffect(() => {
    const handleStorageChange = (event?: StorageEvent) => {
      debug('Storage change detected', event?.key, event?.newValue);
      
      // Only update if the storage event is for theme-related keys
      if (event && !['gjpb_theme', 'gjpb_color_theme', 'gjpb_language'].includes(event.key || '')) {
        debug('Ignoring storage event for key:', event.key);
        return;
      }
      
      // Read current values from storage
      const currentThemeInStorage = localStorage.getItem('gjpb_theme') as ThemeMode | null;
      const currentColorInStorage = localStorage.getItem('gjpb_color_theme') as ColorTheme | null;
      const currentLanguageInStorage = localStorage.getItem('gjpb_language') as Language | null;
      
      const newThemeMode = currentThemeInStorage || getInitialThemeMode();
      const newColorTheme = currentColorInStorage || getInitialColorTheme();
      const newLanguage = currentLanguageInStorage || getInitialLanguage();
      
      debug('Reading from localStorage:', {
        theme: newThemeMode,
        color: newColorTheme,
        language: newLanguage
      });
      
      // Update state if values changed
      setThemeState(prev => {
        const needsUpdate = 
          prev.themeMode !== newThemeMode ||
          prev.colorTheme !== newColorTheme ||
          prev.language !== newLanguage;
          
        if (needsUpdate) {
          debug('Updating theme state:', { newThemeMode, newColorTheme, newLanguage });
          return {
            themeMode: newThemeMode,
            colorTheme: newColorTheme,
            language: newLanguage
          };
        }
        
        return prev;
      });
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check on mount
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [debug]);

  // System preference listener
  useEffect(() => {
    if (!enableSystemPreferenceSync) return;

    const cleanup = createSystemPreferenceListener((prefersDark) => {
      debug('System theme preference changed to:', prefersDark ? 'dark' : 'light');
      
      // Only update if user hasn't explicitly set a theme
      const hasUserTheme = localStorage.getItem('gjpb_theme');
      if (!hasUserTheme) {
        const systemTheme: ThemeMode = prefersDark ? 'dark' : 'light';
        debug('No user preference saved, updating to system preference:', systemTheme);
        setThemeMode(systemTheme);
      } else {
        debug('User has saved preference, ignoring system change');
      }
    });

    return cleanup || undefined;
  }, [enableSystemPreferenceSync, debug]);

  // Theme mode handlers
  const setThemeMode = useCallback((newThemeMode: ThemeMode) => {
    debug('Setting theme mode:', newThemeMode);
    
    // Update local state
    setThemeState(prev => ({ ...prev, themeMode: newThemeMode }));
    
    // Apply to DOM and localStorage
    applyThemeMode(newThemeMode);
    
    // Communicate with shell
    communication.requestThemeChange(newThemeMode);
  }, [communication, debug]);

  const toggleThemeMode = useCallback(() => {
    const newMode: ThemeMode = themeState.themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  }, [themeState.themeMode, setThemeMode]);

  // Color theme handlers
  const setColorTheme = useCallback((newColorTheme: ColorTheme) => {
    debug('Setting color theme:', newColorTheme);
    
    // Update local state
    setThemeState(prev => ({ ...prev, colorTheme: newColorTheme }));
    
    // Apply to DOM and localStorage
    applyColorTheme(newColorTheme);
    
    // Communicate with shell
    communication.requestColorThemeChange(newColorTheme);
  }, [communication, debug]);

  // Language handlers
  const setLanguage = useCallback((newLanguage: Language) => {
    debug('Setting language:', newLanguage);
    
    // Update local state
    setThemeState(prev => ({ ...prev, language: newLanguage }));
    
    // Apply to localStorage
    applyLanguage(newLanguage);
    
    // Communicate with shell
    communication.requestLanguageChange(newLanguage);
  }, [communication, debug]);

  return {
    // State
    themeMode: themeState.themeMode,
    colorTheme: themeState.colorTheme,
    language: themeState.language,
    isDarkMode: themeState.themeMode === 'dark',
    
    // Handlers
    setThemeMode,
    toggleThemeMode,
    setColorTheme,
    setLanguage,
    
    // Utilities
    communication,
    isThemeCommunicationAvailable: communication.isThemeCommunicationAvailable()
  };
};

export default useTheme;