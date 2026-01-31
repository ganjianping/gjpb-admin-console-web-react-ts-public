import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { ImageRuQueryParams } from '../services/imageRuService';
import type { ImageRu } from '../types/imageRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { imageRuService } from '../services/imageRuService';
import { IMAGE_CONSTANTS } from '../constants';

export const useImageRus = () => {
  const { t } = useTranslation();
  const [allImageRus, setAllImageRus] = useState<ImageRu[]>([]);
  const [filteredImageRus, setFilteredImageRus] = useState<ImageRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<ImageRu> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(IMAGE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadImageRus = useCallback(async (params?: ImageRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    try {
      setLoading(true);
      setError(null);

      const queryParams: ImageRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: IMAGE_CONSTANTS.SORT_FIELD,
        direction: IMAGE_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const response = await imageRuService.getImageRus(queryParams);
      if (response.status.code === 200) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = response.data as any;
        let imageRus: ImageRu[] = [];

        if (Array.isArray(responseData)) {
          imageRus = responseData;
        } else if (responseData && 'content' in responseData) {
          imageRus = responseData.content;
          setPagination(responseData);
        }

        setAllImageRus(imageRus || []);
        setFilteredImageRus(imageRus || []);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('imageRus.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load imageRus';
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
      loadImageRus();
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return {
    allImageRus,
    filteredImageRus,
    setFilteredImageRus,
    pagination,
    loading,
    error,
    currentPage,
    pageSize,
    loadImageRus,
    handlePageChange,
    handlePageSizeChange,
  };
};
