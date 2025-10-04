/**
 * Data Management Feature
 * 
 * Provides data table components and hooks for data operations like 
 * pagination, search, notifications, and dialog management.
 */

// Data components
export { DataTable, createColumnHelper, createStatusChip } from './DataTable';

// Data management hooks
export { usePagination } from './usePagination';
export { useNotification, type SnackbarState } from './useNotification';
export { useDataManagement, type UseDataManagementProps } from './useDataManagement';
export { useSearch, type UseSearchProps } from './useSearch';
export { useDialog, type UseDialogProps, type DialogActionType } from './useDialog';