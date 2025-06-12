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
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4,
        position: 'relative'
      }}>
        {/* Theme toggle button */}
        <Box sx={{ 
          position: 'absolute', 
          top: 24, 
          right: 24 
        }}>
          <Tooltip title={isDarkMode ? t('common.lightMode', 'Light Mode') : t('common.darkMode', 'Dark Mode')}>
            <IconButton 
              onClick={handleThemeToggle} 
              color="inherit"
              sx={{ 
                color: 'text.primary',
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
          </Tooltip>
        </Box>
        
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