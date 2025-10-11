import type { LogoFormData, LogoActionType, Logo } from '../types/logo.types';
import { LogoViewDialog } from './LogoViewDialog.tsx';
import { LogoCreateDialog } from './LogoCreateDialog.tsx';
import { LogoEditDialog } from './LogoEditDialog.tsx';

interface LogoDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: LogoActionType;
  formData: LogoFormData;
  selectedLogo: Logo | null;
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
 * - 'create' → LogoCreateDialog (create form with upload options)
 * - 'edit' → LogoEditDialog (edit form with read-only filename)
 */
export const LogoDialog = ({
  open,
  onClose,
  actionType,
  formData,
  selectedLogo,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: LogoDialogProps) => {
  // View mode - use the specialized view dialog
  if (actionType === 'view' && selectedLogo) {
    return (
      <LogoViewDialog
        open={open}
        onClose={onClose}
        logo={selectedLogo}
        onEdit={() => {
          // Switch to edit mode with the selected logo
          if (typeof window !== 'undefined') {
            // Use a custom event or callback to trigger edit
            // This assumes LogoDialog is controlled by parent state
            // You may need to lift state up if not already
            // For now, just call onClose and let parent open edit dialog
            onClose();
            setTimeout(() => {
              const event = new CustomEvent('logo-edit', { detail: selectedLogo });
              window.dispatchEvent(event);
            }, 300);
          }
        }}
      />
    );
  }

  // Create mode - use the specialized create dialog
  if (actionType === 'create') {
    return (
      <LogoCreateDialog
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

  // Edit mode - use the specialized edit dialog
  return (
    <LogoEditDialog
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
