import { useEffect, useState, useCallback, useRef } from 'react';
import { articleService } from '../services/articleService';
import type { ArticleQueryParams } from '../services/articleService';
import type { Article } from '../types/article.types';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { ARTICLE_CONSTANTS } from '../constants';

export const useArticles = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Article> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(ARTICLE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadArticles = useCallback(async (params?: ArticleQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const queryParams: ArticleQueryParams = {
        page: actualPage,
        size: actualSize,
        sort: ARTICLE_CONSTANTS.SORT_FIELD,
        direction: ARTICLE_CONSTANTS.SORT_DIRECTION,
        ...params,
      };

      const res = await articleService.getArticles(queryParams);
      if (res?.data) {
        // Handle both array (old) and paginated (new) response structures
        const responseData = res.data as any;
        let articles: Article[] = [];
        
        if (Array.isArray(responseData)) {
          articles = responseData;
        } else if (responseData && 'content' in responseData) {
          articles = responseData.content;
          setPagination(responseData);
        }
        
        setAllArticles(articles || []);
        setFilteredArticles(articles || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadArticles();
    }
  }, [loadArticles]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  }, []);

  return { 
    allArticles, 
    filteredArticles, 
    setFilteredArticles, 
    pagination,
    loading, 
    error, 
    currentPage,
    pageSize,
    loadArticles,
    handlePageChange,
    handlePageSizeChange
  };
};

export default useArticles;
