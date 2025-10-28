import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { FileFormData } from '../types/file.types';
import type { CreateFileRequest, CreateFileByUploadRequest, UpdateFileRequest } from '../services/fileService';
import { fileService } from '../services/fileService';

interface UseFileHandlersParams {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export const useFileHandlers = ({
  onSuccess,
  onError,
  onRefresh,
}: UseFileHandlersParams) => {
  const { t } = useTranslation();
  const createFile = useCallback(async (formData: FileFormData) => {
    try {
      let response;
      if (formData.uploadMethod === 'file') {
        if (!formData.file) throw new Error(t('files.errors.fileRequired'));
        const data: CreateFileByUploadRequest = {
          file: formData.file,
          name: formData.name,
          sourceName: formData.sourceName,
          tags: formData.tags,
          lang: formData.lang,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        response = await fileService.createFileByUpload(data);
      } else {
        const data: CreateFileRequest = {
          name: formData.name,
          originalUrl: formData.originalUrl,
          sourceName: formData.sourceName,
          filename: formData.filename,
          tags: formData.tags,
          lang: formData.lang,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        response = await fileService.createFile(data);
      }
      if (response.status.code === 200) {
        onSuccess(t('files.messages.createSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useFileHandlers] createFile error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  const updateFile = useCallback(async (id: string, formData: FileFormData) => {
    try {
      const data: UpdateFileRequest = {
        name: formData.name,
        originalUrl: formData.originalUrl,
        sourceName: formData.sourceName,
        filename: formData.filename,
        extension: formData.extension,
        mimeType: formData.mimeType,
        sizeBytes: formData.sizeBytes,
        tags: formData.tags,
        lang: formData.lang,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      };
      const response = await fileService.updateFile(id, data);
      if (response.status.code === 200) {
        onSuccess(t('files.messages.updateSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useFileHandlers] updateFile error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  const deleteFile = useCallback(async (id: string) => {
    try {
      const response = await fileService.deleteFile(id);
      if (response.status.code === 200) {
        onSuccess(t('files.messages.deleteSuccess'));
        onRefresh();
      } else {
        onError(response.status.message);
      }
    } catch (err: any) {
      console.error('[useFileHandlers] deleteFile error:', err);
      onError(err?.message || String(err));
    }
  }, [t, onSuccess, onError, onRefresh]);
  return { createFile, updateFile, deleteFile };
};
