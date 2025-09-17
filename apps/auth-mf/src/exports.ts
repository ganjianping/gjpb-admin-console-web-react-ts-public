// This file serves as a barrel export file for the auth-mf module
// Import i18n to ensure translations are loaded
import './utils/i18n';

// Export the LoginPage component (wrapped with Redux provider)
export { LoginPage } from './components/LoginPageWrapper';
// Export the raw LoginPage component for internal use
export { LoginPage as LoginPageComponent } from './pages/LoginPage';
// Re-export I18nProvider from shared-lib for convenience
export { I18nProvider } from '../../shared-lib/src/components';
// Export auth service
export * from './services/login-service';
// Export Redux store for external access if needed
export { default as authMfStore } from './redux/store';
// Export auth communication utilities
export { default as AuthCommunication } from './utils/auth-communication';
// Export auth-mf specific types
export * from './types';
