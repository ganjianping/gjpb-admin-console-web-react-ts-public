import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { getAuthMfStore } from '../../store';
import { LoginPage as LoginPageComponent } from '../../pages/LoginPage';

// Wrapper component that provides the auth-mf Redux store using lazy loading
export const LoginPage = () => {
  // Get store instance (created lazily on first access)
  const store = getAuthMfStore();

  useEffect(() => {
    console.log('[Auth-MF] LoginPageWrapper mounted, store loaded');
    
    // Cleanup function when component unmounts
    return () => {
      console.log('[Auth-MF] LoginPageWrapper unmounting');
      // Note: We don't destroy the store immediately as it might be reused
      // Store cleanup can be handled by the shell when navigating away from auth flow
    };
  }, []);

  return (
    <Provider store={store}>
      <LoginPageComponent />
    </Provider>
  );
};

export default LoginPage;
