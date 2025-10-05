import { useSearch } from '../../../../shared-lib/src/data-management';
import type { Website, WebsiteSearchFormData } from '../types/website.types';

export const useWebsiteSearch = (allWebsites: Website[]) => {
  return useSearch<Website, WebsiteSearchFormData>({
    allItems: allWebsites,
    initialFormData: {
      name: '',
      lang: '',
      tags: '',
      isActive: '',
    },
    filterFunction: (items, filters) => {
      let filtered = [...items];

      // Filter by name (case-insensitive)
      if (filters.name) {
        filtered = filtered.filter(website => 
          website.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      // Filter by language (case-insensitive)
      if (filters.lang) {
        filtered = filtered.filter(website => 
          website.lang.toLowerCase().includes(filters.lang.toLowerCase())
        );
      }

      // Filter by tags (case-insensitive)
      if (filters.tags) {
        filtered = filtered.filter(website => 
          website.tags.toLowerCase().includes(filters.tags.toLowerCase())
        );
      }

      // Filter by isActive status
      if (filters.isActive !== '') {
        const isActive = filters.isActive === 'true';
        filtered = filtered.filter(website => website.isActive === isActive);
      }

      return filtered;
    },
  });
};
