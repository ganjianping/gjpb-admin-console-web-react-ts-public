import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Image } from '../types/image.types';

interface UseImageActionMenuParams {
  onView: (image: Image) => void;
  onEdit: (image: Image) => void;
  onDelete: (image: Image) => void;
  onCopyFilename: (image: Image) => void;
}

export const useImageActionMenu = ({
  onView,
  onEdit,
  onDelete,
  onCopyFilename,
}: UseImageActionMenuParams) => {
  const { t } = useTranslation();
  const actionMenuItems = useMemo(() => [
    {
      label: t('images.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('images.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('images.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('images.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename]);
  return actionMenuItems;
};
