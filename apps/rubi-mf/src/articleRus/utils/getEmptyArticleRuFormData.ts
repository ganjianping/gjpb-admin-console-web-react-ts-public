import type { ArticleRuFormData } from '../types/articleRu.types';

export const getEmptyArticleRuFormData = (lang = 'EN'): ArticleRuFormData => ({
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

export default getEmptyArticleRuFormData;
