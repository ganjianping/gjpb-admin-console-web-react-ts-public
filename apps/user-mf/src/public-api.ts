// This file serves as a barrel export file for the user-mf module
// Import i18n to ensure translations are loaded
import './utils/i18n';

// Export the user management components
export { UsersPage } from './users/pages';
export { RolesPage } from './roles/pages';
export { LanguageSwitcher } from './shared/components';

// Export the audit log components
export { AuditLogPage } from './audit-logs';
