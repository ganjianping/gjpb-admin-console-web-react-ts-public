import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import LoginForm from '../components/forms/LoginFormWithI18n';
import type { LoginCredentials } from '../../../shared-lib/src/services/auth-service';
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';

// Use shared theme components and hooks
import { 
  useTheme,
  ThemeControls
} from '../../../shared-lib/src/components';

// Local Redux imports
import { useAppDispatch, useAppSelector } from '../hooks/useAuthStore';
import { 
  performLogin,
  selectAuthError,
  clearError
} from '../store/slices/authLogin.slice';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local auth-mf Redux
  const dispatch = useAppDispatch();
  const authError = useAppSelector(selectAuthError);

  // Use shared theme hook
  const {
    themeMode,
    colorTheme,
    language,
    isDarkMode,
    toggleThemeMode,
    setColorTheme,
    setLanguage,
    communication
  } = useTheme({ 
    appName: 'auth-mf',
    enableSystemPreferenceSync: true,
    enableDebugging: true 
  });
  
  // Get the intended destination from location state
  const from = (location.state?.from?.pathname as string) || APP_CONFIG.ROUTES.HOME;

  // Handle login submission
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      // Clear any previous errors
      dispatch(clearError());
      
      // Perform login authentication using auth-mf store
      const result = await dispatch(performLogin(credentials));
      
      if (performLogin.fulfilled.match(result)) {
        // Notify shell of successful login
        communication.notifyLoginSuccess(result.payload);
        
        // Show success message
        toast.success(t('login.success', 'Login successful'));
        
        // Navigate to the page user was trying to access or home
        navigate(from, { replace: true });
      } else {
        // Handle login failure - error is already in Redux state
        const errorMessage = result.payload ?? 'Login failed. Please try again.';
        communication.notifyLoginFailure(errorMessage);
      }
      
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = t('login.errors.generalError', 'Login failed. Please try again.');
      communication.notifyLoginFailure(errorMessage);
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
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 30% 30%, rgba(148, 163, 184, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(100, 116, 139, 0.05) 0%, transparent 50%)',
          },
        }}
      />

      {/* Shared theme controls - much cleaner! */}
      <ThemeControls
        themeMode={themeMode}
        colorTheme={colorTheme}
        language={language}
        onThemeToggle={toggleThemeMode}
        onColorThemeChange={setColorTheme}
        onLanguageChange={setLanguage}
      />
      
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
                : '#ffffff',
              backdropFilter: isDarkMode ? 'blur(20px)' : 'none',
              border: '1px solid',
              borderColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(226, 232, 240, 0.8)',
              boxShadow: isDarkMode
                ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 20px 40px rgba(148, 163, 184, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.6)',
              position: 'relative',
            }}
          >
            {/* App Logo/Favicon at the top of login card */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 3,
              pt: 1 
            }}>
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '96px',
                    height: '96px',
                    backgroundImage: 'url(/favicon.ico)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: isDarkMode ? 'brightness(1.1)' : 'brightness(1)',
                  },
                }}
              />
            </Box>
            
            <LoginForm 
              onSubmit={handleLogin}
              error={authError}
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