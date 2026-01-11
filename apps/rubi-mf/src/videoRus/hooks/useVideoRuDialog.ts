import { useState } from 'react';
import type { VideoRu, VideoRuFormData, VideoRuActionType } from '../types/videoRu.types';
import { getEmptyVideoRuFormData } from '../utils/getEmptyVideoRuFormData';

export const useVideoRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<VideoRuActionType>('view');
  const [formData, setFormData] = useState<VideoRuFormData>(getEmptyVideoRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedVideoRu, setSelectedVideoRu] = useState<VideoRu | null>(null);
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
    selectedVideoRu,
    setSelectedVideoRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};
