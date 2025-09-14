// This file serves as a barrel export file for the auth-mf module
// Import i18n to ensure translations are loaded
import './utils/i18n';

// Export the LoginPage component
export { LoginPage } from './pages/LoginPage';
// Re-export I18nProvider from shared-lib for convenience
export { I18nProvider } from '../../shared-lib/src/components';
