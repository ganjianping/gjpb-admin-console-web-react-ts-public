import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { APP_CONFIG } from '../../../../shared-lib/src/utils/config';

// Theme type
export type ThemeMode = 'light' | 'dark';

// Language type
export type Language = 'en' | 'zh';

// UI state interface
interface UiState {
  themeMode: ThemeMode;
  language: Language;
  sidebarOpen: boolean;
  pageTitle: string;
}

// Get initial theme mode from localStorage or use default
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode;
  
  const savedTheme = localStorage.getItem(APP_CONFIG.THEME.STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode;
};

// Get initial language from localStorage or use default
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return APP_CONFIG.DEFAULT_LANGUAGE as Language;
  
  const savedLang = localStorage.getItem('gjpb_language');
  if (savedLang === 'en' || savedLang === 'zh') {
    return savedLang;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'zh') {
    return 'zh';
  }
  
  return APP_CONFIG.DEFAULT_LANGUAGE as Language;
};

// Initial state
const initialState: UiState = {
  themeMode: getInitialTheme(),
  language: getInitialLanguage(),
  sidebarOpen: true,
  pageTitle: 'Dashboard',
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(APP_CONFIG.THEME.STORAGE_KEY, action.payload);
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
    toggleThemeMode: (state) => {
      const newTheme = state.themeMode === 'light' ? 'dark' : 'light';
      state.themeMode = newTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem(APP_CONFIG.THEME.STORAGE_KEY, newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gjpb_language', action.payload);
        document.documentElement.setAttribute('lang', action.payload);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setThemeMode,
  toggleThemeMode,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  setPageTitle,
} = uiSlice.actions;

// Custom selectors
export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectIsDarkMode = (state: RootState) => state.ui.themeMode === 'dark';
export const selectLanguage = (state: RootState) => state.ui.language;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectPageTitle = (state: RootState) => state.ui.pageTitle;

export default uiSlice.reducer;