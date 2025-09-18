// This file serves as a barrel export file for the auth-mf module
// Import i18n to ensure translations are loaded
import './config/i18n.config';

// Export the LoginPage component (wrapped with Redux provider)
export { LoginPage } from './components/providers/LoginPageProvider';
// Export the raw LoginPage component for internal use
export { LoginPage as LoginPageComponent } from './pages/LoginPage';
// Export auth service
export * from './services/authentication.service';
// Export Redux store for external access if needed
export { default as authMfStore } from './store';
// Export auth communication utilities
export { default as AuthCommunication } from './utils/shell-communication';
// Export auth-mf specific types
export * from './types';
