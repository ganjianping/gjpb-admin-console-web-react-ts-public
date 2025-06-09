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
  drawerWidth: number;
  onDrawerToggle: () => void;
}

const Header = ({ drawerWidth, onDrawerToggle }: HeaderProps) => {
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

  const handleThemeToggle = () => {
    dispatch(toggleThemeMode());
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    dispatch(setLanguage(event.target.value as 'en' | 'zh'));
    i18n.changeLanguage(event.target.value);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await dispatch(logoutUser());
    navigate(APP_CONFIG.ROUTES.LOGIN);
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
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        boxShadow: 1,
        backdropFilter: 'blur(6px)',
        backgroundColor: 'background.default',
        color: 'text.primary',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          GJPB Admin Console
        </Typography>

        {/* Theme toggle */}
        <Tooltip title={isDarkMode ? t('common.lightMode') : t('common.darkMode')}>
          <IconButton onClick={handleThemeToggle} color="inherit" sx={{ mr: 1 }}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>
        </Tooltip>

        {/* Language selector */}
        <FormControl size="small" sx={{ minWidth: 80, mr: 1 }}>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            displayEmpty
            variant="outlined"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Globe size={16} style={{ marginRight: '8px' }} />
                {selected.toUpperCase()}
              </Box>
            )}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="zh">中文</MenuItem>
          </Select>
        </FormControl>

        {/* Notifications */}
        <Tooltip title={t('common.notifications')}>
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User menu */}
        <Box sx={{ ml: 1 }}>
          <Tooltip title={t('common.userMenu')}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar 
                alt={user?.nickname || user?.username || ''}
                src="/static/images/avatar/2.jpg"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
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
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.nickname || user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            
            <Divider />
            
            <MenuItem onClick={handleProfileClick}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <User size={16} style={{ marginRight: '8px' }} />
                <Typography textAlign="center">{t('navigation.profile')}</Typography>
              </Box>
            </MenuItem>
            
            <MenuItem onClick={handleSettingsClick}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Settings size={16} style={{ marginRight: '8px' }} />
                <Typography textAlign="center">{t('navigation.settings')}</Typography>
              </Box>
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LogOut size={16} style={{ marginRight: '8px' }} />
                <Typography textAlign="center">{t('navigation.logout')}</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;