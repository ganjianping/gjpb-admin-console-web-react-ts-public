import type { Role } from './role.types';

export type RoleActionType = 'view' | 'edit' | 'delete' | 'create' | null;

export interface RoleFormData extends Partial<Role> {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  code: string;
  sortOrder: number;
  level: number;
  parentRoleId: string | null;
  systemRole: boolean;
}

export interface RoleFormErrors {
  [key: string]: string | string[];
}
