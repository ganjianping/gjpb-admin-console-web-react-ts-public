// Shared types across user-mf module

// Status display mapping
export interface StatusDisplayMap {
  [key: string]: {
    label: string;
    color: 'success' | 'error' | 'warning' | 'default';
  };
}
