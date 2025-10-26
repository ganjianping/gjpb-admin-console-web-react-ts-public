import { useEffect, useState } from 'react';
import { articleService } from '../services/articleService';
import type { Article } from '../types/article.types';

export const useArticles = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async (params?: any) => {
    setLoading(true);
    try {
      const res = await articleService.getArticles(params);
      if (res?.data) {
        setAllArticles(res.data);
        setFilteredArticles(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return { allArticles, filteredArticles, setFilteredArticles, loading, error, loadArticles };
};

export default useArticles;
