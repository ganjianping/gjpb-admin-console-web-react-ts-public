/**
 * Shared Library - Feature-Based Architecture
 * 
 * All functionality is now organized by features for better maintainability.
 * Each feature contains related components, hooks, services, types, and utilities.
 */

// Export all features
export * from './features/api';
export * from './features/core'; 
export * from './features/data-management';
export * from './features/firebase';
export * from './features/i18n';
export * from './features/theme';
export * from './features/ui-components';