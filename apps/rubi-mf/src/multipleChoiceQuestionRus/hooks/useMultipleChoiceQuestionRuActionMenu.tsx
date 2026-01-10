import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { MultipleChoiceQuestionRu } from '../types/multipleChoiceQuestionRu.types';

interface UseMultipleChoiceQuestionRuActionMenuParams {
  onView: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => void;
  onEdit: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => void;
  onDelete: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => void;
}

export const useMultipleChoiceQuestionRuActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseMultipleChoiceQuestionRuActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      [
        {
          label: t('multipleChoiceQuestionRus.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('multipleChoiceQuestionRus.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        {
          label: t('multipleChoiceQuestionRus.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
          divider: true,
        },
      ],
    [t, onView, onEdit, onDelete],
  );
};

export default useMultipleChoiceQuestionRuActionMenu;