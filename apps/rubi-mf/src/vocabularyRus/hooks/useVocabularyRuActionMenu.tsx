import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { VocabularyRu } from '../types/vocabularyRu.types';

interface UseVocabularyRuActionMenuParams {
  onView: (vocabularyRu: VocabularyRu) => void;
  onEdit: (vocabularyRu: VocabularyRu) => void;
  onDelete: (vocabularyRu: VocabularyRu) => void;
}

export const useVocabularyRuActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseVocabularyRuActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ([
        {
          label: t('vocabularyRus.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('vocabularyRus.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        {
          label: t('vocabularyRus.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
        },
      ] as any[]).filter(Boolean) as any[],
    [t, onView, onEdit, onDelete],
  );
};

export default useVocabularyRuActionMenu;
