import { useTranslation } from 'react-i18next';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { createElement } from 'react';
import type { FillBlankQuestionRu } from '../types/fillBlankQuestionRu.types';

interface UseActionMenuProps {
  onView: (fillBlankQuestionRu: FillBlankQuestionRu) => void;
  onEdit: (fillBlankQuestionRu: FillBlankQuestionRu) => void;
  onDelete: (fillBlankQuestionRu: FillBlankQuestionRu) => void;
}

export const useFillBlankQuestionRuActionMenu = ({ onView, onEdit, onDelete }: UseActionMenuProps) => {
  const { t } = useTranslation();

  return [
    {
      icon: createElement(Eye, { size: 16 }),
      label: t('fillBlankQuestionRus.actions.view'),
      action: onView,
    },
    {
      icon: createElement(Edit, { size: 16 }),
      label: t('fillBlankQuestionRus.actions.edit'),
      action: onEdit,
    },
    {
      icon: createElement(Trash2, { size: 16 }),
      label: t('fillBlankQuestionRus.actions.delete'),
      action: onDelete,
      color: 'error' as const,
    },
  ];
};
