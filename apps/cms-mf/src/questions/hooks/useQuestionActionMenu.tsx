import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Question } from '../types/question.types';

interface UseQuestionActionMenuParams {
  onView: (question: Question) => void;
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

export const useQuestionActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseQuestionActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ([
        {
          label: t('questions.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('questions.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        {
          label: t('questions.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
        },
      ].filter(Boolean)),
    [onView, onEdit, onDelete, t]
  );
};
