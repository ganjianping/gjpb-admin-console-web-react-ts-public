import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { VideoRu } from '../types/videoRu.types';

interface UseVideoRuActionMenuParams {
  onView: (videoRu: VideoRu) => void;
  onEdit: (videoRu: VideoRu) => void;
  onDelete: (videoRu: VideoRu) => void;
  onCopyFilename: (videoRu: VideoRu) => void;
  onCopyThumbnail: (videoRu: VideoRu) => void;
}

export const useVideoRuActionMenu = ({ onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail }: UseVideoRuActionMenuParams) => {
  const { t } = useTranslation();
  const actionMenuItems = useMemo(() => [
    {
      label: t('videoRus.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('videoRus.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('videoRus.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('videoRus.actions.copyThumbnail'),
      icon: <Copy size={16} />,
      action: onCopyThumbnail,
      color: 'secondary' as const,
    },
    {
      label: t('videoRus.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail]);
  return actionMenuItems;
};
