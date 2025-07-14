/**
 * Utility functions for user-related operations
 */

import { rolesService } from '../../roles/services/rolesCacheService';

/**
 * Get role name by code from cached roles
 */
export const getRoleNameByCode = (roleCode: string): string => {
  const cachedRoles = rolesService.getCachedRoles();
  const role = cachedRoles.find(r => r.code === roleCode);
  return role?.name || roleCode; // Fallback to code if name not found
};

/**
 * Get role names by codes from cached roles
 */
export const getRoleNamesByCodes = (roleCodes: string[]): string[] => {
  const cachedRoles = rolesService.getCachedRoles();
  return roleCodes.map(code => {
    const role = cachedRoles.find(r => r.code === code);
    return role?.name || code; // Fallback to code if name not found
  });
};

/**
 * Get role object with name by code from cached roles
 */
export const getRoleWithNameByCode = (roleCode: string): { code: string; name: string } => {
  const cachedRoles = rolesService.getCachedRoles();
  const role = cachedRoles.find(r => r.code === roleCode);
  return {
    code: roleCode,
    name: role?.name || roleCode
  };
};

/**
 * Convert role objects to include names from cached roles
 */
export const enrichRolesWithNames = (roles: Array<{ code: string; [key: string]: any }>): Array<{ code: string; name: string; [key: string]: any }> => {
  const cachedRoles = rolesService.getCachedRoles();
  
  return roles.map(role => {
    const cachedRole = cachedRoles.find(r => r.code === role.code);
    return {
      ...role,
      name: cachedRole?.name || role.code
    };
  });
};
