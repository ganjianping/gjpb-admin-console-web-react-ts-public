import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CSRFProtection } from '../../../shared-lib/src/utils/CSRFProtection';

interface CSRFInitializerProps {
  children: React.ReactNode;
  timeoutMs?: number;
}

/**
 * Component that initializes CSRF protection before rendering the app
 */
const CSRFInitializer = ({ children, timeoutMs = 3000 }: CSRFInitializerProps) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing security...');

  useEffect(() => {
    // Check if we might already have a token saved in session storage
    const hasStoredToken = sessionStorage.getItem('csrfToken') !== null;

    const initCSRF = async () => {
      try {
        console.info('Initializing CSRF protection...');
        const startTime = Date.now();
        await CSRFProtection.initializeToken();
        const elapsed = Date.now() - startTime;
        
        console.info(`CSRF token initialized successfully in ${elapsed}ms`);
        setInitialized(true);
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
        
        // Add a small delay before proceeding to avoid UI flashing
        setTimeout(() => setInitialized(true), 500);
      }
    };

    // If we already have a stored token, we can initialize faster
    if (hasStoredToken) {
      setLoadingMessage('Restoring security session...');
    }

    // Add a timeout to prevent infinite loading if CSRF token fetch hangs
    const timeoutId = setTimeout(() => {
      if (!initialized) {
        console.warn('CSRF initialization timed out, proceeding with app');
        setLoadingMessage('Security initialization timed out. Using fallback...');
        
        // Give the user time to read the message
        setTimeout(() => {
          setInitialized(true);
          setError(new Error('CSRF initialization timed out'));
          CSRFProtection.enableMockMode('Timeout during initialization');
        }, 800);
      }
    }, timeoutMs);
    
    initCSRF();
    
    return () => clearTimeout(timeoutId);
  }, [initialized, timeoutMs]);

  // Show loading indicator while initializing CSRF protection
  if (!initialized) {
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

  return <>{children}</>;
};

export default CSRFInitializer;
