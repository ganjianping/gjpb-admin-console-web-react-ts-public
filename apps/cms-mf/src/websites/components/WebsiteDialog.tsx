import type { WebsiteFormData, WebsiteActionType } from '../types/website.types';
import { WebsiteViewDialog } from './WebsiteViewDialog';
import { WebsiteFormDialog } from './WebsiteFormDialog';

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
        website={formData}
      />
    );
  }

  // Edit/Create mode - use the specialized form dialog
  // Type assertion is safe here because we've already filtered out 'view', 'delete', and null
  return (
    <WebsiteFormDialog
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