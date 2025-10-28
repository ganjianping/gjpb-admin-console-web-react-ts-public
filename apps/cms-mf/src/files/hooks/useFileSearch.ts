import { useSearch } from '../../../../shared-lib/src/data-management';
import type { CmsFile, FileSearchFormData } from '../types/file.types';

export const useFileSearch = (allFiles: CmsFile[]) => {
  return useSearch<CmsFile, FileSearchFormData>({
    allItems: allFiles,
    initialFormData: {
      name: '',
      lang: '',
      tags: '',
      isActive: '',
    },
    filterFunction: (items, filters) => {
      let filtered = [...items];
      if (filters.name) {
        filtered = filtered.filter(file => file.name.toLowerCase().includes(filters.name.toLowerCase()));
      }
      if (filters.lang) {
        filtered = filtered.filter(file => file.lang.toLowerCase().includes(filters.lang.toLowerCase()));
      }
      if (filters.tags) {
        filtered = filtered.filter(file => file.tags.toLowerCase().includes(filters.tags.toLowerCase()));
      }
      if (filters.isActive !== '') {
        const isActive = filters.isActive === 'true';
        filtered = filtered.filter(file => file.isActive === isActive);
      }
      return filtered;
    },
  });
};
