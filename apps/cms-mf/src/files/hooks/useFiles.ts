import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { FileQueryParams } from '../services/fileService';
import type { CmsFile } from '../types/file.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { fileService } from '../services/fileService';
import { FILE_CONSTANTS } from '../constants';

export const useFiles = () => {
  const { t } = useTranslation();
  const [allFiles, setAllFiles] = useState<CmsFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<CmsFile[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<CmsFile> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(FILE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadFiles = useCallback(async (params?: FileQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    try {
      setLoading(true);
      setError(null);

      const queryParams: FileQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: FILE_CONSTANTS.SORT_FIELD,
        direction: FILE_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const response = await fileService.getFiles(queryParams);
      if (response.status.code === 200) {
        // Handle both array (legacy) and paginated response (new)
        const data = response.data;
        let files: CmsFile[] = [];
        
        if (Array.isArray(data)) {
          files = data;
        } else if (data && 'content' in data) {
          // @ts-ignore - we know content exists if check passes
          files = data.content;
          // @ts-ignore - we know data is paginated response
          setPagination(data);
        }
        
        setAllFiles(files);
        setFilteredFiles(files);
      } else {
        throw new Error(response.status.message);
      }
    } catch (err) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (t) {
        errorMessage = t('files.errors.loadFailed');
      } else {
        errorMessage = 'Failed to load files';
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
      loadFiles();
    }
  }, [loadFiles]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return {
    allFiles,
    filteredFiles,
    setFilteredFiles,
    pagination,
    loading,
    error,
    currentPage,
    pageSize,
    loadFiles,
    handlePageChange,
    handlePageSizeChange,
  };
};
