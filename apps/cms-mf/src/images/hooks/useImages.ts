import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ImageQueryParams } from '../services/imageService';
import type { Image } from '../types/image.types';
import { imageService } from '../services/imageService';

export const useImages = () => {
  const { t } = useTranslation();
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitiallyLoaded = useRef(false);
  const loadImages = useCallback(async (params?: ImageQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await imageService.getImages(params);
      if (response.status.code === 200) {
        setAllImages(response.data);
        setFilteredImages(response.data);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('images.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load images';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t]);
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      loadImages();
      hasInitiallyLoaded.current = true;
    }
  }, [loadImages]);
  return {
    allImages,
    filteredImages,
    setFilteredImages,
    loading,
    error,
    loadImages,
  };
};
