// Authentication feature exports
export { default as ProtectedRoute } from './components/ProtectedRoute';
export { default as UnauthorizedPage } from './pages/UnauthorizedPage';
export { shellAuthService } from './services/shell-auth-service';

// Store exports
export {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRoles,
  selectHasRole,
  handleLoginSuccess,
  handleLoginFailure,
  clearCredentials,
  setError,
  clearError,
  updateUserProfile,
  fetchCurrentUser,
  logoutUser,
  initializeAuth,
  default as authSlice
} from './store/authSlice';