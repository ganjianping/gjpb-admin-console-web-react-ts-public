import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages
// Import through the barrel file
import { LoginPage } from '../../../auth-mf/src/exports';
import { UsersPage, RolesPage } from '../../../user-mf/src/exports';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// Components
import ProtectedRoute from '../components/ProtectedRoute';
import RefreshWarningProvider from '../components/RefreshWarningProvider';

// Redux
import { useAppDispatch } from '../hooks/useRedux';
import { initializeAuth } from '../redux/slices/authSlice';

const AppRoutes = () => {
  const dispatch = useAppDispatch();

  // Initialize authentication state on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <>
      {/* Refresh warning provider for authenticated users */}
      <RefreshWarningProvider />
      
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Users Management */}
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;