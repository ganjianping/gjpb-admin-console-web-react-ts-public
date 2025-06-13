import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, IconButton, Tooltip } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import LoginForm from '../components/LoginFormWrapper';
import type { LoginCredentials } from '../../../shared-lib/src/services/auth-service';
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';

// Redux imports
import { useAppDispatch, useAppSelector } from '../../../shell/src/hooks/useRedux';
import { loginUser } from '../../../shell/src/redux/slices/authSlice';
import { toggleThemeMode, selectThemeMode } from '../../../shell/src/redux/slices/uiSlice';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const isDarkMode = themeMode === 'dark';
  
  // Get the intended destination from location state
  const from = (location.state?.from?.pathname as string) || APP_CONFIG.ROUTES.HOME;

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleThemeMode());
  };

  // Handle login submission
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoginError(null);
      
      // Use Redux action for login
      const result = await dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(result)) {
        // Show success message
        toast.success(t('login.success', 'Login successful'));
        
        // Navigate to the page user was trying to access or home
        navigate(from, { replace: true });
      } else {
        // Handle login failure
        const errorMessage = result.payload ?? 'Login failed. Please try again.';
        setLoginError(errorMessage);
      }
      
    } catch (error: unknown) {
      console.error('Login error:', error);
      setLoginError(t('login.errors.generalError', 'Login failed. Please try again.'));
    }
  };

  return (
    <>
      {/* Clean modern gradient background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          },
        }}
      />

      {/* Theme toggle button with cleaner design */}
      <Box sx={{ 
        position: 'fixed', 
        top: 32, 
        right: 32,
        zIndex: 1000
      }}>
        <Tooltip title={isDarkMode ? t('common.lightMode', 'Light Mode') : t('common.darkMode', 'Dark Mode')}>
          <IconButton 
            onClick={handleThemeToggle} 
            sx={{ 
              width: 48,
              height: 48,
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </IconButton>
        </Tooltip>
      </Box>
      
      <Container maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Clean card design */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 420,
              p: { xs: 3, sm: 4 },
              borderRadius: '20px',
              background: isDarkMode
                ? 'rgba(30, 41, 59, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.5)',
              boxShadow: isDarkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 20px 40px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.6)',
              position: 'relative',
            }}
          >
            <LoginForm 
              onSubmit={handleLogin}
              error={loginError}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};

// Make sure we have a proper named export AND a default export
export { LoginPage };
export default LoginPage;