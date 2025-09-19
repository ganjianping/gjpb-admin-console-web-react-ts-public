// Re-export shared hooks from shared-lib
export { 
  usePagination, 
  useNotification,
  useDataManagement,
  useSearch,
  useDialog,
  type SnackbarState,
  type UseDataManagementProps,
  type UseSearchProps,
  type UseDialogProps,
  type DialogActionType
} from '../../../../shared-lib/src/hooks';
