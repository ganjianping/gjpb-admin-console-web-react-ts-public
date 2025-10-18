
export const getEmptyVideoFormData = (lang = 'EN') => ({
  name: '',
  filename: '',
  coverImageFilename: '',
  coverImageFile: null,
  description: '',
  sizeBytes: 0,
  tags: '',
  lang,
  displayOrder: 999,
  isActive: true,
  uploadMethod: 'file' as const,
  file: null,
});
