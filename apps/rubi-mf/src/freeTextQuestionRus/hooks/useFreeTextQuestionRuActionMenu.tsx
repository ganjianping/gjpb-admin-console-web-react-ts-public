import { useTranslation } from 'react-i18next';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { createElement } from 'react';
import type { FreeTextQuestionRu } from '../types/freeTextQuestionRu.types';

interface UseActionMenuProps {
  onView: (freeTextQuestionRu: FreeTextQuestionRu) => void;
  onEdit: (freeTextQuestionRu: FreeTextQuestionRu) => void;
  onDelete: (freeTextQuestionRu: FreeTextQuestionRu) => void;
}

export const useFreeTextQuestionRuActionMenu = ({ onView, onEdit, onDelete }: UseActionMenuProps) => {
  const { t } = useTranslation();

  return [
    {
      icon: createElement(Eye, { size: 16 }),
      label: t('freeTextQuestionRus.actions.view'),
      action: onView,
    },
    {
      icon: createElement(Edit, { size: 16 }),
      label: t('freeTextQuestionRus.actions.edit'),
      action: onEdit,
    },
    {
      icon: createElement(Trash2, { size: 16 }),
      label: t('freeTextQuestionRus.actions.delete'),
      action: onDelete,
      color: 'error' as const,
    },
  ];
};
