import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAppSelector } from '../../core/hooks/useRedux';
import { selectSidebarOpen } from '../../core/store/uiSlice';

const DRAWER_WIDTH = 200;
const COLLAPSED_DRAWER_WIDTH = 72;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Calculate margin-left for main content (minimal spacing to avoid overlap)
  const getContentMarginLeft = () => {
    if (isMobile) return 0;
    return sidebarOpen ? 12 : 8; // Minimal 12px margin when expanded
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header - full width */}
      <Header 
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Sidebar */}
      <Sidebar 
        drawerWidth={DRAWER_WIDTH}
        collapsedWidth={COLLAPSED_DRAWER_WIDTH}
        open={isMobile ? mobileOpen : sidebarOpen}
        onClose={handleDrawerToggle}
        variant={isMobile ? 'temporary' : 'permanent'}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          ml: { md: `${getContentMarginLeft()}px` },
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          minHeight: '100vh',
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: 2,
            px: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: 'none !important',
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;