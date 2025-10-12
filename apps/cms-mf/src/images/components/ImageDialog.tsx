import type { ImageFormData, ImageActionType, Image } from '../types/image.types';
import ImageViewDialog from './ImageViewDialog';
import ImageCreateDialog from './ImageCreateDialog';
import ImageEditDialog from './ImageEditDialog';

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: ImageActionType;
  formData: ImageFormData;
  selectedImage: Image | null;
  onFormChange: (field: keyof ImageFormData, value: any) => void;
  onSubmit: () => void;
  loading: boolean;
  formErrors: Record<string, string[] | string>;
}

const ImageDialog = ({
  open,
  onClose,
  actionType,
  formData,
  selectedImage,
  onFormChange,
  onSubmit,
  loading,
  formErrors,
}: ImageDialogProps) => {
  if (actionType === 'view' && selectedImage) {
    return (
      <ImageViewDialog
        open={open}
        onClose={onClose}
        image={selectedImage}
        onEdit={() => {
          onClose();
          setTimeout(() => {
            const event = new CustomEvent('image-edit', { detail: selectedImage });
            window.dispatchEvent(event);
          }, 300);
        }}
      />
    );
  }
  if (actionType === 'create') {
    return (
      <ImageCreateDialog
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
    <ImageEditDialog
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

export default ImageDialog;
