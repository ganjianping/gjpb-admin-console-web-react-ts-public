import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ImageFormData } from '../types/image.types';
import type { CreateImageRequest, CreateImageByUploadRequest, UpdateImageRequest } from '../services/imageService';
import { imageService } from '../services/imageService';

interface UseImageHandlersParams {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export const useImageHandlers = ({
  onSuccess,
  onError,
  onRefresh,
}: UseImageHandlersParams) => {
  const { t } = useTranslation();
  const createImage = useCallback(async (formData: ImageFormData) => {
    try {
      let response;
      if (formData.uploadMethod === 'file') {
        if (!formData.file) throw new Error(t('images.errors.fileRequired'));
        const data: CreateImageByUploadRequest = {
          file: formData.file,
          name: formData.name,
          sourceName: formData.sourceName,
          tags: formData.tags,
          lang: formData.lang,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        response = await imageService.createImageByUpload(data);
      } else {
        const data: CreateImageRequest = {
          name: formData.name,
          originalUrl: formData.originalUrl,
          sourceName: formData.sourceName,
          filename: formData.filename,
          tags: formData.tags,
          lang: formData.lang,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        response = await imageService.createImage(data);
      }
      if (response.status.code === 200) {
        onSuccess(t('images.messages.createSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useImageHandlers] createImage error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  const updateImage = useCallback(async (id: string, formData: ImageFormData) => {
    try {
      const data: UpdateImageRequest = {
        name: formData.name,
        originalUrl: formData.originalUrl,
        sourceName: formData.sourceName,
        filename: formData.filename,
        thumbnailFilename: formData.thumbnailFilename,
        extension: formData.extension,
        mimeType: formData.mimeType,
        sizeBytes: formData.sizeBytes,
        width: formData.width,
        height: formData.height,
        altText: formData.altText,
        tags: formData.tags,
        lang: formData.lang,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      };
      const response = await imageService.updateImage(id, data);
      if (response.status.code === 200) {
        onSuccess(t('images.messages.updateSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useImageHandlers] updateImage error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  const deleteImage = useCallback(async (id: string) => {
    try {
      const response = await imageService.deleteImage(id);
      if (response.status.code === 200) {
        onSuccess(t('images.messages.deleteSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useImageHandlers] deleteImage error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  return { createImage, updateImage, deleteImage };
};
