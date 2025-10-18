import React from 'react';
import type { VideoActionType, VideoFormData } from '../types/video.types';

interface VideoDialogProps {
  open: boolean;
  onClose: () => void;
  actionType: VideoActionType;
  formData: VideoFormData;
  selectedVideo?: any;
  onFormChange: (field: string, value: any) => void;
  onSubmit: () => Promise<void>;
  loading?: boolean;
  formErrors?: Record<string, string>;
}

const VideoDialog: React.FC<VideoDialogProps> = (props) => {
  // Minimal delegator - render nothing for now
  return null;
};

export default VideoDialog;
