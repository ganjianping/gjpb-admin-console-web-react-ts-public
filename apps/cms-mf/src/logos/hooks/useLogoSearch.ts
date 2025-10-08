import { useSearch } from '../../../../shared-lib/src/data-management';
import type { Logo, LogoSearchFormData } from '../types/logo.types';

export const useLogoSearch = (allLogos: Logo[]) => {
  return useSearch<Logo, LogoSearchFormData>({
    allItems: allLogos,
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
        filtered = filtered.filter(logo => 
          logo.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      // Filter by language (case-insensitive)
      if (filters.lang) {
        filtered = filtered.filter(logo => 
          logo.lang.toLowerCase().includes(filters.lang.toLowerCase())
        );
      }

      // Filter by tags (case-insensitive)
      if (filters.tags) {
        filtered = filtered.filter(logo => 
          logo.tags.toLowerCase().includes(filters.tags.toLowerCase())
        );
      }

      // Filter by isActive status
      if (filters.isActive !== '') {
        const isActive = filters.isActive === 'true';
        filtered = filtered.filter(logo => logo.isActive === isActive);
      }

      return filtered;
    },
  });
};
