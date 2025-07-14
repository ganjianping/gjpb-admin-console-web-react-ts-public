// Shared types across user-mf module

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
