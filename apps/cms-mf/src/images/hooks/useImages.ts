import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ImageQueryParams } from '../services/imageService';
import type { Image } from '../types/image.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { imageService } from '../services/imageService';
import { IMAGE_CONSTANTS } from '../constants';

export const useImages = () => {
  const { t } = useTranslation();
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Image> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(IMAGE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadImages = useCallback(async (params?: ImageQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    try {
      setLoading(true);
      setError(null);

      const queryParams: ImageQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: IMAGE_CONSTANTS.SORT_FIELD,
        direction: IMAGE_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const response = await imageService.getImages(queryParams);
      if (response.status.code === 200) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = response.data as any;
        let images: Image[] = [];

        if (Array.isArray(responseData)) {
          images = responseData;
        } else if (responseData && 'content' in responseData) {
          images = responseData.content;
          setPagination(responseData);
        }

        setAllImages(images || []);
        setFilteredImages(images || []);
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
  }, [t]); // Removed currentPage and pageSize from dependencies

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadImages();
    }
  }, [loadImages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return {
    allImages,
    filteredImages,
    setFilteredImages,
    pagination,
    loading,
    error,
    currentPage,
    pageSize,
    loadImages,
    handlePageChange,
    handlePageSizeChange,
  };
};
