import type { ImageRuFormData } from '../types/imageRu.types';

/**
 * Return a fresh ImageRuFormData object with sensible defaults.
 * Keep this centralized so different consumers (hooks/pages) share the same shape.
 */
export const getEmptyImageRuFormData = (lang = 'EN'): ImageRuFormData => ({
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
  displayOrder: 999,
  isActive: true,
  uploadMethod: 'url',
  file: null,
});

export default getEmptyImageRuFormData;
