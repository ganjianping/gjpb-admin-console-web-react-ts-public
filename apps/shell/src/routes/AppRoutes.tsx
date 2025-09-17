import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages
// Import through the barrel file
import { LoginPage } from '../../../auth-mf/src/public-api';
import { UsersPage, RolesPage, AuditLogPage } from '../../../user-mf/src/exports';
import { AppSettingsPage } from '../../../bm-mf/src';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// Components
import ProtectedRoute from '../components/ProtectedRoute';
import RefreshWarningProvider from '../components/RefreshWarningProvider';

// Redux
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { initializeAuth, handleLoginSuccess, handleLoginFailure } from '../redux/slices/authSlice';
import { setPageTitle, selectPageTitle } from '../redux/slices/uiSlice';

// Config
import { APP_CONFIG } from '../../../shared-lib/src/utils/config';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const currentPageTitle = useAppSelector(selectPageTitle);

  // Initialize authentication state on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Set up auth communication handlers for auth-mf
  useEffect(() => {
    // Handle login success from auth-mf
    window.onAuthLoginSuccess = (authResponse) => {
      console.log('[Shell] Received login success from auth-mf');
      dispatch(handleLoginSuccess(authResponse));
    };

    // Handle login failure from auth-mf
    window.onAuthLoginFailure = (error) => {
      console.log('[Shell] Received login failure from auth-mf:', error);
      dispatch(handleLoginFailure(error));
    };

    // Handle logout request from auth-mf (if needed in the future)
    window.onAuthLogoutRequest = () => {
      console.log('[Shell] Received logout request from auth-mf');
      // Handle logout if needed
    };

    // Cleanup on unmount
    return () => {
      delete window.onAuthLoginSuccess;
      delete window.onAuthLoginFailure;
      delete window.onAuthLogoutRequest;
    };
  }, [dispatch]);

  // Initialize page title with i18n after translations are loaded
  useEffect(() => {
    // Only set initial page title if it's still the fallback value and i18n is ready
    if (currentPageTitle === APP_CONFIG.DEFAULT_PAGE_TITLE && i18n.isInitialized) {
      const translatedTitle = t(APP_CONFIG.DEFAULT_PAGE_TITLE_KEY, { defaultValue: APP_CONFIG.DEFAULT_PAGE_TITLE });
      dispatch(setPageTitle(translatedTitle));
    }
  }, [dispatch, t, i18n.isInitialized, currentPageTitle]);

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
          
          {/* Audit Logs */}
          <Route path="audit-logs" element={<AuditLogPage />} />
          
          {/* App Settings */}
          <Route path="app-settings" element={<AppSettingsPage />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;