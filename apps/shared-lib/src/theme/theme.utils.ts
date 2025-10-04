/**
 * Shared theme utilities
 */
import { APP_CONFIG } from '../core/config';
import type { ThemeMode, ColorTheme, Language, ColorThemeOption, LanguageOption } from './theme.types';

/**
 * Get initial theme mode from localStorage, system preference, or default
 */
export const getInitialThemeMode = (): ThemeMode => {
  // Server-side rendering safety check
  if (typeof window === 'undefined') {
    return APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode;
  }
  
  // 1st priority: User's previously saved preference
  const savedTheme = localStorage.getItem(APP_CONFIG.THEME.STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  // 2nd priority: System/OS dark mode preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // 3rd priority: Application configured default
  return APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode;
};

/**
 * Get initial color theme from localStorage or default
 */
export const getInitialColorTheme = (): ColorTheme => {
  // Server-side rendering safety check
  if (typeof window === 'undefined') {
    return APP_CONFIG.THEME.DEFAULT_COLOR_THEME as ColorTheme;
  }
  
  // 1st priority: User's previously saved preference
  const savedColorTheme = localStorage.getItem('gjpb_color_theme');
  if (savedColorTheme === 'blue' || savedColorTheme === 'purple' || savedColorTheme === 'green' || savedColorTheme === 'orange' || savedColorTheme === 'red') {
    return savedColorTheme;
  }
  
  // 2nd priority: Application configured default
  return APP_CONFIG.THEME.DEFAULT_COLOR_THEME as ColorTheme;
};

/**
 * Get initial language from localStorage, browser preference, or default
 */
export const getInitialLanguage = (): Language => {
  // Server-side rendering safety check
  if (typeof window === 'undefined') {
    return APP_CONFIG.DEFAULT_LANGUAGE as Language;
  }
  
  // 1st priority: User's previously saved preference
  const savedLanguage = localStorage.getItem('gjpb_language');
  if (savedLanguage === 'en' || savedLanguage === 'zh') {
    return savedLanguage;
  }
  
  // 2nd priority: Browser/system language preference
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'zh') {
    return 'zh';
  }
  
  // 3rd priority: Application configured default
  return APP_CONFIG.DEFAULT_LANGUAGE as Language;
};

/**
 * Apply theme mode to DOM and localStorage
 */
export const applyThemeMode = (themeMode: ThemeMode): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(APP_CONFIG.THEME.STORAGE_KEY, themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }
};

/**
 * Apply color theme to DOM and localStorage
 */
export const applyColorTheme = (colorTheme: ColorTheme): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gjpb_color_theme', colorTheme);
    document.documentElement.setAttribute('data-color-theme', colorTheme);
  }
};

/**
 * Apply language to localStorage
 */
export const applyLanguage = (language: Language): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gjpb_language', language);
  }
};

/**
 * Get color theme options with translations
 */
export const getColorThemeOptions = (t: (key: string, defaultValue?: string) => string): ColorThemeOption[] => [
  { value: 'blue', label: t('theme.colors.blue', 'Blue'), color: '#1976d2' },
  { value: 'purple', label: t('theme.colors.purple', 'Purple'), color: '#9c27b0' },
  { value: 'green', label: t('theme.colors.green', 'Green'), color: '#4caf50' },
  { value: 'orange', label: t('theme.colors.orange', 'Orange'), color: '#ff9800' },
  { value: 'red', label: t('theme.colors.red', 'Red'), color: '#f44336' },
];

/**
 * Get language options
 */
export const getLanguageOptions = (): LanguageOption[] => [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
];

/**
 * Check if system prefers dark mode
 */
export const systemPrefersDarkMode = (): boolean => {
  return typeof window !== 'undefined' && 
         window.matchMedia && 
         window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Create a system preference change listener
 */
export const createSystemPreferenceListener = (
  callback: (prefersDark: boolean) => void
): (() => void) | null => {
  if (typeof window === 'undefined') return null;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  
  mediaQuery.addEventListener('change', handler);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
};