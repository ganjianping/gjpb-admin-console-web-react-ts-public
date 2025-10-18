import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Video } from '../types/video.types';

interface UseVideoActionMenuParams {
  onView: (video: Video) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onCopyFilename: (video: Video) => void;
  onCopyThumbnail: (video: Video) => void;
}

export const useVideoActionMenu = ({ onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail }: UseVideoActionMenuParams) => {
  const { t } = useTranslation();
  const actionMenuItems = useMemo(() => [
    {
      label: t('videos.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('videos.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('videos.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('videos.actions.copyThumbnail'),
      icon: <Copy size={16} />,
      action: onCopyThumbnail,
      color: 'secondary' as const,
    },
    {
      label: t('videos.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail]);
  return actionMenuItems;
};
