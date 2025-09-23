// This file serves as a barrel export file for the auth-mf module
// Import i18n to ensure auth-specific translations are loaded
import './config/i18n.config';

// Export the LoginPageProvider component (the only component used by shell)
export { LoginPageProvider } from './components/providers/LoginPageProvider';
