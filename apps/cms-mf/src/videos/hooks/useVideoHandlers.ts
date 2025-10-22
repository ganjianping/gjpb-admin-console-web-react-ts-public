import { videoService } from '../services/videoService';
import type { VideoFormData } from '../types/video.types';

export const useVideoHandlers = ({ onSuccess, onError, onRefresh }: { onSuccess: (msg: string) => void; onError: (msg: string) => void; onRefresh?: () => void }) => {
  const createVideo = async (data: VideoFormData) => {
    try {
      if (data.uploadMethod === 'file' && data.file) {
        await videoService.createVideoByUpload(({
          file: data.file,
          name: data.name,
          sourceName: data.sourceName,
          tags: data.tags,
          lang: data.lang,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        } as unknown) as any);
      } else {
        await videoService.createVideo(({
          name: data.name,
          originalUrl: data.originalUrl,
          sourceName: data.sourceName,
          tags: data.tags,
          lang: data.lang,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        } as unknown) as any);
      }
      onSuccess('Video created successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to create video');
    }
  };

  const updateVideo = async (id: string, data: Partial<VideoFormData>) => {
    try {
      await videoService.updateVideo(id, data as any);
      onSuccess('Video updated successfully');
    } catch (err: any) {
      onError(err?.message || 'Failed to update video');
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await videoService.deleteVideo(id);
      onSuccess('Video deleted successfully');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      onError(err?.message || 'Failed to delete video');
    }
  };

  return { createVideo, updateVideo, deleteVideo };
};
