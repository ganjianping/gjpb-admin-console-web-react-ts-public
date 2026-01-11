import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ImageRu } from '../types/imageRu.types';

interface UseImageRuActionMenuParams {
  onView: (imageRu: ImageRu) => void;
  onEdit: (imageRu: ImageRu) => void;
  onDelete: (imageRu: ImageRu) => void;
  onCopyFilename: (imageRu: ImageRu) => void;
  onCopyThumbnail: (imageRu: ImageRu) => void;
}

export const useImageRuActionMenu = ({
  onView,
  onEdit,
  onDelete,
  onCopyFilename,
  onCopyThumbnail,
}: UseImageRuActionMenuParams) => {
  const { t } = useTranslation();
  const actionMenuItems = useMemo(() => [
    {
      label: t('imageRus.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('imageRus.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('imageRus.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('imageRus.actions.copyThumbnail'),
      icon: <Copy size={16} />,
      action: onCopyThumbnail,
      color: 'secondary' as const,
    },
    {
      label: t('imageRus.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename, onCopyThumbnail]);
  return actionMenuItems;
};
