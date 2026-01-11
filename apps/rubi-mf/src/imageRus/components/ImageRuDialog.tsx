import type { ImageRuFormData, ImageRuActionType, ImageRu } from '../types/imageRu.types';
import ImageRuViewDialog from './ImageRuViewDialog';
import ImageRuCreateDialog from './ImageRuCreateDialog';
import ImageRuEditDialog from './ImageRuEditDialog';

interface ImageRuDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: ImageRuActionType;
  formData: ImageRuFormData;
  selectedImageRu: ImageRu | null;
  onFormChange: (field: keyof ImageRuFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

const ImageRuDialog = ({
  open,
  onClose,
  actionType,
  formData,
  selectedImageRu,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: ImageRuDialogProps) => {
  if (actionType === 'view' && selectedImageRu) {
    return (
      <ImageRuViewDialog
        open={open}
        onClose={onClose}
        imageRu={selectedImageRu}
        onEdit={() => {
          onClose();
          setTimeout(() => {
            const event = new CustomEvent('imageRu-edit', { detail: selectedImageRu });
            window.dispatchEvent(event);
          }, 300);
        }}
      />
    );
  }
  if (actionType === 'create') {
    return (
      <ImageRuCreateDialog
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
    <ImageRuEditDialog
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

export default ImageRuDialog;
