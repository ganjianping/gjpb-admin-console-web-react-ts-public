import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import LoginForm from '../components/LoginFormWrapper';
import { authService } from '../../../shared-lib/src/services/auth-service';
import type { LoginCredentials } from '../../../shared-lib/src/services/auth-service';
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Get the intended destination from location state
  const from = (location.state?.from?.pathname as string) || APP_CONFIG.ROUTES.HOME;

  // Handle login submission
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoginError(null);
      const response = await authService.login(credentials);
      
      // Store user in localStorage or app state management
      localStorage.setItem('user', JSON.stringify(response));
      
      // Show success message
      toast.success(t('login.success', 'Login successful'));
      
      // Navigate to the page user was trying to access or home
      navigate(from, { replace: true });
      
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Set appropriate error message based on error type
      let errorKey = 'login.errors.generalError';
      
      if (error instanceof Error && error.message === 'Invalid credentials') {
        errorKey = 'login.errors.invalidCredentials';
      } else if (error instanceof Error && error.message === 'Account locked') {
        errorKey = 'login.errors.accountLocked';
      }
      
      setLoginError(t(errorKey, 'Login failed. Please try again.'));
      
      setLoginError(t(errorKey, 'Login failed. Please try again.'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4
      }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ mb: 4 }}>
          {t('login.title', 'Login to GJPB Admin Console')}
        </Typography>
        
        <LoginForm 
          onSubmit={handleLogin}
          error={loginError}
        />
      </Box>
    </Container>
  );
};

// Make sure we have a proper named export AND a default export
export { LoginPage };
export default LoginPage;