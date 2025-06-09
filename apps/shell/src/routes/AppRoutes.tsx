import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages
// Import through the barrel file
import { LoginPage } from '../../../auth-mf/src/exports';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import DocumentsPage from '../pages/DocumentsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import ReportsPage from '../pages/ReportsPage';
import UsersPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// Components
import ProtectedRoute from '../components/ProtectedRoute';

// Redux
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchCurrentUser, selectIsAuthenticated } from '../redux/slices/authSlice';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Try to fetch current user on app load if we have tokens
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
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
        <Route path="documents" element={<DocumentsPage />} />
        
        {/* Analytics and Reports */}
        <Route path="reports">
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="exports" element={<ReportsPage />} />
        </Route>
        
        {/* Users Management */}
        <Route path="users" element={<UsersPage />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;