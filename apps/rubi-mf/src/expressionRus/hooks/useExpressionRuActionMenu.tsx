import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ExpressionRu } from '../types/expressionRu.types';

interface UseExpressionRuActionMenuParams {
  onView: (expressionRu: ExpressionRu) => void;
  onEdit: (expressionRu: ExpressionRu) => void;
  onDelete: (expressionRu: ExpressionRu) => void;
}

export const useExpressionRuActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseExpressionRuActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ([
        {
          label: t('expressionRus.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('expressionRus.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        {
          label: t('expressionRus.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
        },
      ] as any[]).filter(Boolean) as any[],
    [t, onView, onEdit, onDelete],
  );
};
