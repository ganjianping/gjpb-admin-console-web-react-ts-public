import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Article } from '../types/article.types';

interface UseArticleActionMenuParams {
  onView: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  onCopyCoverImage?: (article: Article) => void;
  onCopyOriginalUrl?: (article: Article) => void;
}

export const useArticleActionMenu = ({
  onView,
  onEdit,
  onDelete,
  onCopyCoverImage,
  onCopyOriginalUrl,
}: UseArticleActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ([
        {
          label: t('articles.actions.view'),
          icon: <Eye size={16} />,
          action: onView,
          color: 'info' as const,
        },
        {
          label: t('articles.actions.edit'),
          icon: <Edit size={16} />,
          action: onEdit,
          color: 'primary' as const,
        },
        onCopyCoverImage
          ? {
              label: t('articles.actions.copyCoverImage'),
              icon: <Copy size={16} />,
              action: onCopyCoverImage,
              color: 'secondary' as const,
            }
          : null,
        onCopyOriginalUrl
          ? {
              label: t('articles.actions.copyOriginalUrl'),
              icon: <Copy size={16} />,
              action: onCopyOriginalUrl,
              color: 'secondary' as const,
            }
          : null,
        {
          label: t('articles.actions.delete'),
          icon: <Trash2 size={16} />,
          action: onDelete,
          color: 'error' as const,
          divider: true,
        },
      ] as const)
        .filter(Boolean) as Array<{
        label: string;
        icon: ReactNode;
        action: (article: Article) => void;
        color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
        divider?: boolean;
      }>,
    [t, onView, onEdit, onDelete, onCopyCoverImage, onCopyOriginalUrl],
  );
};

export default useArticleActionMenu;
