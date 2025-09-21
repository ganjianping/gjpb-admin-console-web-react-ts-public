import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, IconButton, Tooltip } from '@mui/material';
import { Sun, Moon, Palette, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import LoginForm from '../components/forms/LoginFormWithI18n';
import type { LoginCredentials } from '../../../shared-lib/src/services/auth-service';
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';

// Local Redux imports
import { useAppDispatch, useAppSelector } from '../hooks/useAuthStore';
import { 
  performLogin,
  selectAuthError,
  clearError
} from '../store/slices/authLogin.slice';

// Communication with shell
import AuthCommunication, { type ColorTheme } from '../utils/shell-communication';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local auth-mf Redux
  const dispatch = useAppDispatch();
  const authError = useAppSelector(selectAuthError);

  // State for UI controls
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Use same storage key as shell for consistency
    return localStorage.getItem('gjpb_theme') === 'dark';
  });
  const [currentColorTheme, setCurrentColorTheme] = useState<ColorTheme>(() => 
    (localStorage.getItem('gjpb_color_theme') as ColorTheme) || 'blue'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  
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

  // Listen for theme changes from localStorage (when shell updates theme)
  useEffect(() => {
    const handleStorageChange = (event?: StorageEvent) => {
      // Log all storage events for debugging
      if (event) {
        console.log('[Auth-MF] 🔥 Storage event detected:', {
          key: event.key,
          newValue: event.newValue,
          oldValue: event.oldValue,
          storageArea: event.storageArea === localStorage ? 'localStorage' : 'sessionStorage',
          url: event.url
        });
      } else {
        console.log('[Auth-MF] 🔥 Initial storage check on mount');
      }
      
      // Only update if the storage event is for theme-related keys
      if (event && !['gjpb_theme', 'gjpb_color_theme'].includes(event.key || '')) {
        console.log('[Auth-MF] 🔥 Ignoring storage event for key:', event.key);
        return;
      }
      
      // Use same storage keys as shell for consistency
      const currentThemeInStorage = localStorage.getItem('gjpb_theme');
      const currentColorInStorage = localStorage.getItem('gjpb_color_theme');
      const newThemeMode = currentThemeInStorage === 'dark';
      const newColorTheme = (currentColorInStorage as ColorTheme) || 'blue';
      
      console.log('[Auth-MF] 🔥 Reading from localStorage:', {
        theme: currentThemeInStorage,
        color: currentColorInStorage,
        newThemeMode,
        newColorTheme,
        currentStateTheme: isDarkMode,
        currentStateColor: currentColorTheme
      });
      
      // Only update state if values actually changed to avoid unnecessary re-renders
      setIsDarkMode(prev => {
        if (prev !== newThemeMode) {
          console.log('[Auth-MF] 🔥 Updating theme mode state from', prev, 'to', newThemeMode, 'due to storage change');
          return newThemeMode;
        }
        return prev;
      });
      
      setCurrentColorTheme(prev => {
        if (prev !== newColorTheme) {
          console.log('[Auth-MF] 🔥 Updating color theme state from', prev, 'to', newColorTheme, 'due to storage change');
          return newColorTheme;
        }
        return prev;
      });
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check on mount
    handleStorageChange();

    // Add periodic check to see if something else is changing localStorage
    const intervalId = setInterval(() => {
      const currentTheme = localStorage.getItem('gjpb_theme');
      const expectedTheme = isDarkMode ? 'dark' : 'light';
      if (currentTheme !== expectedTheme) {
        console.log('[Auth-MF] 🚨 DETECTED THEME MISMATCH!', {
          currentTheme,
          expectedTheme,
          stateIsDarkMode: isDarkMode,
          timestamp: new Date().toISOString()
        });
        // Force sync with storage
        handleStorageChange();
      }
    }, 1000);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      console.log('[Auth-MF] 🌍 System theme preference changed to:', e.matches ? 'dark' : 'light');
      // We should NOT automatically change theme based on system preference if user has explicitly set one
      const hasUserTheme = localStorage.getItem('gjpb_theme');
      if (!hasUserTheme) {
        console.log('[Auth-MF] 🌍 No user preference saved, updating to system preference:', e.matches ? 'dark' : 'light');
        const systemTheme = e.matches ? 'dark' : 'light';
        localStorage.setItem('gjpb_theme', systemTheme);
        setIsDarkMode(e.matches);
      } else {
        console.log('[Auth-MF] 🌍 User has saved preference, ignoring system change');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [isDarkMode, currentColorTheme]); // Added dependencies to detect state changes
  
  // Get the intended destination from location state
  const from = (location.state?.from?.pathname as string) || APP_CONFIG.ROUTES.HOME;

  // Handle theme toggle - communicate with shell
  const handleThemeToggle = () => {
    const timestamp = new Date().toISOString();
    console.log(`[Auth-MF] 🎨 Theme toggle clicked at ${timestamp}`);
    
    // Use same storage key as shell for consistency
    const currentMode = localStorage.getItem('gjpb_theme') || 'light';
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    
    console.log(`[Auth-MF] 🎨 Current mode: ${currentMode}, New mode: ${newMode}`);
    console.log(`[Auth-MF] 🎨 Current state isDarkMode: ${isDarkMode}`);
    
    // Update local state immediately for UI responsiveness
    setIsDarkMode(newMode === 'dark');
    console.log(`[Auth-MF] 🎨 Updated local state to: ${newMode === 'dark'}`);
    
    // TEMPORARY FIX: Always handle locally to debug the issue
    console.log(`[Auth-MF] 🎨 Setting localStorage gjpb_theme to: ${newMode}`);
    localStorage.setItem('gjpb_theme', newMode);
    document.documentElement.setAttribute('data-theme', newMode);
    
    // Verify the storage was set correctly
    const verifyStorage = localStorage.getItem('gjpb_theme');
    console.log(`[Auth-MF] 🎨 Verified localStorage value: ${verifyStorage}`);
    
    // Also try to communicate with shell, but don't rely on it
    if (AuthCommunication.isThemeCommunicationAvailable()) {
      console.log(`[Auth-MF] 🎨 Sending theme change request to shell: ${newMode}`);
      AuthCommunication.requestThemeModeChange(newMode);
    } else {
      console.log('[Auth-MF] 🎨 Shell communication not available');
    }
    
    // Schedule a verification check after a short delay
    setTimeout(() => {
      const finalStorage = localStorage.getItem('gjpb_theme');
      const finalState = document.documentElement.getAttribute('data-theme');
      console.log(`[Auth-MF] 🎨 VERIFICATION (1s later): localStorage=${finalStorage}, DOM data-theme=${finalState}, state=${isDarkMode}`);
      
      if (finalStorage !== newMode) {
        console.log(`[Auth-MF] 🚨 ALERT: Storage was changed externally from ${newMode} to ${finalStorage}!`);
      }
    }, 1000);
  };

  // Handle color theme change - communicate with shell
  const handleColorThemeChange = (newColorTheme: ColorTheme) => {
    // Update local state immediately for UI responsiveness
    setCurrentColorTheme(newColorTheme);
    setColorDropdownOpen(false);
    
    if (AuthCommunication.isThemeCommunicationAvailable()) {
      // Shell is available - let it handle the change
      AuthCommunication.requestColorThemeChange(newColorTheme);
      console.log('[Auth-MF] Color theme change request sent to shell:', newColorTheme);
    } else {
      // Shell not available - handle locally as fallback
      console.log('[Auth-MF] Color theme communication not available with shell - handling locally');
      localStorage.setItem('gjpb_color_theme', newColorTheme);
      document.documentElement.setAttribute('data-color-theme', newColorTheme);
    }
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
      
      // Perform login authentication using auth-mf store
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
                const isSelected = currentColorTheme === option.value;
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