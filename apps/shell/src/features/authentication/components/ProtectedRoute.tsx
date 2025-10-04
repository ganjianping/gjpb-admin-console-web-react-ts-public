import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Redux
import { useAppSelector, useAppDispatch } from '../../../shared/hooks/useRedux';
import { selectIsAuthenticated, selectAuthLoading, fetchCurrentUser } from '../store/authSlice';
import { APP_CONFIG } from '../../../../../shared-lib/src/features/core/config';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const hasRequiredRole = useAppSelector((state) =>
    requiredRoles && requiredRoles.length > 0
      ? requiredRoles.some(role => state.auth.roles.includes(role))
      : true
  );
  
  // Attempt to fetch current user if already authenticated or has token
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  // Show loading state
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={APP_CONFIG.ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // User is authenticated, but we still need to check roles if required
  if (requiredRoles && requiredRoles.length > 0 && !hasRequiredRole) {
    // User doesn't have the required role
    return <Navigate to={APP_CONFIG.ROUTES.UNAUTHORIZED} replace />;
  }

  // If we get here, user is authenticated and has required roles if any
  return <>{children}</>;
};

export default ProtectedRoute;