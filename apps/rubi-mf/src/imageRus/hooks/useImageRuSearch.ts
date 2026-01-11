import { useSearch } from '../../../../shared-lib/src/data-management';
import type { ImageRu, ImageRuSearchFormData } from '../types/imageRu.types';

export const useImageRuSearch = (allImageRus: ImageRu[]) => {
  return useSearch<ImageRu, ImageRuSearchFormData>({
    allItems: allImageRus,
    initialFormData: {
      name: '',
      lang: '',
      tags: '',
      isActive: '',
    },
    filterFunction: (items, filters) => {
      let filtered = [...items];
      if (filters.name) {
        filtered = filtered.filter(imageRu => imageRu.name.toLowerCase().includes(filters.name.toLowerCase()));
      }
      if (filters.lang) {
        filtered = filtered.filter(imageRu => imageRu.lang.toLowerCase().includes(filters.lang.toLowerCase()));
      }
      if (filters.tags) {
        filtered = filtered.filter(imageRu => imageRu.tags.toLowerCase().includes(filters.tags.toLowerCase()));
      }
      if (filters.isActive !== '') {
        const isActive = filters.isActive === 'true';
        filtered = filtered.filter(imageRu => imageRu.isActive === isActive);
      }
      return filtered;
    },
  });
};
