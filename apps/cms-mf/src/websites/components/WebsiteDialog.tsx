import type { WebsiteFormData, WebsiteActionType } from '../types/website.types';
import { WebsiteViewDialog } from './WebsiteViewDialog';
import { WebsiteCreateDialog } from './WebsiteCreateDialog';
import { WebsiteUpdateDialog } from './WebsiteUpdateDialog';

interface WebsiteDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: WebsiteActionType;
  formData: WebsiteFormData;
  onFormChange: (field: keyof WebsiteFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

/**
 * WebsiteDialog - Router component that delegates to specialized dialogs
 * 
 * This component acts as a simple router that determines which specialized
 * dialog to render based on the action type:
 * - 'view' → WebsiteViewDialog (read-only, beautiful card layout)
 * - 'edit' | 'create' → WebsiteFormDialog (interactive form)
 */
export const WebsiteDialog = ({
  open,
  onClose,
  actionType,
  formData,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: WebsiteDialogProps) => {
  // View mode - use the specialized view dialog
  if (actionType === 'view') {
    return (
      <WebsiteViewDialog
        open={open}
        onClose={onClose}
        // formData is a partial subset when coming from the dialog router; cast to any to satisfy the view component
        website={formData as any}
      />
    );
  }

  // Edit/Create mode - delegate to concrete dialogs
  if (actionType === 'create') {
    return (
      <WebsiteCreateDialog
        open={open}
        onClose={onClose}
        formData={formData}
        onFormChange={onFormChange}
        onSubmit={onSubmit}
        loading={loading}
        formErrors={formErrors}
      />
    );
  }

  return (
    <WebsiteUpdateDialog
      open={open}
      onClose={onClose}
      formData={formData}
      onFormChange={onFormChange}
      onSubmit={onSubmit}
      loading={loading}
      formErrors={formErrors}
    />
  );
};