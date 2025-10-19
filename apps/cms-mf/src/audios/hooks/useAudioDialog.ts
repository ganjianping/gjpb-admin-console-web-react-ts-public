import { useState } from 'react';
import type { Audio, AudioFormData, AudioActionType } from '../types/audio.types';
import { getEmptyAudioFormData } from '../utils/getEmptyAudioFormData';

export const useAudioDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<AudioActionType>('view');
  const [formData, setFormData] = useState<AudioFormData>(getEmptyAudioFormData());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedAudio, setSelectedAudio] = useState<Audio | null>(null);
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
    selectedAudio,
    setSelectedAudio,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};

export default useAudioDialog;
