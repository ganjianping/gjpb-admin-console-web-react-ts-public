import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Audio } from '../types/audio.types';

interface UseAudioActionMenuParams {
  onView: (audio: Audio) => void;
  onEdit: (audio: Audio) => void;
  onDelete: (audio: Audio) => void;
  onCopyFilename: (audio: Audio) => void;
  onCopyThumbnail: (audio: Audio) => void;
}

export const useAudioActionMenu = ({ onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail }: UseAudioActionMenuParams) => {
  const { t } = useTranslation();
  const actionMenuItems = useMemo(() => [
    {
      label: t('audios.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('audios.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('audios.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('audios.actions.copyThumbnail'),
      icon: <Copy size={16} />,
      action: onCopyThumbnail,
      color: 'secondary' as const,
    },
    {
      label: t('audios.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail]);
  return actionMenuItems;
};

export default useAudioActionMenu;
