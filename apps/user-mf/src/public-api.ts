// This file serves as a barrel export file for the user-mf module
// Import i18n to ensure translations are loaded
import './config/i18n.config';
import './users/config/i18n.config';
import './roles/config/i18n.config';

// Register cache provider with shared cache manager
import CacheManagerService from '../../shared-lib/src/core/cache-registry.service';
import { userMfCacheProvider } from './utils/cache-adapter';
CacheManagerService.registerCacheProvider(userMfCacheProvider);

// Export the user management components
export { UsersPage, ProfilePage } from './users/pages';
export { RolesPage } from './roles/pages';
export { LanguageSwitcher } from './shared/components';

// Export the audit log components
export { AuditLogPage } from './audit-logs';
