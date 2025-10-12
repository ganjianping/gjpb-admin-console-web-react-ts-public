import { useSearch } from '../../../../shared-lib/src/data-management';
import type { Image, ImageSearchFormData } from '../types/image.types';

export const useImageSearch = (allImages: Image[]) => {
  return useSearch<Image, ImageSearchFormData>({
    allItems: allImages,
    initialFormData: {
      name: '',
      lang: '',
      tags: '',
      isActive: '',
    },
    filterFunction: (items, filters) => {
      let filtered = [...items];
      if (filters.name) {
        filtered = filtered.filter(image => image.name.toLowerCase().includes(filters.name.toLowerCase()));
      }
      if (filters.lang) {
        filtered = filtered.filter(image => image.lang.toLowerCase().includes(filters.lang.toLowerCase()));
      }
      if (filters.tags) {
        filtered = filtered.filter(image => image.tags.toLowerCase().includes(filters.tags.toLowerCase()));
      }
      if (filters.isActive !== '') {
        const isActive = filters.isActive === 'true';
        filtered = filtered.filter(image => image.isActive === isActive);
      }
      return filtered;
    },
  });
};
