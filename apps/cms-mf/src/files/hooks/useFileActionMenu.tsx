import { useMemo } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { CmsFile } from '../types/file.types';

interface UseFileActionMenuParams {
  onView: (file: CmsFile) => void;
  onEdit: (file: CmsFile) => void;
  onDelete: (file: CmsFile) => void;
  onCopyFilename: (file: CmsFile) => void;
  onCopyUrl: (file: CmsFile) => void;
}

export const useFileActionMenu = ({
  onView,
  onEdit,
  onDelete,
  onCopyFilename,
  onCopyUrl,
}: UseFileActionMenuParams) => {
  const { t } = useTranslation();
  const actionMenuItems = useMemo(() => [
    {
      label: t('files.actions.view'),
      icon: <Eye size={16} />,
      action: onView,
      color: 'info' as const,
    },
    {
      label: t('files.actions.edit'),
      icon: <Edit size={16} />,
      action: onEdit,
      color: 'primary' as const,
    },
    {
      label: t('files.actions.copyFilename'),
      icon: <Copy size={16} />,
      action: onCopyFilename,
      color: 'secondary' as const,
    },
    {
      label: t('files.actions.copyUrl'),
      icon: <Copy size={16} />,
      action: onCopyUrl,
      color: 'secondary' as const,
    },
    {
      label: t('files.actions.delete'),
      icon: <Trash2 size={16} />,
      action: onDelete,
      color: 'error' as const,
      divider: true,
    },
  ], [t, onView, onEdit, onDelete, onCopyFilename, onCopyUrl]);
  return actionMenuItems;
};
