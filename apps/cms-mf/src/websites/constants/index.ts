/**
 * Website Constants
 * Centralized constants for websites module
 */

export const WEBSITE_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // Defaults
  DEFAULT_LANGUAGE: 'EN',
  DEFAULT_DISPLAY_ORDER: 0,
  
  // Sorting
  SORT_FIELD: 'updatedAt' as const,
  SORT_DIRECTION: 'desc' as const,
  
  // Validation constraints
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 200,
    URL_MAX_LENGTH: 500,
    LOGO_URL_MAX_LENGTH: 500,
    DESCRIPTION_MAX_LENGTH: 2000,
    TAGS_MAX_LENGTH: 200,
    LANG_LENGTH: 2,
  },
  
  // Keep old keys for backward compatibility
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 200,
  URL_MAX_LENGTH: 500,
} as const;

export const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: 'Chinese' },
] as const;

export const STATUS_MAPS = {
  active: {
    true: { label: 'Active', color: 'success' as const },
    false: { label: 'Inactive', color: 'default' as const },
  },
} as const;
