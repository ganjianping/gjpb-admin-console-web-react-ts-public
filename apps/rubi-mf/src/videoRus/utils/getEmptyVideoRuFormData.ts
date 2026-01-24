import type { VideoRuFormData } from '../types/videoRu.types';

export const getEmptyVideoRuFormData = (lang = 'EN'): VideoRuFormData => ({
  name: '',
  filename: '',
  coverImageFilename: '',
  sourceName: '',
  originalUrl: '',
  description: '',
  tags: '',
  lang,
  term: undefined,
  week: undefined,
  displayOrder: 999,
  isActive: true,
  videoFile: null,
  coverImageFile: null,
});
