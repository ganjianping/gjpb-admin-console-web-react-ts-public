import { useTranslation } from 'react-i18next';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { createElement } from 'react';
import type { TrueFalseQuestionRu } from '../types/trueFalseQuestionRu.types';

interface UseActionMenuProps {
  onView: (trueFalseQuestionRu: TrueFalseQuestionRu) => void;
  onEdit: (trueFalseQuestionRu: TrueFalseQuestionRu) => void;
  onDelete: (trueFalseQuestionRu: TrueFalseQuestionRu) => void;
}

export const useTrueFalseQuestionRuActionMenu = ({ onView, onEdit, onDelete }: UseActionMenuProps) => {
  const { t } = useTranslation();

  return [
    {
      icon: createElement(Eye, { size: 16 }),
      label: t('trueFalseQuestionRus.actions.view'),
      action: onView,
    },
    {
      icon: createElement(Edit, { size: 16 }),
      label: t('trueFalseQuestionRus.actions.edit'),
      action: onEdit,
    },
    {
      icon: createElement(Trash2, { size: 16 }),
      label: t('trueFalseQuestionRus.actions.delete'),
      action: onDelete,
      color: 'error' as const,
    },
  ];
};
