
export const getEmptyVideoFormData = (lang = 'EN') => ({
  name: '',
  filename: '',
  coverImageFilename: '',
  description: '',
  sizeBytes: 0,
  tags: '',
  lang,
  displayOrder: 0,
  isActive: true,
  uploadMethod: 'file' as const,
  file: null,
});
