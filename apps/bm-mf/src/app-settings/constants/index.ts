/**
 * App Settings Constants
 * Centralized constants for app settings module
 */

export const APP_SETTING_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_LANGUAGE: 'EN',
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
  
  // Validation constraints
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  VALUE_MAX_LENGTH: 1000,
} as const;

export const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: 'Chinese' },
] as const;

export const STATUS_MAPS = {
  system: {
    true: { label: 'System', color: 'error' as const },
    false: { label: 'User', color: 'success' as const },
  },
  public: {
    true: { label: 'Public', color: 'success' as const },
    false: { label: 'Private', color: 'warning' as const },
  },
} as const;
