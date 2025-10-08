import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations.ts'; // Initialize logos translations
import type { LogoQueryParams } from '../services/logoService';
import type { Logo } from '../types/logo.types';
import { logoService } from '../services/logoService';
import { LOGO_CONSTANTS } from '../constants';

export const useLogos = () => {
  const { t } = useTranslation();
  const [allLogos, setAllLogos] = useState<Logo[]>([]);
  const [filteredLogos, setFilteredLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitiallyLoaded = useRef(false);

  // Memoized function to load logos
  const loadLogos = useCallback(async (params?: LogoQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: LogoQueryParams = {
        sort: LOGO_CONSTANTS.SORT_FIELD,
        direction: LOGO_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const response = await logoService.getLogos(queryParams);
      
      if (response.status.code === 200) {
        // Transform tags string to array for each logo
        const logosWithTagsArray = response.data.map(logo => ({
          ...logo,
          tagsArray: logo.tags ? logo.tags.split(',').map(tag => tag.trim()) : []
        }));
        
        setAllLogos(logosWithTagsArray);
        setFilteredLogos(logosWithTagsArray);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('logos.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load logos';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load logos only once on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadLogos();
    }
  }, [loadLogos]);

  return {
    allLogos,
    filteredLogos,
    setFilteredLogos,
    loading,
    error,
    setError,
    loadLogos,
  };
};
