import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { i18n as I18nInstance } from 'i18next';
import defaultI18n from '../utils/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
  /**
   * Custom i18n instance. If not provided, uses the shared-lib default instance
   */
  i18nInstance?: I18nInstance;
  /**
   * Custom loading component to show while i18n is initializing
   */
  loadingComponent?: React.ReactNode;
  /**
   * Custom loading text. Defaults to "Loading translations..."
   */
  loadingText?: string;
  /**
   * Whether to show full-height loading screen. Defaults to true
   */
  fullHeight?: boolean;
}

/**
 * A generic wrapper component that provides the i18n context to children
 * Can be customized for different microfrontends' needs
 */
const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  i18nInstance = defaultI18n,
  loadingComponent,
  loadingText = 'Loading translations...',
  fullHeight = true
}) => {
  const [isReady, setIsReady] = React.useState(i18nInstance.isInitialized);

  React.useEffect(() => {
    // If i18n isn't initialized yet, wait for it
    if (!i18nInstance.isInitialized) {
      const handleInitialized = () => {
        setIsReady(true);
      };
      
      i18nInstance.on('initialized', handleInitialized);
      
      return () => {
        i18nInstance.off('initialized', handleInitialized);
      };
    }
  }, [i18nInstance]);

  // Show loading while translations are being initialized
  if (!isReady) {
    // Use custom loading component if provided
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    // Default loading component
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          height: fullHeight ? '100vh' : 'auto',
          gap: 2,
          padding: fullHeight ? 0 : 4
        }}
      >
        <CircularProgress />
        <Typography>{loadingText}</Typography>
      </Box>
    );
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;
