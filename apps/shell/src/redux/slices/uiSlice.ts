import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { APP_CONFIG } from '../../../../shared-lib/src/utils/config';

// Theme type
export type ThemeMode = 'light' | 'dark';

// Color theme type
export type ColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'red';

// Language type
export type Language = 'en' | 'zh';

// UI state interface
interface UiState {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  language: Language;
  sidebarOpen: boolean;
  pageTitle: string;
}

// Get initial theme mode from localStorage, system preference, or use default
const getInitialTheme = (): ThemeMode => {
  console.log('[Shell Redux] 🎨 Getting initial theme...');
  
  // Server-side rendering safety check
  if (typeof window === 'undefined') {
    console.log('[Shell Redux] 🎨 Server-side rendering, using default:', APP_CONFIG.THEME.DEFAULT_THEME);
    return APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode;
  }
  
  // 1st priority: User's previously saved preference
  const savedTheme = localStorage.getItem(APP_CONFIG.THEME.STORAGE_KEY);
  console.log('[Shell Redux] 🎨 Saved theme from localStorage:', savedTheme);
  
  if (savedTheme === 'light' || savedTheme === 'dark') {
    console.log('[Shell Redux] 🎨 Using saved theme:', savedTheme);
    return savedTheme;
  }
  
  // 2nd priority: System/OS dark mode preference
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log('[Shell Redux] 🎨 System prefers dark mode:', systemPrefersDark);
  
  if (systemPrefersDark) {
    console.log('[Shell Redux] 🎨 Using system preference: dark');
    return 'dark';
  }
  
  // 3rd priority: Application configured default
  console.log('[Shell Redux] 🎨 Using app default:', APP_CONFIG.THEME.DEFAULT_THEME);
  return APP_CONFIG.THEME.DEFAULT_THEME as ThemeMode;
};

// Get initial language from localStorage, browser preference, or use default
const getInitialLanguage = (): Language => {
  // Server-side rendering safety check
  if (typeof window === 'undefined') {
    return APP_CONFIG.DEFAULT_LANGUAGE as Language;
  }
  
  // 1st priority: User's previously saved preference
  const savedLang = localStorage.getItem('gjpb_language');
  if (savedLang === 'en' || savedLang === 'zh') {
    return savedLang;
  }
  
  // 2nd priority: Browser/system language preference
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'zh') {
    return 'zh';
  }
  
  // 3rd priority: Application configured default
  return APP_CONFIG.DEFAULT_LANGUAGE as Language;
};

// Get initial color theme from localStorage or use default
const getInitialColorTheme = (): ColorTheme => {
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

// Initial state
const initialState: UiState = {
  themeMode: (() => {
    const theme = getInitialTheme();
    console.log('[Shell Redux] 🎨 Creating initial state with theme:', theme);
    return theme;
  })(),
  colorTheme: getInitialColorTheme(),
  language: getInitialLanguage(),
  sidebarOpen: true,
  pageTitle: APP_CONFIG.DEFAULT_PAGE_TITLE,
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      const timestamp = new Date().toISOString();
      console.log(`[Shell Redux] 🎨 setThemeMode called at ${timestamp}:`, {
        currentTheme: state.themeMode,
        newTheme: action.payload,
        caller: new Error().stack?.split('\n')[2]?.trim()
      });
      
      state.themeMode = action.payload;
      if (typeof window !== 'undefined') {
        console.log(`[Shell Redux] 🎨 Setting localStorage gjpb_theme to: ${action.payload}`);
        localStorage.setItem(APP_CONFIG.THEME.STORAGE_KEY, action.payload);
        document.documentElement.setAttribute('data-theme', action.payload);
        
        // Verify the storage was set
        const verifyStorage = localStorage.getItem(APP_CONFIG.THEME.STORAGE_KEY);
        console.log(`[Shell Redux] 🎨 Verified localStorage value: ${verifyStorage}`);
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
    setColorTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.colorTheme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gjpb_color_theme', action.payload);
        document.documentElement.setAttribute('data-color-theme', action.payload);
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
  setColorTheme,
  toggleSidebar,
  setSidebarOpen,
  setPageTitle,
} = uiSlice.actions;

// Custom selectors
export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectColorTheme = (state: RootState) => state.ui.colorTheme;
export const selectIsDarkMode = (state: RootState) => state.ui.themeMode === 'dark';
export const selectLanguage = (state: RootState) => state.ui.language;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectPageTitle = (state: RootState) => state.ui.pageTitle;

export default uiSlice.reducer;