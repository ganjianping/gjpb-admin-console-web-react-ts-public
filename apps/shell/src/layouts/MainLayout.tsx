import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAppSelector } from '../hooks/useRedux';
import { selectSidebarOpen } from '../redux/slices/uiSlice';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Calculate current sidebar width
  const getCurrentSidebarWidth = () => {
    if (isMobile) return 0;
    return sidebarOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH;
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
          width: { sm: `calc(100% - ${getCurrentSidebarWidth()}px)` },
          ml: { sm: `${getCurrentSidebarWidth()}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;