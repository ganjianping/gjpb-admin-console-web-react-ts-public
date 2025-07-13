/**
 * Utility to seed localStorage with roles data for development/testing
 */

import type { CachedRole } from './rolesCache';

const ROLES_CACHE_KEY = 'gjpb_roles';

export const seedRolesData: CachedRole[] = [
  { "code": "SUPER_ADMIN", "name": "Super Administrator" },
  { "code": "ADMIN", "name": "System Administrator" },
  { "code": "CONTENT_MANAGER", "name": "Content Manager" },
  { "code": "USER_MANAGER", "name": "User Manager" },
  { "code": "EDITOR", "name": "Senior Editor" },
  { "code": "AUTHOR", "name": "Content Author" },
  { "code": "MODERATOR", "name": "Content Moderator" },
  { "code": "SUPPORT_AGENT", "name": "Customer Support Agent" },
  { "code": "API_CLIENT", "name": "API Integration Client" },
  { "code": "USER", "name": "Regular User" },
  { "code": "TESTER2", "name": "System Tester" },
  { "code": "TESTER", "name": "System Tester" },
  { "code": "TESTER1", "name": "System Tester" },
  { "code": "TESTER6", "name": "tester" }
];

/**
 * Seed localStorage with roles data
 */
export const seedRolesToLocalStorage = (): void => {
  try {
    localStorage.setItem(ROLES_CACHE_KEY, JSON.stringify(seedRolesData));
    console.log('✅ Roles seeded to localStorage:', seedRolesData.length, 'roles');
  } catch (error) {
    console.error('❌ Failed to seed roles to localStorage:', error);
  }
};

/**
 * Check if roles exist in localStorage
 */
export const checkRolesInLocalStorage = (): boolean => {
  try {
    const rolesData = localStorage.getItem(ROLES_CACHE_KEY);
    return rolesData !== null && JSON.parse(rolesData).length > 0;
  } catch (error) {
    console.error('❌ Failed to check roles in localStorage:', error);
    return false;
  }
};

/**
 * Global function for manual seeding (accessible from browser console)
 * Usage:
 * - seedRoles()     - Add roles to localStorage
 * - checkRoles()    - Check current roles in localStorage  
 * - clearRoles()    - Clear roles from localStorage
 */
if (typeof window !== 'undefined') {
  (window as any).seedRoles = () => {
    seedRolesToLocalStorage();
    console.log('✅ Roles have been seeded to localStorage. Refresh the page to see them in dropdowns.');
  };
  
  (window as any).checkRoles = () => {
    const exists = checkRolesInLocalStorage();
    const rolesData = localStorage.getItem(ROLES_CACHE_KEY);
    const parsedRoles = rolesData ? JSON.parse(rolesData) : null;
    
    console.log('=== Roles Status ===');
    console.log('Roles exist:', exists);
    console.log('Roles count:', parsedRoles?.length || 0);
    console.log('Roles data:', parsedRoles);
    
    return {
      exists,
      count: parsedRoles?.length || 0,
      data: parsedRoles
    };
  };
  
  (window as any).clearRoles = () => {
    localStorage.removeItem(ROLES_CACHE_KEY);
    console.log('✅ Roles cleared from localStorage');
  };
  
  // Show available commands on load
  console.log('🎯 Roles Management Commands Available:');
  console.log('  seedRoles()  - Add test roles to localStorage');
  console.log('  checkRoles() - Check current roles in localStorage');
  console.log('  clearRoles() - Clear roles from localStorage');
}
