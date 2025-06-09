import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bell,
  BarChart3,
  Files,
  User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Redux
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleSidebar } from '../redux/slices/uiSlice';

interface SidebarProps {
  drawerWidth: number;
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'temporary';
}

// Navigation item structure
interface NavItem {
  key: string;
  title: string;
  path?: string;
  icon: React.ElementType;
  children?: Omit<NavItem, 'children' | 'icon'>[];
  roles?: string[];
  divider?: boolean;
  external?: boolean;
}

const Sidebar = ({ drawerWidth, open, onClose, variant }: SidebarProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const userRoles = useAppSelector((state) => state.auth.roles);

  // Check for role-based access
  const hasRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true;
    return roles.some(role => userRoles.includes(role));
  };

  // Navigation items
  const navItems: NavItem[] = useMemo(() => [
    {
      key: 'dashboard',
      title: t('navigation.dashboard'),
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      key: 'users',
      title: t('navigation.users'),
      icon: Users,
      roles: ['ADMIN', 'SUPER_ADMIN'],
      children: [
        {
          key: 'users-list',
          title: t('navigation.usersList'),
          path: '/users',
        },
        {
          key: 'users-roles',
          title: t('navigation.roles'),
          path: '/users/roles',
        },
      ],
    },
    {
      key: 'reports',
      title: t('navigation.reports'),
      icon: BarChart3,
      children: [
        {
          key: 'reports-analytics',
          title: t('navigation.analytics'),
          path: '/reports/analytics',
        },
        {
          key: 'reports-exports',
          title: t('navigation.exports'),
          path: '/reports/exports',
        },
      ],
    },
    {
      key: 'documents',
      title: t('navigation.documents'),
      icon: Files,
      path: '/documents',
    },
    {
      key: 'notifications',
      title: t('navigation.notifications'),
      icon: Bell,
      path: '/notifications',
    },
    {
      key: 'profile',
      title: t('navigation.profile'),
      icon: User,
      path: '/profile',
      divider: true,
    },
    {
      key: 'settings',
      title: t('navigation.settings'),
      icon: Settings,
      path: '/settings',
    },
    {
      key: 'docs',
      title: t('navigation.documentation'),
      icon: FileText,
      path: 'https://docs.example.com',
      external: true,
    },
  ], [t]);

  // Toggle sub-menu
  const handleToggleSubMenu = (key: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle sidebar
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Path matching for active state
  const isActive = useCallback((path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  // Auto-open submenu for active paths
  useEffect(() => {
    navItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => isActive(child.path));
        if (hasActiveChild) {
          setOpenSubMenus(prev => ({ ...prev, [item.key]: true }));
        }
      }
    });
  }, [location.pathname, navItems, isActive]);

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      // Skip rendering if role requirements not met
      if (item.roles && !hasRole(item.roles)) return null;

      const ItemIcon = item.icon;

      // For items with children (sub-menu)
      if (item.children) {
        return (
          <Box key={item.key}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleToggleSubMenu(item.key)}
                sx={{
                  py: 1.5,
                  pl: 3,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <ItemIcon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.title} />
                {openSubMenus[item.key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ListItemButton>
            </ListItem>
            
            <Collapse in={openSubMenus[item.key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child) => (
                  <ListItem key={child.key} disablePadding>
                    <ListItemButton
                      component={RouterLink}
                      to={child.path || ''}
                      selected={isActive(child.path)}
                      sx={{
                        pl: 6,
                        py: 1,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'common.white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      <ListItemText primary={child.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {item.divider && <Divider sx={{ mt: 1, mb: 1 }} />}
          </Box>
        );
      }

      // For external links
      if (item.external && item.path) {
        return (
          <Box key={item.key}>
            <ListItem disablePadding>
              <ListItemButton 
                component="a"
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  py: 1.5,
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ItemIcon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.title} />
                <ExternalLink size={16} />
              </ListItemButton>
            </ListItem>
            {item.divider && <Divider sx={{ mt: 1, mb: 1 }} />}
          </Box>
        );
      }

      // For normal menu items
      return (
        <Box key={item.key}>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path || ''}
              selected={isActive(item.path)}
              sx={{
                py: 1.5,
                pl: 3,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <ItemIcon size={20} />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
          {item.divider && <Divider sx={{ mt: 1, mb: 1 }} />}
        </Box>
      );
    });
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo and title */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1, 
          borderColor: 'divider',
        }}
      >
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/"
          sx={{ 
            textDecoration: 'none', 
            color: 'primary.main',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* You can add a logo image here */}
          GJPB Admin
        </Typography>
        
        {/* Only show toggle button for permanent drawer */}
        {variant === 'permanent' && (
          <Tooltip title={open ? t('common.collapseSidebar') : t('common.expandSidebar')}>
            <IconButton onClick={handleToggleSidebar} size="small">
              {open ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      {/* Navigation */}
      <List
        sx={{
          width: '100%',
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        {renderNavItems(navItems)}
      </List>
      
      {/* App version */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: open ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: 'block',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;