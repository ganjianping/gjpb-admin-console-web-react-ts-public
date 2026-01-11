import React from 'react';
import type { VideoRuActionType, VideoRuFormData } from '../types/videoRu.types';

interface VideoRuDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: VideoRuActionType;
  formData: VideoRuFormData;
  selectedVideoRu?: any;
  onFormChange: (field: string, value: any) => void;
  onSubmit: () => Promise<void>;
  loading?: boolean;
  formErrors?: Record<string, string>;
}

const VideoRuDialog: React.FC<VideoRuDialogProps> = () => {
  // Minimal delegator - render nothing for now
  return null;
};

export default VideoRuDialog;
