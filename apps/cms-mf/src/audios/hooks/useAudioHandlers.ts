import { audioService } from '../services/audioService';
import type { AudioFormData } from '../types/audio.types';

export const useAudioHandlers = ({ onSuccess, onError, onRefresh }: { onSuccess: (msg: string) => void; onError: (msg: string) => void; onRefresh?: () => void }) => {
  const createAudio = async (data: AudioFormData) => {
    try {
      const filename = data.filename || (data.file ? data.file.name : '');
      const coverImageFilename = data.coverImageFilename || '';
      if (data.uploadMethod === 'file' && data.file) {
        // data.file and data.coverImageFile are narrowed here
        await audioService.createAudioByUpload({
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
        await audioService.createAudio({ name: data.name, filename, coverImageFilename, subtitle: (data as any).subtitle, originalUrl: data.originalUrl, sourceName: data.sourceName, description: data.description, tags: data.tags, lang: data.lang, displayOrder: data.displayOrder, isActive: data.isActive });
      }
      onSuccess('Audio created successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to create audio');
    }
  };

  const updateAudio = async (id: string, data: Partial<AudioFormData>) => {
    try {
      await audioService.updateAudio(id, data as any);
      onSuccess('Audio updated successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to update audio');
    }
  };

  const deleteAudio = async (id: string) => {
    try {
      await audioService.deleteAudio(id);
      onSuccess('Audio deleted successfully');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      onError(err?.message || 'Failed to delete audio');
    }
  };

  return { createAudio, updateAudio, deleteAudio };
};

export default useAudioHandlers;
