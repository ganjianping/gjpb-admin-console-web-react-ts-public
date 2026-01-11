import { useEffect, useState, useCallback, useRef } from 'react';
import { articleRuService } from '../services/articleRuService';
import type { ArticleRuQueryParams } from '../services/articleRuService';
import type { ArticleRu } from '../types/articleRu.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { ARTICLE_CONSTANTS } from '../constants';

export const useArticleRus = () => {
  const [allArticleRus, setAllArticleRus] = useState<ArticleRu[]>([]);
  const [filteredArticleRus, setFilteredArticleRus] = useState<ArticleRu[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<ArticleRu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(ARTICLE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadArticleRus = useCallback(async (params?: ArticleRuQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: ArticleRuQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: ARTICLE_CONSTANTS.SORT_FIELD,
        direction: ARTICLE_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await articleRuService.getArticleRus(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let articleRus: ArticleRu[] = [];
        
        if (Array.isArray(responseData)) {
          articleRus = responseData;
        } else if (responseData && 'content' in responseData) {
          articleRus = responseData.content;
          setPagination(responseData);
        }
        
        setAllArticleRus(articleRus || []);
        setFilteredArticleRus(articleRus || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load articleRus');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadArticleRus();
    }
  }, [loadArticleRus]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allArticleRus, 
    filteredArticleRus, 
    setFilteredArticleRus, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadArticleRus,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useArticleRus;
