
export const getEmptyVideoRuFormData = (lang = 'EN') => ({
  name: '',
  filename: '',
  coverImageFilename: '',
  sourceName: '',
  originalUrl: '',
  coverImageFile: null,
  description: '',
  sizeBytes: 0,
  tags: '',
  lang,
  term: undefined,
  week: undefined,
  displayOrder: 999,
  isActive: true,
  uploadMethod: 'file' as const,
  file: null,
});
