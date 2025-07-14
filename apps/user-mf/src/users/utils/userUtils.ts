// User management utility functions

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;

export const ROLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const DEFAULT_PERMISSIONS = [
  'READ_USERS',
  'WRITE_USERS',
  'DELETE_USERS',
  'MANAGE_ROLES',
  'SYSTEM_CONFIG',
  'READ_CONTENT',
  'WRITE_CONTENT',
  'PUBLISH_CONTENT',
  'READ_DATA',
  'GENERATE_REPORTS',
  'VIEW_ANALYTICS',
  'MANAGE_TEAM',
] as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type RoleStatus = typeof ROLE_STATUS[keyof typeof ROLE_STATUS];
export type Permission = typeof DEFAULT_PERMISSIONS[number];

// Utility functions
export const getUserStatusColor = (status: UserStatus) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'success';
    case USER_STATUS.INACTIVE:
      return 'default';
    case USER_STATUS.SUSPENDED:
      return 'error';
    case USER_STATUS.PENDING:
      return 'warning';
    default:
      return 'default';
  }
};

export const getRoleStatusColor = (status: RoleStatus) => {
  switch (status) {
    case ROLE_STATUS.ACTIVE:
      return 'success';
    case ROLE_STATUS.INACTIVE:
      return 'default';
    default:
      return 'default';
  }
};

export const formatUserName = (fullName: string, username: string) => {
  return fullName || username || 'Unknown User';
};

export const formatLastLogin = (lastLogin: string) => {
  if (!lastLogin) return 'Never';
  const date = new Date(lastLogin);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
  // Username should be 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*(),.?":{}|<>';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
