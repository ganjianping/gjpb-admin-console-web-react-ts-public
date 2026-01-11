import { useState } from 'react';
import type { AudioRu, AudioRuFormData, AudioRuActionType } from '../types/audioRu.types';
import { getEmptyAudioRuFormData } from '../utils/getEmptyAudioRuFormData';

export const useAudioRuDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<AudioRuActionType>('view');
  const [formData, setFormData] = useState<AudioRuFormData>(getEmptyAudioRuFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedAudioRu, setSelectedAudioRu] = useState<AudioRu | null>(null);
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
    selectedAudioRu,
    setSelectedAudioRu,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useAudioRuDialog;
