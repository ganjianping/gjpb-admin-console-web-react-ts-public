import { audioRuService } from '../services/audioRuService';
import type { AudioRuFormData } from '../types/audioRu.types';

export const useAudioRuHandlers = ({ onSuccess, onError, onRefresh }: { onSuccess: (msg: string) => void; onError: (msg: string) => void; onRefresh?: () => void }) => {
  const createAudioRu = async (data: AudioRuFormData) => {
    try {
      const filename = data.filename || (data.file ? data.file.name : '');
      const coverImageFilename = data.coverImageFilename || '';
      if (data.uploadMethod === 'file' && data.file) {
        // data.file and data.coverImageFile are narrowed here
        await audioRuService.createAudioRuByUpload({
          file: data.file,
          name: data.name,
          filename,
          coverImageFilename,
          subtitle: (data as any).subtitle,
          sourceName: data.sourceName,
          originalUrl: data.originalUrl,
          description: data.description,
          tags: data.tags,
          lang: data.lang,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
          coverImageFile: data.coverImageFile || undefined,
        });
      } else {
        await audioRuService.createAudioRu({ name: data.name, filename, coverImageFilename, subtitle: (data as any).subtitle, originalUrl: data.originalUrl, sourceName: data.sourceName, description: data.description, tags: data.tags, lang: data.lang, displayOrder: data.displayOrder, isActive: data.isActive });
      }
      onSuccess('AudioRu created successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to create audioRu');
    }
  };

  const updateAudioRu = async (id: string, data: Partial<AudioRuFormData>) => {
    try {
      await audioRuService.updateAudioRu(id, data as any);
      onSuccess('AudioRu updated successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to update audioRu');
    }
  };

  const deleteAudioRu = async (id: string) => {
    try {
      await audioRuService.deleteAudioRu(id);
      onSuccess('AudioRu deleted successfully');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      onError(err?.message || 'Failed to delete audioRu');
    }
  };

  return { createAudioRu, updateAudioRu, deleteAudioRu };
};

export default useAudioRuHandlers;
