// Role status type
export type RoleStatus = 'active' | 'inactive';

// Search form data interface for roles
export interface RoleSearchFormData {
  name: string;
  status: RoleStatus | '';
  systemRole?: boolean;
}

// Form data for create/edit role
export interface RoleFormData {
  name: string;
  description: string;
  status: RoleStatus;
  parentRoleId?: string | null;
  systemRole: boolean;
  sortOrder?: number;
  level?: number;
}

// Dialog action types for roles
export type RoleActionType = 'view' | 'edit' | 'create' | 'delete' | null;

// Role interface matching the API structure
export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  level: number;
  parentRoleId: string | null;
  systemRole: boolean;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  // Tree structure support
  children?: Role[];
  expanded?: boolean;
  hasChildren?: boolean;
  displayLevel?: number; // For UI indentation
}
