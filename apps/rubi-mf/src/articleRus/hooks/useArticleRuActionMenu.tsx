import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ArticleRu } from '../types/articleRu.types';

interface UseArticleRuActionMenuParams {
  onView: (articleRu: ArticleRu) => void;
  onEdit: (articleRu: ArticleRu) => void;
  onDelete: (articleRu: ArticleRu) => void;
  onCopyCoverImage?: (articleRu: ArticleRu) => void;
  onCopyOriginalUrl?: (articleRu: ArticleRu) => void;
}

export const useArticleRuActionMenu = ({
  onView,
  onEdit,
  onDelete,
  onCopyCoverImage,
  onCopyOriginalUrl,
}: UseArticleRuActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ([
        {
          label: t('articleRus.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('articleRus.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        onCopyCoverImage
          ? {
              label: t('articleRus.actions.copyCoverImage'),
              icon: <Copy size={16} />,
              action: onCopyCoverImage,
              color: 'secondary' as const,
            }
          : null,
        onCopyOriginalUrl
          ? {
              label: t('articleRus.actions.copyOriginalUrl'),
              icon: <Copy size={16} />,
              action: onCopyOriginalUrl,
              color: 'secondary' as const,
            }
          : null,
        {
          label: t('articleRus.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
          divider: true,
        },
      ] as const)
        .filter(Boolean) as Array<{
        label: string;
        icon: ReactNode;
        action: (articleRu: ArticleRu) => void;
        color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
        divider?: boolean;
      }>,
    [t, onView, onEdit, onDelete, onCopyCoverImage, onCopyOriginalUrl],
  );
};

export default useArticleRuActionMenu;
