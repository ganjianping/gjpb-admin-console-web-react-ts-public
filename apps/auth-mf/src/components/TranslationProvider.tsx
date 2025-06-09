import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import i18n from '../utils/i18n';

interface TranslationProviderProps {
  children: React.ReactNode;
}

/**
 * A simplified wrapper component that provides the i18n context to children
 */
const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = React.useState(i18n.isInitialized);

  React.useEffect(() => {
    // If i18n isn't initialized yet, wait for it
    if (!i18n.isInitialized) {
      const handleInitialized = () => {
        setIsReady(true);
      };
      
      i18n.on('initialized', handleInitialized);
      
      return () => {
        i18n.off('initialized', handleInitialized);
      };
    }
  }, []);

  // Show loading spinner while translations are being initialized
  if (!isReady) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Loading translations...</Typography>
      </Box>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default TranslationProvider;