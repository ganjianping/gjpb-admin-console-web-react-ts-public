import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ImageRuFormData } from '../types/imageRu.types';
import type { CreateImageRequest, CreateImageRuByUploadRequest, UpdateImageRequest } from '../services/imageRuService';
import { imageRuService } from '../services/imageRuService';

interface UseImageRuHandlersParams {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export const useImageRuHandlers = ({
  onSuccess,
  onError,
  onRefresh,
}: UseImageRuHandlersParams) => {
  const { t } = useTranslation();
  const createImageRu = useCallback(async (formData: ImageRuFormData) => {
    try {
      let response;
      if (formData.uploadMethod === 'file') {
        if (!formData.file) throw new Error(t('imageRus.errors.fileRequired'));
        const data: CreateImageRuByUploadRequest = {
          file: formData.file,
          name: formData.name,
          sourceName: formData.sourceName,
          tags: formData.tags,
          lang: formData.lang,
          term: formData.term,
          week: formData.week,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        response = await imageRuService.createImageRuByUpload(data);
      } else {
        const data: CreateImageRequest = {
          name: formData.name,
          originalUrl: formData.originalUrl,
          sourceName: formData.sourceName,
          filename: formData.filename,
          tags: formData.tags,
          lang: formData.lang,
          term: formData.term,
          week: formData.week,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        response = await imageRuService.createImageRu(data);
      }
      if (response.status.code === 200) {
        onSuccess(t('imageRus.messages.createSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useImageRuHandlers] createImageRu error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  const updateImageRu = useCallback(async (id: string, formData: ImageRuFormData) => {
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
        term: formData.term,
        week: formData.week,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      };
      const response = await imageRuService.updateImageRu(id, data);
      if (response.status.code === 200) {
        onSuccess(t('imageRus.messages.updateSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useImageRuHandlers] updateImageRu error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  const deleteImageRu = useCallback(async (id: string) => {
    try {
      const response = await imageRuService.deleteImageRu(id);
      if (response.status.code === 200) {
        onSuccess(t('imageRus.messages.deleteSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useImageRuHandlers] deleteImageRu error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  return { createImageRu, updateImageRu, deleteImageRu };
};
