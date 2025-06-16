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
  Badge,
  Select,
  FormControl,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Menu as MenuIcon, Bell, Sun, Moon, User, LogOut, Settings, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Redux
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logoutUser, selectCurrentUser } from '../redux/slices/authSlice';
import { toggleThemeMode, selectThemeMode, setLanguage } from '../redux/slices/uiSlice';
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';

interface HeaderProps {
  onDrawerToggle: () => void;
}

const Header = ({ onDrawerToggle }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const themeMode = useAppSelector(selectThemeMode);
  const isDarkMode = themeMode === 'dark';

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

  const handleThemeToggle = () => {
    dispatch(toggleThemeMode());
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value as 'en' | 'zh';
    dispatch(setLanguage(newLanguage));
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
                width: '32px',
                height: '32px',
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
            GJPB Admin Console
          </Typography>
        </Box>

        {/* Right side controls */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 } 
        }}>
          {/* Theme toggle */}
          <Tooltip title={isDarkMode ? t('common.lightMode') : t('common.darkMode')}>
            <IconButton 
              onClick={handleThemeToggle} 
              color="inherit"
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
          </Tooltip>

          {/* Language selector */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              displayEmpty
              variant="outlined"
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Globe size={16} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selected.toUpperCase()}
                  </Typography>
                </Box>
              )}
            >
              <MenuItem value="en">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🇺🇸</span>
                  <Typography>English</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="zh">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🇨🇳</span>
                  <Typography>中文</Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Notifications */}
          <Tooltip title={t('common.notifications')}>
            <IconButton 
              color="inherit"
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }
                }}
              >
                <Bell size={20} />
              </Badge>
            </IconButton>
          </Tooltip>

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
                  src="/static/images/avatar/2.jpg"
                  sx={{ 
                    width: 36, 
                    height: 36,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
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
              <Box sx={{ px: 3, py: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.nickname ?? user?.username}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user?.email}
                </Typography>
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