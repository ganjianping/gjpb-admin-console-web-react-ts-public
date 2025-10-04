import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem, 
  Avatar, 
  Tooltip, 
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, User, LogOut, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Use shared theme components instead of manual Redux
import { 
  useTheme,
  ThemeModeToggle,
  ColorThemeSelector,
  LanguageSelector
} from '../../../../../shared-lib/src/features/theme';
import type { Language } from '../../../../../shared-lib/src/features/theme/theme.types';
import { getColorThemeOptions } from '../../../../../shared-lib/src/features/theme/theme.utils';

// Redux (only for auth, not theme)
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useRedux';
import { logoutUser, selectCurrentUser } from '../../authentication/store/authSlice';
import { setLanguage as setReduxLanguage } from '../../../shared/store/uiSlice';
import { APP_CONFIG } from '../../../../../shared-lib/src/features/core/config';

interface HeaderProps {
  onDrawerToggle: () => void;
}

const Header = ({ onDrawerToggle }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  // Use shared theme hook instead of manual Redux
  const { 
    themeMode, 
    colorTheme, 
    language, 
    toggleThemeMode, 
    setColorTheme, 
    setLanguage 
  } = useTheme({ 
    appName: 'shell',
    enableSystemPreferenceSync: true,
    enableDebugging: false 
  });

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    try {
      await dispatch(logoutUser()).unwrap();
      navigate(APP_CONFIG.ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    // Update shared theme state and localStorage
    setLanguage(newLanguage);
    // Update shell Redux state for consistency
    dispatch(setReduxLanguage(newLanguage));
    // Also update i18n instance for immediate UI updates  
    i18n.changeLanguage(newLanguage);
  };

  const handleProfileClick = () => {
    handleCloseUserMenu();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleCloseUserMenu();
    navigate('/settings');
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        width: '100%', // Full width header
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        ...(themeMode === 'dark' && {
          backgroundColor: 'rgba(24, 24, 27, 0.95)',
          borderBottomColor: 'rgba(64, 64, 64, 0.4)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        }),
      }}
    >
      <Toolbar sx={{ 
        minHeight: 68, 
        px: { xs: 2, md: 3 },
        position: 'relative',
      }}>
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ 
            mr: 2, 
            display: { md: 'none' },
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Title */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center',
          gap: { xs: 1, sm: 2 }
        }}>
          <Box
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
          >
            <img
              src="/favicon.ico"
              alt="GJPB Logo"
              style={{
                width: '48px',
                height: '48px',
                transition: 'all 0.2s ease',
              }}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { sm: '1.1rem', md: '1.25rem' },
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            {t('app.title')}
          </Typography>
        </Box>

        {/* Right side controls */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 } 
        }}>
          {/* Language selector - Always visible like original */}
          <LanguageSelector
            currentLanguage={language}
            languageOptions={[
              { value: 'en', label: 'English', flag: '🇺🇸' },
              { value: 'zh', label: '中文', flag: '🇨🇳' }
            ]}
            onLanguageChange={handleLanguageChange}
            isDarkMode={themeMode === 'dark'}
            t={(key: string, defaultValue?: string) => defaultValue ? t(key, { defaultValue }) : t(key)}
          />

          {/* Theme Toggle - Only visible after login like original */}
          {user && (
            <ThemeModeToggle
              isDarkMode={themeMode === 'dark'}
              onToggle={toggleThemeMode}
              t={(key: string, defaultValue?: string) => defaultValue ? t(key, { defaultValue }) : t(key)}
            />
          )}

          {/* Color Theme Picker - Only visible after login like original */}
          {user && (
            <ColorThemeSelector
              currentColorTheme={colorTheme}
              colorThemeOptions={getColorThemeOptions((key: string, defaultValue?: string) => defaultValue ? t(key, { defaultValue }) : t(key))}
              onColorThemeChange={setColorTheme}
              isDarkMode={themeMode === 'dark'}
              t={(key: string, defaultValue?: string) => defaultValue ? t(key, { defaultValue }) : t(key)}
            />
          )}

          {/* User menu */}
          <Box sx={{ ml: 1 }}>
            <Tooltip title={t('common.userMenu')}>
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0.5,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Avatar 
                  alt={user?.nickname ?? user?.username ?? ''}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    }
                  }}
                >
                  {(user?.nickname ?? user?.username ?? 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ 
                mt: '45px',
                '& .MuiPaper-root': {
                  borderRadius: 3,
                  minWidth: 200,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid',
                  borderColor: 'divider',
                }
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* User info header */}
              <Box sx={{ 
                px: 3, 
                py: 2.5, 
                bgcolor: themeMode === 'dark' ? 'primary.main' : 'white', 
                color: themeMode === 'dark' ? 'white' : 'text.primary',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1px solid',
                borderBottomColor: 'divider',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: themeMode === 'dark' 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)',
                  pointerEvents: 'none'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48,
                      backgroundColor: themeMode === 'dark' 
                        ? 'rgba(255,255,255,0.2)' 
                        : 'primary.main',
                      color: themeMode === 'dark' ? 'white' : 'primary.contrastText',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      border: '2px solid',
                      borderColor: themeMode === 'dark' 
                        ? 'rgba(255,255,255,0.3)' 
                        : 'primary.light',
                    }}
                  >
                    {(user?.nickname ?? user?.username ?? 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                      {user?.nickname ?? user?.username}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Menu items */}
              <MenuItem 
                onClick={handleProfileClick}
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <User size={18} />
                  <Typography>{t('navigation.profile')}</Typography>
                </Box>
              </MenuItem>
              
              <MenuItem 
                onClick={handleSettingsClick}
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Settings size={18} />
                  <Typography>{t('navigation.settings')}</Typography>
                </Box>
              </MenuItem>
              
              <Divider sx={{ my: 1 }} />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.contrastText',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LogOut size={18} />
                  <Typography>{t('navigation.logout')}</Typography>
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;