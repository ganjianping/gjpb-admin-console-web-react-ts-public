// This file serves as a barrel export file for the auth-mf module
// Import login i18n to ensure login-specific translations are loaded
import './login/i18n/i18n.config';

// Export the LoginPageProvider component (the only component used by shell)
export { LoginPageProvider } from './login/components/LoginPageProvider';
