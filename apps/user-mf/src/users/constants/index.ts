/**
 * User Management Constants
 * Centralized constants for users module
 */

export const USER_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  
  // Sorting
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
  
  // Validation constraints
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  NICKNAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  MOBILE_NUMBER_LENGTH: 10,
  
  // Default values
  DEFAULT_ACCOUNT_STATUS: 'active' as const,
  DEFAULT_MOBILE_COUNTRY_CODE: '+1',
} as const;

export const ACCOUNT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'locked', label: 'Locked' },
  { value: 'pending', label: 'Pending' },
] as const;

export const ACTIVE_STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
] as const;

export const STATUS_MAPS = {
  accountStatus: {
    active: { label: 'Active', color: 'success' as const },
    inactive: { label: 'Inactive', color: 'warning' as const },
    locked: { label: 'Locked', color: 'error' as const },
    pending: { label: 'Pending', color: 'info' as const },
  },
  active: {
    true: { label: 'Yes', color: 'success' as const },
    false: { label: 'No', color: 'error' as const },
  },
} as const;

export const MOBILE_COUNTRY_CODES = [
  { value: '+1', label: '+1 (US/Canada)' },
  { value: '+86', label: '+86 (China)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+91', label: '+91 (India)' },
  { value: '+61', label: '+61 (Australia)' },
] as const;

// API Error Messages
export const ERROR_MESSAGES = {
  LOAD_FAILED: 'Failed to load users',
  CREATE_FAILED: 'Failed to create user',
  UPDATE_FAILED: 'Failed to update user',
  DELETE_FAILED: 'Failed to delete user',
  VALIDATION_FAILED: 'Please correct the errors below',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'User created successfully',
  UPDATE_SUCCESS: 'User updated successfully',
  DELETE_SUCCESS: 'User deleted successfully',
} as const;
