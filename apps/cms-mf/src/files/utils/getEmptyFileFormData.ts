import type { FileFormData } from '../types/file.types';

/**
 * Return a fresh FileFormData object with sensible defaults.
 * Keep this centralized so different consumers (hooks/pages) share the same shape.
 */
export const getEmptyFileFormData = (lang = 'EN'): FileFormData => ({
  name: '',
  originalUrl: '',
  sourceName: '',
  filename: '',
  extension: '',
  mimeType: '',
  sizeBytes: 0,
  tags: '',
  lang,
  displayOrder: 999,
  isActive: true,
  uploadMethod: 'url',
  file: null,
});

export default getEmptyFileFormData;
