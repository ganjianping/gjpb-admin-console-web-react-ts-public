import { videoRuService } from '../services/videoRuService';
import type { VideoRuFormData } from '../types/videoRu.types';

export const useVideoRuHandlers = ({ onSuccess, onError, onRefresh }: { onSuccess: (msg: string) => void; onError: (msg: string) => void; onRefresh?: () => void }) => {
  const createVideoRu = async (data: VideoRuFormData) => {
    try {
      if (data.videoFile) {
        await videoRuService.createVideoRuByUpload({
          file: data.videoFile,
          name: data.name,
          filename: data.filename,
          coverImageFilename: data.coverImageFilename,
          coverImageFile: data.coverImageFile || undefined,
          sourceName: data.sourceName,
          originalUrl: data.originalUrl,
          description: data.description,
          tags: data.tags,
          lang: data.lang,
          term: data.term,
          week: data.week,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        });
      } else {
        await videoRuService.createVideoRu({
          name: data.name,
          filename: data.filename,
          coverImageFilename: data.coverImageFilename,
          sourceName: data.sourceName,
          originalUrl: data.originalUrl,
          description: data.description,
          tags: data.tags,
          lang: data.lang,
          term: data.term,
          week: data.week,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        });
      }
      onSuccess('VideoRu created successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to create videoRu');
    }
  };

  const updateVideoRu = async (id: string, data: Partial<VideoRuFormData>) => {
    try {
      await videoRuService.updateVideoRu(id, data as any);
      onSuccess('VideoRu updated successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to update videoRu');
    }
  };

  const deleteVideoRu = async (id: string) => {
    try {
      await videoRuService.deleteVideoRu(id);
      onSuccess('VideoRu deleted successfully');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      onError(err?.message || 'Failed to delete videoRu');
    }
  };

  return { createVideoRu, updateVideoRu, deleteVideoRu };
};
