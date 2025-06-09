/**
 * Shared hooks for theme handling
 */
import { useState, useEffect, useCallback } from 'react';
import { APP_CONFIG } from '../utils/config';

type ThemeMode = 'light' | 'dark';

export const useThemeMode = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Read from localStorage, fall back to default or system preference
    const savedMode = localStorage.getItem(APP_CONFIG.THEME.STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode;
  });

  // Update localStorage and document attributes when mode changes
  useEffect(() => {
    localStorage.setItem(APP_CONFIG.THEME.STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
    
    // Optional: update meta theme-color for mobile devices
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        mode === 'dark' ? '#121212' : '#ffffff'
      );
    }
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  return { mode, setMode, toggleTheme, isDarkMode: mode === 'dark' };
};

export default useThemeMode;
