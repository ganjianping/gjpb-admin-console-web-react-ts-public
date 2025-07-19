// Role status type
export type RoleStatus = 'active' | 'inactive';

// Search form data interface for roles
export interface RoleSearchFormData {
  name: string;
  permissions: string[];
  status: RoleStatus | '';
}

// Form data for create/edit role
export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
  status: RoleStatus;
}

// Dialog action types for roles
export type RoleActionType = 'view' | 'edit' | 'create' | 'delete' | null;

// Role interface matching the mock data structure
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: RoleStatus;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}
