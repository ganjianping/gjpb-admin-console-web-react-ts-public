/**
 * Error Handler Utilities
 * Centralized error handling for app settings module
 */

/**
 * Translation function type
 */
type TFunction = (key: string, options?: any) => string;

/**
 * Custom API Error class with additional context
 */
export class ApiError extends Error {
  code: number;
  errors?: Record<string, string[] | string>;

  constructor(
    message: string,
    code: number = 500,
    errors?: Record<string, string[] | string>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.errors = errors;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Handles API errors and returns a user-friendly error message
 * @param error - The error object
 * @param t - Translation function
 * @param fallbackMessage - Optional fallback message key
 * @returns User-friendly error message
 */
export const handleApiError = (
  error: unknown,
  t: TFunction,
  fallbackMessage: string = 'common.errors.unknown'
): string => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle axios-like error responses
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    if (err.response?.data?.status?.message) {
      return err.response.data.status.message;
    }
    if (err.message) {
      return err.message;
    }
  }
  
  return t(fallbackMessage);
};

/**
 * Extract validation errors from API response
 * @param error - The error object
 * @returns Record of field errors
 */
export const extractValidationErrors = (
  error: unknown
): Record<string, string[] | string> => {
  if (error instanceof ApiError && error.errors) {
    return error.errors;
  }
  
  // Handle axios-like error responses
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    if (err.response?.data?.status?.errors) {
      return err.response.data.status.errors;
    }
  }
  
  return {};
};
