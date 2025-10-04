/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling across the user management module
 */

import { ApiError } from '../../../../shared-lib/src/api/api-client';
import { ERROR_MESSAGES } from '../constants';

/**
 * Handles API errors and returns a user-friendly error message
 * @param error - The error object from the API call
 * @param defaultMessage - Optional default message if error type is unknown
 * @returns A formatted error message string
 */
export const handleApiError = (error: unknown, defaultMessage?: string): string => {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    return error.message || defaultMessage || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return error.message;
  }

  // Handle network errors
  if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'NetworkError') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Return default message for unknown errors
  return defaultMessage || ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * Extracts validation errors from API response
 * @param apiErrors - The errors object from the API response
 * @returns A record of field names to error message arrays
 */
export const extractValidationErrors = (apiErrors: any): Record<string, string[]> => {
  const validationErrors: Record<string, string[]> = {};

  if (!apiErrors || typeof apiErrors !== 'object') {
    return validationErrors;
  }

  // Process each error field
  Object.entries(apiErrors).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      // Already an array of error messages
      validationErrors[field] = value;
    } else if (typeof value === 'string') {
      // Single error message
      validationErrors[field] = [value];
    } else if (value && typeof value === 'object') {
      // Nested error object
      validationErrors[field] = [JSON.stringify(value)];
    }
  });

  return validationErrors;
};

/**
 * Formats validation errors for display in form fields (joined)
 * Converts array of errors to a single string
 * @param errors - Record of field names to error arrays
 * @returns Formatted errors ready for form display
 */
export const formatValidationErrorsAsString = (
  errors: Record<string, string[]>
): Record<string, string> => {
  const formatted: Record<string, string> = {};

  Object.entries(errors).forEach(([field, errorArray]) => {
    formatted[field] = errorArray.join(', ');
  });

  return formatted;
};

/**
 * Formats validation errors for display in form fields (as array)
 * Keeps errors as arrays for granular display
 * @param errors - Record of field names to error arrays
 * @returns Formatted errors ready for form display
 */
export const formatValidationErrorsAsArray = (
  errors: Record<string, string[]>
): Record<string, string[]> => {
  return { ...errors };
};

/**
 * Processes API errors and returns formatted validation errors (as strings)
 * Combines extraction and formatting in one convenient function
 * @param apiErrors - The errors object from the API response
 * @returns Formatted errors ready for form display
 */
export const processApiErrors = (apiErrors: any): Record<string, string> => {
  const extracted = extractValidationErrors(apiErrors);
  return formatValidationErrorsAsString(extracted);
};

/**
 * Checks if an error is a validation error (400 Bad Request)
 * @param error - The error object
 * @returns True if the error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return error.code === 400;
  }
  return false;
};

/**
 * Checks if an error is an authorization error (401/403)
 * @param error - The error object
 * @returns True if the error is an authorization error
 */
export const isAuthorizationError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return error.code === 401 || error.code === 403;
  }
  return false;
};

/**
 * Checks if an error is a not found error (404)
 * @param error - The error object
 * @returns True if the error is a not found error
 */
export const isNotFoundError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return error.code === 404;
  }
  return false;
};

/**
 * Gets a user-friendly error title based on error type
 * @param error - The error object
 * @returns A user-friendly error title
 */
export const getErrorTitle = (error: unknown): string => {
  if (isValidationError(error)) {
    return 'Validation Error';
  }
  if (isAuthorizationError(error)) {
    return 'Authorization Error';
  }
  if (isNotFoundError(error)) {
    return 'Not Found';
  }
  return 'Error';
};
