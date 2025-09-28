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
  Shield,
  Activity,
  Settings,
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Initialize shell translations
import '../utils/i18n';

// User selectors

// Redux
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleSidebar } from '../redux/slices/uiSlice';

interface SidebarProps {
  drawerWidth: number;
  collapsedWidth: number;
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

const Sidebar = ({ drawerWidth, collapsedWidth, open, onClose, variant }: SidebarProps) => {
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
      path: '/users',
      icon: Users,
      roles: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      key: 'roles',
      title: t('navigation.roles'),
      path: '/roles',
      icon: Shield,
      roles: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      key: 'audit-logs',
      title: t('auditLogs.title'),
      path: '/audit-logs',
      icon: Activity,
      roles: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      key: 'app-settings',
      title: t('appSettings.title'),
      path: '/app-settings',
      icon: Settings,
      roles: ['ADMIN', 'SUPER_ADMIN'],
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

  // Helper function to render collapsed submenu items
  const renderCollapsedSubMenuItem = (item: NavItem) => {
    const ItemIcon = item.icon;
    return (
      <Tooltip key={item.key} title={item.title} placement="right">
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleToggleSubMenu(item.key)}
            sx={{
              py: 1.5,
              justifyContent: 'center',
              minHeight: 48,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 'auto', 
              color: 'inherit',
              justifyContent: 'center' 
            }}>
              <ItemIcon size={20} />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </Tooltip>
    );
  };

  // Helper function to render expanded submenu items
  const renderExpandedSubMenuItem = (item: NavItem) => {
    const ItemIcon = item.icon;
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
            <ListItemText 
              primary={item.title}
              sx={{ opacity: open ? 1 : 0 }}
            />
            {openSubMenus[item.key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={openSubMenus[item.key] && open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child) => (
              <ListItem key={child.key} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={child.path ?? ''}
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
  };

  // Helper function to render regular menu items
  const renderRegularMenuItem = (item: NavItem) => {
    const ItemIcon = item.icon;
    const itemContent = (
      <ListItemButton
        component={RouterLink}
        to={item.path ?? ''}
        selected={isActive(item.path)}
        sx={{
          py: 1.5,
          pl: open ? 3 : 0,
          justifyContent: open ? 'flex-start' : 'center',
          minHeight: 48,
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'common.white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: open ? 40 : 'auto', 
          color: 'inherit',
          justifyContent: 'center'
        }}>
          <ItemIcon size={20} />
        </ListItemIcon>
        {open && (
          <ListItemText 
            primary={item.title}
            sx={{ opacity: open ? 1 : 0 }}
          />
        )}
      </ListItemButton>
    );

    return (
      <Box key={item.key}>
        <ListItem disablePadding>
          {!open ? (
            <Tooltip title={item.title} placement="right">
              {itemContent}
            </Tooltip>
          ) : (
            itemContent
          )}
        </ListItem>
        {item.divider && <Divider sx={{ mt: 1, mb: 1 }} />}
      </Box>
    );
  };

  // Helper function to render external link items  
  const renderExternalLinkItem = (item: NavItem) => {
    const ItemIcon = item.icon;
    const linkContent = (
      <ListItemButton 
        component="a"
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          py: 1.5,
          pl: open ? 3 : 0,
          justifyContent: open ? 'flex-start' : 'center',
          minHeight: 48,
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: open ? 40 : 'auto', 
          color: 'inherit',
          justifyContent: 'center'
        }}>
          <ItemIcon size={20} />
        </ListItemIcon>
        {open && (
          <>
            <ListItemText 
              primary={item.title}
              sx={{ opacity: open ? 1 : 0 }}
            />
            <ExternalLink size={16} />
          </>
        )}
      </ListItemButton>
    );

    return (
      <Box key={item.key}>
        <ListItem disablePadding>
          {!open ? (
            <Tooltip title={item.title} placement="right">
              {linkContent}
            </Tooltip>
          ) : (
            linkContent
          )}
        </ListItem>
        {item.divider && <Divider sx={{ mt: 1, mb: 1 }} />}
      </Box>
    );
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      // Skip rendering if role requirements not met
      if (item.roles && !hasRole(item.roles)) return null;

      // For items with children (sub-menu)
      if (item.children) {
        // When collapsed, show tooltip for parent item
        if (!open) {
          return renderCollapsedSubMenuItem(item);
        }

        // When expanded, show full submenu
        return renderExpandedSubMenuItem(item);
      }

      // For external links
      if (item.external && item.path) {
        return renderExternalLinkItem(item);
      }

      // For normal menu items
      return renderRegularMenuItem(item);
    });
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Navigation */}
      <List
        sx={{
          width: '100%',
          flexGrow: 1,
          overflow: 'auto',
          p: open ? 1 : 0.5,
          pt: 2, // Add top padding since we removed header
        }}
      >
        {renderNavItems(navItems)}
      </List>
      
      {/* Bottom section with toggle button and version */}
      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          p: 1,
        }}
      >
        {/* Expand/Collapse Button and Version in same row */}
        {variant === 'permanent' && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}>
            {/* App version - always show */}
            <Box sx={{ 
              flex: open ? 1 : 0,
              overflow: 'hidden',
              opacity: open ? 1 : 0.7,
              transition: 'all 0.3s ease-in-out',
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: open ? '0.75rem' : '0.65rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {open ? 'v1.0.0' : 'v1.0'}
              </Typography>
            </Box>

            {/* Expand/Collapse Button */}
            <Tooltip title={open ? t('common.collapseSidebar') : t('common.expandSidebar')}>
              <IconButton 
                onClick={handleToggleSidebar} 
                size="small"
                sx={{
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  }
                }}
              >
                {open ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  // Calculate drawer width based on variant and open state
  const getDrawerWidth = () => {
    if (variant === 'temporary') return drawerWidth;
    return open ? drawerWidth : collapsedWidth;
  };

  const getNavWidth = () => {
    if (variant === 'temporary') return 0;
    return open ? drawerWidth : collapsedWidth;
  };

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: getNavWidth() }, 
        flexShrink: { md: 0 } 
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant={variant}
        open={variant === 'temporary' ? open : true}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: 'block',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: getDrawerWidth(),
            bgcolor: 'background.paper',
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden',
            top: variant === 'permanent' ? 64 : 0, // Start below header for permanent, full height for temporary
            height: variant === 'permanent' ? 'calc(100vh - 64px)' : '100vh', // Account for header height
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;