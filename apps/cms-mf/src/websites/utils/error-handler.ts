/**
 * Format error messages from errors object
 */
const formatErrorMessages = (errors: any): string => {
  // If errors is an object with field-specific errors
  if (typeof errors === 'object' && !Array.isArray(errors)) {
    const errorMessages = Object.entries(errors)
      .map(([_field, messages]) => {
        if (Array.isArray(messages)) {
          return messages.join(', ');
        }
        return String(messages);
      })
      .filter(Boolean);
    
    if (errorMessages.length > 0) {
      return errorMessages.join('; ');
    }
  }
  
  // If errors is an array
  if (Array.isArray(errors)) {
    return errors.join(', ');
  }
  
  // If errors is a string
  if (typeof errors === 'string') {
    return errors;
  }
  
  return '';
};

/**
 * Handle API errors and return user-friendly error messages
 */
export const handleApiError = (error: any): string => {
  console.error('API Error:', error);

  // If it's an ApiResponse with error status
  if (error?.status?.code && error?.status?.code !== 200) {
    // Check for validation errors
    if (error.status.errors) {
      const errorMessage = formatErrorMessages(error.status.errors);
      if (errorMessage) {
        return errorMessage;
      }
    }
    
    // Use the message from status
    if (error.status.message) {
      return error.status.message;
    }
  }

  // Network or other errors
  if (error?.message) {
    return error.message;
  }

  // Default error message
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract validation errors from API response
 */
export const extractValidationErrors = (error: any): Record<string, string[] | string> => {
  if (error?.status?.errors) {
    const errors = error.status.errors;
    
    if (typeof errors === 'object' && !Array.isArray(errors)) {
      return errors;
    }
  }
  
  return {};
};

/**
 * Format tags array to comma-separated string
 */
export const formatTagsToString = (tags: string[]): string => {
  return tags.join(',');
};

/**
 * Parse comma-separated tags string to array
 */
export const parseTagsFromString = (tags: string): string[] => {
  return tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
