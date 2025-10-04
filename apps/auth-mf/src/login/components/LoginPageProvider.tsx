import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { getAuthMfStore } from '../../core/store';
import { LoginPage } from '../pages/LoginPage';

// Wrapper component that provides the auth-mf Redux store using lazy loading
export const LoginPageProvider = () => {
  // Get store instance (created lazily on first access)
  const store = getAuthMfStore();

  useEffect(() => {
    console.log('[Auth-MF] LoginPageProvider mounted, store loaded');
    
    // Cleanup function when component unmounts
    return () => {
      console.log('[Auth-MF] LoginPageProvider unmounting');
      // Note: We don't destroy the store immediately as it might be reused
      // Store cleanup can be handled by the shell when navigating away from auth flow
    };
  }, []);

  return (
    <Provider store={store}>
      <LoginPage />
    </Provider>
  );
};

export default LoginPageProvider;
