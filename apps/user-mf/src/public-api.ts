// This file serves as a barrel export file for the user-mf module
// Import i18n modules to ensure translations are loaded
import './users/i18n';
import './roles/i18n';
import './audit-logs/i18n';
import './profile/i18n';

// Register cache provider with shared cache manager
import CacheManagerService from '../../shared-lib/src/core/cache-registry.service';
import { userMfCacheProvider } from './roles/utils/cache-adapter';
CacheManagerService.registerCacheProvider(userMfCacheProvider);

// Export the user management components
export { UsersPage } from './users/pages';
export { ProfilePage } from './profile/pages';
export { RolesPage } from './roles/pages';

// Export the audit log components
export { AuditLogPage } from './audit-logs';

// Re-export LanguageSelector from shared-lib if needed by shell
export { LanguageSelector } from '../../shared-lib/src/theme';
