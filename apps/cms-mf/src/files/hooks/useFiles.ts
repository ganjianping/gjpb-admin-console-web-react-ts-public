import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { FileQueryParams } from '../services/fileService';
import type { CmsFile } from '../types/file.types';
import { fileService } from '../services/fileService';

export const useFiles = () => {
  const { t } = useTranslation();
  const [allFiles, setAllFiles] = useState<CmsFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<CmsFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitiallyLoaded = useRef(false);
  const loadFiles = useCallback(async (params?: FileQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fileService.getFiles(params);
      if (response.status.code === 200) {
        setAllFiles(response.data);
        setFilteredFiles(response.data);
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
  }, [t]);
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      loadFiles();
      hasInitiallyLoaded.current = true;
    }
  }, [loadFiles]);
  return {
    allFiles,
    filteredFiles,
    setFilteredFiles,
    loading,
    error,
    loadFiles,
  };
};
