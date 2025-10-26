import type { ArticleFormData } from '../types/article.types';

export const getEmptyArticleFormData = (lang = 'EN'): ArticleFormData => ({
  title: '',
  summary: '',
  content: '',
  originalUrl: '',
  sourceName: '',
  coverImageFilename: '',
  coverImageOriginalUrl: '',
  tags: '',
  lang,
  displayOrder: 999,
  isActive: true,
  coverImageFile: null,
});

export default getEmptyArticleFormData;
