import type { AccountStatus } from '../services/userService';

// Search form data interface
export interface SearchFormData {
  username: string;
  email: string;
  mobile: string;
  accountStatus: AccountStatus | '';
  roleCode: string;
  active: string;
}

// Form data for create/edit user
export interface UserFormData {
  username: string;
  password: string;
  nickname: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  accountStatus: AccountStatus;
  roleCodes: string[];
  active: boolean;
}

// Dialog action types
export type UserActionType = 'view' | 'edit' | 'create' | 'delete' | null;

// Snackbar state
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

// Status display mapping
export interface StatusDisplayMap {
  [key: string]: {
    label: string;
    color: 'success' | 'error' | 'warning' | 'default';
  };
}
