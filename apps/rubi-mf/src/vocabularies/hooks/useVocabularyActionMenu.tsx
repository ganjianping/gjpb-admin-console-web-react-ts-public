import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Vocabulary } from '../types/vocabulary.types';

interface UseVocabularyActionMenuParams {
  onView: (vocabulary: Vocabulary) => void;
  onEdit: (vocabulary: Vocabulary) => void;
  onDelete: (vocabulary: Vocabulary) => void;
}

export const useVocabularyActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseVocabularyActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ([
        {
          label: t('vocabularies.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('vocabularies.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        {
          label: t('vocabularies.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
        },
      ] as any[]).filter(Boolean) as any[],
    [t, onView, onEdit, onDelete],
  );
};

export default useVocabularyActionMenu;
