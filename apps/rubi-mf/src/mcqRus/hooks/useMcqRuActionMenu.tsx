import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { McqRu } from '../types/mcqRu.types';

interface UseMcqRuActionMenuParams {
  onView: (mcqRu: McqRu) => void;
  onEdit: (mcqRu: McqRu) => void;
  onDelete: (mcqRu: McqRu) => void;
}

export const useMcqRuActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseMcqRuActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      [
        {
          label: t('mcqRus.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('mcqRus.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        {
          label: t('mcqRus.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
          divider: true,
        },
      ] as const,
    [t, onView, onEdit, onDelete],
  );
};

export default useMcqRuActionMenu;