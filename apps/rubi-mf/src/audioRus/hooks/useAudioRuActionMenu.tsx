import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { AudioRu } from '../types/audioRu.types';

interface UseAudioRuActionMenuParams {
  onView: (audioRu: AudioRu) => void;
  onEdit: (audioRu: AudioRu) => void;
  onDelete: (audioRu: AudioRu) => void;
  onCopyFilename: (audioRu: AudioRu) => void;
  onCopyThumbnail: (audioRu: AudioRu) => void;
}

export const useAudioRuActionMenu = ({ onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail }: UseAudioRuActionMenuParams) => {
  const { t } = useTranslation();
  const actionMenuItems = useMemo(() => [
    {
      label: t('audioRus.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('audioRus.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('audioRus.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('audioRus.actions.copyThumbnail'),
      icon: <Copy size={16} />,
      action: onCopyThumbnail,
      color: 'secondary' as const,
    },
    {
      label: t('audioRus.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail]);
  return actionMenuItems;
};

export default useAudioRuActionMenu;
