import type { FileFormData, FileActionType, CmsFile } from '../types/file.types';
import FileViewDialog from './FileViewDialog';
import FileCreateDialog from './FileCreateDialog';
import FileEditDialog from './FileEditDialog';

interface FileDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: FileActionType;
  formData: FileFormData;
  selectedFile: CmsFile | null;
  onFormChange: (field: keyof FileFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

const FileDialog = ({
  open,
  onClose,
  actionType,
  formData,
  selectedFile,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: FileDialogProps) => {
  if (actionType === 'view' && selectedFile) {
    return (
      <FileViewDialog
        open={open}
        onClose={onClose}
        file={selectedFile}
        onEdit={() => {
          onClose();
          setTimeout(() => {
            const event = new CustomEvent('file-edit', { detail: selectedFile });
            window.dispatchEvent(event);
          }, 300);
        }}
      />
    );
  }
  if (actionType === 'create') {
    return (
      <FileCreateDialog
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
    <FileEditDialog
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

export default FileDialog;
