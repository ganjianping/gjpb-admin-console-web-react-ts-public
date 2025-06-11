import axios from 'axios';
import { APP_ENV } from '../utils/config';

/**
 * CSRF protection utility for the application
 */
export class CSRFProtection {
  private static csrfToken: string | null = null;
  private static mockEnabled = APP_ENV.ENABLE_MOCK_CSRF || false;
  
  /**
   * Get the current CSRF token
   * @returns The current CSRF token or null if not set
   */
  static getToken(): string | null {
    return CSRFProtection.csrfToken;
  }
  
  /**
   * Set the CSRF token
   * @param token The CSRF token to set
   */
  static setToken(token: string): void {
    CSRFProtection.csrfToken = token;
    
    // Store in sessionStorage for resilience across page reloads in the same session
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('csrfToken', token);
      }
    } catch {
      // Ignore errors if sessionStorage is not available
    }
  }
  
  /**
   * Clear the stored CSRF token
   */
  static clearToken(): void {
    CSRFProtection.csrfToken = null;
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('csrfToken');
      }
    } catch {
      // Ignore errors if sessionStorage is not available
    }
  }

  /**
   * Enable mock mode - useful for testing or when backend is not available
   * @param reason Optional reason for enabling mock mode for logging purposes
   */
  static enableMockMode(reason?: string): void {
    if (CSRFProtection.mockEnabled) {
      // Already in mock mode
      return;
    }
    
    CSRFProtection.mockEnabled = true;
    const mockToken = CSRFProtection.createMockToken();
    CSRFProtection.setToken(mockToken);
    
    // Log different levels based on environment
    if (CSRFProtection.isDevelopment()) {
      console.info(`CSRF protection running in mock mode${reason ? ` (${reason})` : ''} with token:`, mockToken);
    } else {
      console.warn(`CSRF protection running in mock mode in PRODUCTION${reason ? ` (${reason})` : ''}`);
      
      // In production, we might want to send this to an error monitoring service
      if (typeof window !== 'undefined') {
        // Simple metric tracking that could be extended with a real monitoring service
        try {
          const mockEventCount = parseInt(sessionStorage.getItem('csrf_mock_event_count') || '0', 10) + 1;
          sessionStorage.setItem('csrf_mock_event_count', mockEventCount.toString());
          
          // Could integrate with a real monitoring service here
          // e.g., Sentry, LogRocket, etc.
        } catch {
          // Ignore storage errors
        }
      }
    }
  }
  
  /**
   * Check if we're in a development environment
   */
  private static isDevelopment(): boolean {
    return APP_ENV.DEV || (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  }

  /**
   * Create a mock token for development mode
   */
  private static createMockToken(prefix = 'dev'): string {
    const env = CSRFProtection.isDevelopment() ? 'dev' : 'prod';
    return `${prefix}-${env}-csrf-mock-token-${Date.now()}`;
  }
  
  /**
   * Try to restore token from session storage
   * @returns True if token was restored successfully
   */
  private static tryRestoreToken(): boolean {
    try {
      if (typeof window !== 'undefined') {
        const storedToken = sessionStorage.getItem('csrfToken');
        if (storedToken) {
          CSRFProtection.csrfToken = storedToken;
          return true;
        }
      }
    } catch {
      // Ignore errors if sessionStorage is not available
    }
    return false;
  }

  static async initializeToken(): Promise<string> {
    // If we're explicitly set to mock mode via env var, log this
    if (APP_ENV.ENABLE_MOCK_CSRF && !CSRFProtection.mockEnabled) {
      console.info('CSRF mock mode enabled via environment configuration');
      CSRFProtection.mockEnabled = true;
    }
    
    // If we're in mock mode, immediately use a mock token
    if (CSRFProtection.mockEnabled) {
      const mockToken = CSRFProtection.createMockToken();
      CSRFProtection.setToken(mockToken);
      return Promise.resolve(mockToken);
    }

    // Try to restore token from session storage first
    if (CSRFProtection.tryRestoreToken()) {
      console.info('CSRF token restored from session storage');
      return CSRFProtection.csrfToken as string;
    }

    // Get environment details for better error handling
    const isDev = CSRFProtection.isDevelopment();
    
    try {
      // In development mode, log info about the attempt
      if (isDev && !sessionStorage.getItem('csrf_mock_warning_shown')) {
        console.info('Running in development mode. Attempting to get CSRF token...');
        sessionStorage.setItem('csrf_mock_warning_shown', 'true');
      }

      // Use VITE_API_BASE_URL from APP_ENV
      const response = await axios.get(`${APP_ENV.VITE_API_BASE_URL}/csrf-token`, {
        withCredentials: true,
        timeout: 3000, // Shorter timeout for development
        validateStatus: (status) => status < 500, // Don't reject on 4xx errors, only on 5xx
      });
      
      // Check for successful response (2xx status codes)
      if (response.status >= 200 && response.status < 300) {
        const token = response.data?.csrfToken;
        
        if (token) {
          console.info('Retrieved CSRF token from server');
          CSRFProtection.setToken(token);
          return token;
        }
      }
      
      // If we reached here, we either got a non-2xx status or no token in the response
      console.warn(`CSRF token retrieval issue: ${response.status} ${response.statusText}`);        // Fall back to mock token in development mode
        if (isDev) {
          CSRFProtection.enableMockMode('No token in response');
          return CSRFProtection.getToken() as string;
        }
      
      throw new Error(`Failed to retrieve CSRF token: ${response.status} ${response.statusText}`);
    } catch (error: unknown) {
      // Handle specific error types
      const errorMsg = (error as Error)?.message ?? 'Unknown error';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statusCode = (error as any)?.response?.status ?? 'No status';
      
      // Special handling for 500 errors (server errors)
      if (statusCode === 500) {
        console.error(`Server error (500) when initializing CSRF token: ${errorMsg}`);
        
        // In any environment, we should fall back to a mock token for 500 errors
        // since these are server-side issues that the user can't fix
        console.warn('Using fallback CSRF token due to server error 500');
        CSRFProtection.enableMockMode('Server returned 500 error');
        return CSRFProtection.getToken() as string;
      }
      
      console.error(`Failed to initialize CSRF token: ${statusCode} - ${errorMsg}`, error);
      
      // Always use a mock token in development mode for any error
      if (isDev) {
        CSRFProtection.enableMockMode(`Development fallback for error: ${statusCode}`);
        return CSRFProtection.getToken() as string;
      }
      
      // In production, for non-500 errors, we might still want to fail
      // unless we decide that all errors should be handled with a mock token
      throw error;
    }
  }
  
  /**
   * Apply CSRF token to request headers
   * @param headers Request headers object
   * @returns Updated headers with CSRF token
   */
  static applyToHeaders(headers: Record<string, string> = {}): Record<string, string> {
    if (CSRFProtection.csrfToken) {
      return {
        ...headers,
        'X-CSRF-Token': CSRFProtection.csrfToken,
      };
    }
    
    // If we don't have a token and we're in development, enable mock mode
    if (CSRFProtection.isDevelopment() && !CSRFProtection.csrfToken) {
      CSRFProtection.enableMockMode('No token available for request headers');
      return {
        ...headers,
        'X-CSRF-Token': CSRFProtection.csrfToken || '',
      };
    }
    
    // In production without a token, we'll still return the headers without a CSRF token
    // This may lead to CSRF protection failures, but it's better than breaking all requests
    console.warn('Applying headers without CSRF token');
    return headers;
  }
}
