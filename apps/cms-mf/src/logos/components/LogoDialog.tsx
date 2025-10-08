import type { LogoFormData, LogoActionType } from '../types/logo.types';
import { LogoViewDialog } from './LogoViewDialog.tsx';
import { LogoFormDialog } from './LogoFormDialog.tsx';

interface LogoDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: LogoActionType;
  formData: LogoFormData;
  onFormChange: (field: keyof LogoFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

/**
 * LogoDialog - Router component that delegates to specialized dialogs
 * 
 * This component acts as a simple router that determines which specialized
 * dialog to render based on the action type:
 * - 'view' → LogoViewDialog (read-only, beautiful card layout)
 * - 'edit' | 'create' → LogoFormDialog (interactive form)
 */
export const LogoDialog = ({
  open,
  onClose,
  actionType,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: LogoDialogProps) => {
  // View mode - use the specialized view dialog
  if (actionType === 'view') {
    return (
      <LogoViewDialog
        open={open}
        onClose={onClose}
        logo={formData}
      />
    );
  }

  // Edit/Create mode - use the specialized form dialog
  return (
    <LogoFormDialog
      open={open}
      onClose={onClose}
      actionType={actionType as 'edit' | 'create'}
      formData={formData}
      onFormChange={onFormChange}
      onSubmit={onSubmit}
      loading={loading}
      formErrors={formErrors}
    />
  );
};
