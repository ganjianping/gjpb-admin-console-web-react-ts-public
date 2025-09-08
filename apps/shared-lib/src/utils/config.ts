/**
 * Environment configuration for GJPB Admin Console
 */

export const APP_ENV = {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE ?? 'development',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
};

export const APP_CONFIG = {
  APP_NAME: 'Admin Console',
  APP_VERSION: '1.0.0',
  COPYRIGHT: `© ${new Date().getFullYear()} GJPB All Rights Reserved`,
  DEFAULT_LANGUAGE: 'en',
  AVAILABLE_LANGUAGES: ['en', 'zh'],
  TOKEN: {
    ACCESS_TOKEN_KEY: 'gjpb_access_token',
    REFRESH_TOKEN_KEY: 'gjpb_refresh_token',
    TOKEN_TYPE_KEY: 'gjpb_token_type',
  },
  THEME: {
    DEFAULT_THEME: 'light',
    STORAGE_KEY: 'gjpb_theme',
  },
  ROUTES: {
    HOME: '/',
    LOGIN: '/auth/login',
    DASHBOARD: '/dashboard',
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/404',
  },
  AUTH: {
    LOGIN_URL: '/v1/auth/tokens',
    REFRESH_TOKEN_URL: '/v1/auth/tokens', // Same endpoint, different HTTP method (PUT)
    TOKEN_EXPIRY_BUFFER: 300, // 5 minutes in seconds
  },
};

export default { APP_ENV, APP_CONFIG };
