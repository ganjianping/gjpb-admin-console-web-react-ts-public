import { useMemo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { SentenceRu } from '../types/sentenceRu.types';

interface UseSentenceRuActionMenuParams {
  onView: (sentenceRu: SentenceRu) => void;
  onEdit: (sentenceRu: SentenceRu) => void;
  onDelete: (sentenceRu: SentenceRu) => void;
}

export const useSentenceRuActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseSentenceRuActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ([
        {
          label: t('sentenceRus.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('sentenceRus.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        {
          label: t('sentenceRus.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
        },
      ] as any[]).filter(Boolean) as any[],
    [t, onView, onEdit, onDelete],
  );
};
