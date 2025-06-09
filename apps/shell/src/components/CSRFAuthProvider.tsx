import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CSRFProtection } from '../../../shared-lib/src/utils/CSRFProtection';
import { APP_ENV } from '../../../shared-lib/src/utils/config';

// Create a context to expose CSRF status to child components
interface CSRFContextType {
  csrfToken: string | null;
  isInitialized: boolean;
  error: Error | null;
  refreshToken: () => Promise<string | null>;
}

const CSRFContext = createContext<CSRFContextType>({
  csrfToken: null,
  isInitialized: false,
  error: null,
  refreshToken: async () => null,
});

/**
 * Hook to access CSRF context
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useCSRF = () => useContext(CSRFContext);

interface CSRFAuthProviderProps {
  children: ReactNode;
  timeoutMs?: number;
}

/**
 * Enhanced version of CSRFInitializer that provides context values
 * to child components and handles token refreshing
 */
export const CSRFAuthProvider = ({ 
  children, 
  timeoutMs = 3000 
}: CSRFAuthProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing security...');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Function that can be called by components to refresh the token
  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await CSRFProtection.initializeToken();
      setCsrfToken(token);
      return token;
    } catch (err) {
      console.error('Failed to refresh CSRF token:', err);
      return null;
    }
  }, []);

  // Context value to provide to children
  const contextValue: CSRFContextType = {
    csrfToken,
    isInitialized,
    error,
    refreshToken,
  };

  useEffect(() => {
    // Check if we might already have a token saved in session storage
    const hasStoredToken = sessionStorage.getItem('csrfToken') !== null;

    const initCSRF = async () => {
      try {
        console.info('Initializing CSRF protection...');
        const startTime = Date.now();
        const token = await CSRFProtection.initializeToken();
        const elapsed = Date.now() - startTime;
        
        console.info(`CSRF token initialized successfully in ${elapsed}ms`);
        setCsrfToken(token);
        setIsInitialized(true);
      } catch (err: unknown) {
        // Enhanced error handling with more specific messages
        const error = err as { response?: { status?: number }; code?: string; message?: string };
        const isServerError = error?.response?.status === 500;
        const isNetworkError = error?.code === 'ECONNABORTED' || 
                               error?.message?.includes('Network Error');
        
        if (isServerError) {
          console.warn('Server returned 500 error during CSRF initialization - using fallback');
          setLoadingMessage('Security service reported an error. Using fallback...');
        } else if (isNetworkError) {
          console.warn('Network error during CSRF initialization - using fallback');
          setLoadingMessage('Network error. Using fallback security...');
        } else {
          console.error('Failed to initialize CSRF protection:', err);
          setLoadingMessage('Security initialization failed. Continuing with limited protection...');
        }
        
        // We'll continue without CSRF token in case of error
        setError(err as Error);
        setCsrfToken(CSRFProtection.getToken());
        
        // Add a small delay before proceeding to avoid UI flashing
        setTimeout(() => setIsInitialized(true), 500);
      }
    };

    // If we already have a stored token, we can initialize faster
    if (hasStoredToken) {
      setLoadingMessage('Restoring security session...');
    }

    // Add a timeout to prevent infinite loading if CSRF token fetch hangs
    const timeoutId = setTimeout(() => {
      if (!isInitialized) {
        console.warn('CSRF initialization timed out, proceeding with app');
        setLoadingMessage('Security initialization timed out. Using fallback...');
        
        // Give the user time to read the message
        setTimeout(() => {
          setIsInitialized(true);
          setError(new Error('CSRF initialization timed out'));
          CSRFProtection.enableMockMode('Timeout during initialization');
          setCsrfToken(CSRFProtection.getToken());
        }, 800);
      }
    }, timeoutMs);
    
    initCSRF();
    
    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [timeoutMs, isInitialized]);

  // Automatically attempt to refresh token at regular intervals if in development mode
  useEffect(() => {
    let refreshInterval: number | undefined;
    
    // Only in development mode, refresh token every 15 minutes
    if (isInitialized && APP_ENV.DEV && !error) {
      refreshInterval = window.setInterval(() => {
        console.info('Auto-refreshing CSRF token (dev mode)');
        refreshToken().catch(err => {
          console.warn('Failed to auto-refresh CSRF token:', err);
        });
      }, 15 * 60 * 1000); // 15 minutes
    }
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [isInitialized, error, refreshToken]);

  // Show loading indicator while initializing CSRF protection
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {loadingMessage}
        </Typography>
      </Box>
    );
  }

  // Log error but still render the app
  if (error) {
    console.warn('App running with fallback security protection:', error.message);
  }

  return (
    <CSRFContext.Provider value={contextValue}>
      {children}
    </CSRFContext.Provider>
  );
};

export default CSRFAuthProvider;
