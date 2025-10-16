import type { ImageFormData } from '../types/image.types';

/**
 * Return a fresh ImageFormData object with sensible defaults.
 * Keep this centralized so different consumers (hooks/pages) share the same shape.
 */
export const getEmptyImageFormData = (lang = 'EN'): ImageFormData => ({
  name: '',
  originalUrl: '',
  sourceName: '',
  filename: '',
  thumbnailFilename: '',
  extension: '',
  mimeType: '',
  sizeBytes: 0,
  width: 0,
  height: 0,
  altText: '',
  tags: '',
  lang,
  displayOrder: 0,
  isActive: true,
  uploadMethod: 'url',
  file: null,
});

export default getEmptyImageFormData;
