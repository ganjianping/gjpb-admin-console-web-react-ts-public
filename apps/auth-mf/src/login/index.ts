/**
 * Login Feature Index
 * 
 * Centralized exports for all login-related functionality
 */

// Initialize login-specific i18n translations
import './i18n/i18n.config';

// Components
export { default as LoginForm } from './components/LoginForm';
export { default as LoginFormWithI18n } from './components/LoginFormWithI18n';
export { LoginPageProvider } from './components/LoginPageProvider';

// Pages
export { default as LoginPage } from './pages/LoginPage';

// Services
export { authenticationService } from './services/authentication.service';

// Hooks
export { useAppDispatch, useAppSelector } from './hooks/useAuthStore';

// Store
export { default as authLoginSlice } from './store/authLogin.slice';