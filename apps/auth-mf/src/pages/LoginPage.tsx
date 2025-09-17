import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, IconButton, Tooltip } from '@mui/material';
import { Sun, Moon, Palette, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import LoginForm from '../components/LoginFormWrapper';
import type { LoginCredentials } from '../../../shared-lib/src/services/auth-service';
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';

// Local Redux imports
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { 
  performLogin,
  selectLoginError,
  clearError
} from '../redux/slices/loginSlice';

// Communication with shell
import AuthCommunication, { type ColorTheme } from '../utils/auth-communication';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local auth-mf Redux
  const dispatch = useAppDispatch();
  const loginError = useAppSelector(selectLoginError);

  // State for UI controls
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  
  // For now, use defaults for theme (this could be improved with proper communication)
  const isDarkMode = false; // TODO: Get from shell or localStorage
  const colorTheme: ColorTheme = 'blue'; // TODO: Get from shell or localStorage
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setColorDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };

    if (colorDropdownOpen || languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorDropdownOpen, languageDropdownOpen]);
  
  // Get the intended destination from location state
  const from = (location.state?.from?.pathname as string) || APP_CONFIG.ROUTES.HOME;

  // Handle theme toggle - communicate with shell
  const handleThemeToggle = () => {
    if (AuthCommunication.isThemeCommunicationAvailable()) {
      // Toggle between light/dark - shell will handle the actual logic
      const currentMode = localStorage.getItem('theme_mode') || 'light';
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      AuthCommunication.requestThemeModeChange(newMode);
    } else {
      console.warn('[Auth-MF] Theme communication not available with shell');
    }
  };

  // Handle color theme change - communicate with shell
  const handleColorThemeChange = (newColorTheme: ColorTheme) => {
    if (AuthCommunication.isThemeCommunicationAvailable()) {
      AuthCommunication.requestColorThemeChange(newColorTheme);
    } else {
      console.warn('[Auth-MF] Color theme communication not available with shell');
    }
    setColorDropdownOpen(false);
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setLanguageDropdownOpen(false);
  };

  // Current language for display
  const currentLanguage = i18n.language || 'en';

  // Color theme options
  const colorThemeOptions: { value: ColorTheme; label: string; color: string }[] = [
    { value: 'blue', label: t('theme.colors.blue', 'Blue'), color: '#1976d2' },
    { value: 'purple', label: t('theme.colors.purple', 'Purple'), color: '#9c27b0' },
    { value: 'green', label: t('theme.colors.green', 'Green'), color: '#4caf50' },
    { value: 'orange', label: t('theme.colors.orange', 'Orange'), color: '#ff9800' },
    { value: 'red', label: t('theme.colors.red', 'Red'), color: '#f44336' },
  ];

  // Handle login submission
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      // Clear any previous errors
      dispatch(clearError());
      
      // Perform login using auth-mf store
      const result = await dispatch(performLogin(credentials));
      
      if (performLogin.fulfilled.match(result)) {
        // Notify shell of successful login
        AuthCommunication.notifyLoginSuccess(result.payload);
        
        // Show success message
        toast.success(t('login.success', 'Login successful'));
        
        // Navigate to the page user was trying to access or home
        navigate(from, { replace: true });
      } else {
        // Handle login failure - error is already in Redux state
        const errorMessage = result.payload ?? 'Login failed. Please try again.';
        AuthCommunication.notifyLoginFailure(errorMessage);
      }
      
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = t('login.errors.generalError', 'Login failed. Please try again.');
      AuthCommunication.notifyLoginFailure(errorMessage);
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

      {/* Theme controls with cleaner design */}
      <Box sx={{ 
        position: 'fixed', 
        top: 32, 
        right: 32,
        zIndex: 1000,
        display: 'flex',
        gap: 2,
      }}>
        {/* Language switcher */}
        <Box sx={{ position: 'relative' }} ref={languageDropdownRef}>
          <Tooltip title={t('common.language', 'Language')}>
            <IconButton 
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              sx={{ 
                width: 52,
                height: 52,
                color: isDarkMode ? '#ffffff' : '#475569',
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '2px solid',
                borderColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(148, 163, 184, 0.3)',
                borderRadius: '16px',
                boxShadow: isDarkMode
                  ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                  : '0 8px 24px rgba(148, 163, 184, 0.25)',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.05)',
                  borderColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.4)' 
                    : 'rgba(99, 102, 241, 0.5)',
                  boxShadow: isDarkMode
                    ? '0 12px 32px rgba(0, 0, 0, 0.4)'
                    : '0 12px 32px rgba(99, 102, 241, 0.3)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Languages size={24} />
            </IconButton>
          </Tooltip>
          
          {/* Language dropdown menu */}
          {languageDropdownOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                mt: 1,
                p: 1,
                minWidth: 140,
                backgroundColor: isDarkMode
                  ? 'rgba(30, 41, 59, 0.95)'
                  : '#ffffff',
                backdropFilter: isDarkMode ? 'blur(20px)' : 'none',
                border: '1px solid',
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(226, 232, 240, 0.8)',
                borderRadius: 2,
                boxShadow: isDarkMode
                  ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                  : '0 10px 30px rgba(148, 163, 184, 0.2)',
              }}
            >
              <Box
                onClick={() => handleLanguageChange('en')}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: currentLanguage === 'en' 
                    ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <Box sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: currentLanguage === 'en' ? 600 : 400,
                }}>
                  🇺🇸 English
                </Box>
              </Box>
              <Box
                onClick={() => handleLanguageChange('zh')}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: currentLanguage === 'zh' 
                    ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <Box sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: currentLanguage === 'zh' ? 600 : 400,
                }}>
                  🇨🇳 中文
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Color theme dropdown */}
        <Box sx={{ position: 'relative' }} ref={dropdownRef}>
          <Tooltip title={t('theme.colorTheme', 'Color theme')}>
            <IconButton 
              onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
              sx={{ 
                width: 52,
                height: 52,
                color: isDarkMode ? '#ffffff' : '#475569',
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '2px solid',
                borderColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(148, 163, 184, 0.3)',
                borderRadius: '16px',
                boxShadow: isDarkMode
                  ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                  : '0 8px 24px rgba(148, 163, 184, 0.25)',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.05)',
                  borderColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.4)' 
                    : 'rgba(99, 102, 241, 0.5)',
                  boxShadow: isDarkMode
                    ? '0 12px 32px rgba(0, 0, 0, 0.4)'
                    : '0 12px 32px rgba(99, 102, 241, 0.3)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Palette size={24} />
            </IconButton>
          </Tooltip>
          
          {/* Color dropdown menu */}
          {colorDropdownOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                mt: 1,
                p: 1,
                minWidth: 200,
                backgroundColor: isDarkMode
                  ? 'rgba(30, 41, 59, 0.95)'
                  : '#ffffff',
                backdropFilter: isDarkMode ? 'blur(20px)' : 'none',
                border: '1px solid',
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(226, 232, 240, 0.8)',
                borderRadius: 2,
                boxShadow: isDarkMode
                  ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                  : '0 10px 30px rgba(148, 163, 184, 0.2)',
              }}
            >
              {colorThemeOptions.map((option) => {
                const isSelected = colorTheme === option.value;
                const selectedBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                
                return (
                  <Box
                    key={option.value}
                    onClick={() => handleColorThemeChange(option.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      backgroundColor: isSelected ? selectedBgColor : 'transparent',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.03)',
                      },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: option.color,
                        border: '2px solid',
                        borderColor: isSelected ? 'white' : 'transparent',
                      }}
                    />
                    <Box sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? 600 : 400,
                    }}>
                      {option.label}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Theme mode toggle */}
        <Tooltip title={isDarkMode ? t('theme.light', 'Light mode') : t('theme.dark', 'Dark mode')}>
          <IconButton 
            onClick={handleThemeToggle} 
            sx={{ 
              width: 52,
              height: 52,
              color: isDarkMode ? '#ffffff' : '#475569',
              backgroundColor: isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid',
              borderColor: isDarkMode 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(148, 163, 184, 0.3)',
              borderRadius: '16px',
              boxShadow: isDarkMode
                ? '0 8px 24px rgba(0, 0, 0, 0.3)'
                : '0 8px 24px rgba(148, 163, 184, 0.25)',
              '&:hover': {
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.05)',
                borderColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.4)' 
                  : 'rgba(99, 102, 241, 0.5)',
                boxShadow: isDarkMode
                  ? '0 12px 32px rgba(0, 0, 0, 0.4)'
                  : '0 12px 32px rgba(99, 102, 241, 0.3)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
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