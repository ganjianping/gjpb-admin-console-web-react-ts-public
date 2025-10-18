import { useState } from 'react';
import type { Video, VideoFormData, VideoActionType } from '../types/video.types';
import { getEmptyVideoFormData } from '../utils/getEmptyVideoFormData';

export const useVideoDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<VideoActionType>('view');
  const [formData, setFormData] = useState<VideoFormData>(getEmptyVideoFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLanguage = () => formData.lang || 'EN';

  return {
    dialogOpen,
    setDialogOpen,
    actionType,
    setActionType,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    selectedVideo,
    setSelectedVideo,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};
