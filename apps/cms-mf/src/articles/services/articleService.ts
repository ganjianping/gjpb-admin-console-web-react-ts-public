import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  Article,
  ArticleImage,
  UploadArticleImageByUrlRequest,
  UploadArticleImageByFileRequest,
} from '../types/article.types';

export interface ArticleQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  title?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

export interface CreateArticleRequest {
  title: string;
  summary: string;
  content: string;
  originalUrl?: string;
  sourceName?: string;
  coverImageFilename?: string;
  coverImageOriginalUrl?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateArticleByUploadRequest extends CreateArticleRequest {
  coverImageFile: File;
}

export interface UpdateArticleRequest {
  title?: string;
  summary?: string;
  content?: string;
  originalUrl?: string;
  sourceName?: string;
  coverImageFilename?: string;
  coverImageOriginalUrl?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class ArticleService {
  private readonly getUrl = '/v1/articles';
  private readonly crudUrl = '/v1/articles';

  async getArticles(params?: ArticleQueryParams): Promise<ApiResponse<Article[]>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createArticle(data: CreateArticleRequest): Promise<ApiResponse<Article>> {
    return apiClient.post(this.crudUrl, data);
  }

  async createArticleByUpload(data: CreateArticleByUploadRequest): Promise<ApiResponse<Article>> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('summary', data.summary);
    formData.append('content', data.content);
    formData.append('tags', data.tags);
    formData.append('lang', data.lang);
    formData.append('coverImageFile', data.coverImageFile);
    if (data.coverImageFilename) {
      formData.append('coverImageFilename', data.coverImageFilename);
    }
    if (data.originalUrl) {
      formData.append('originalUrl', data.originalUrl);
    }
    if (data.sourceName) {
      formData.append('sourceName', data.sourceName);
    }
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    // coverImageOriginalUrl doesn't make sense when uploading a file, but include if provided.
    if (data.coverImageOriginalUrl) {
      formData.append('coverImageOriginalUrl', data.coverImageOriginalUrl);
    }
    return apiClient.post(`${this.crudUrl}`, formData);
  }

  async updateArticle(id: string, data: UpdateArticleRequest): Promise<ApiResponse<Article>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async updateArticleWithFiles(
    id: string,
    data: UpdateArticleRequest & { coverImageFile?: File | null },
  ): Promise<ApiResponse<Article>> {
    const formData = new FormData();
    if (data.coverImageFile) {
      formData.append('coverImageFile', data.coverImageFile);
    }
    if (data.title) {
      formData.append('title', data.title);
    }
    if (data.summary !== undefined) {
      formData.append('summary', data.summary);
    }
    if (data.content !== undefined) {
      formData.append('content', data.content);
    }
    if (data.originalUrl) {
      formData.append('originalUrl', data.originalUrl);
    }
    if (data.sourceName) {
      formData.append('sourceName', data.sourceName);
    }
    if (data.coverImageFilename) {
      formData.append('coverImageFilename', data.coverImageFilename);
    }
    if (data.coverImageOriginalUrl) {
      formData.append('coverImageOriginalUrl', data.coverImageOriginalUrl);
    }
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    if (data.lang) {
      formData.append('lang', data.lang);
    }
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }

    return apiClient.put(`${this.crudUrl}/${id}`, formData);
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }

  async getArticleImages(articleId: string): Promise<ApiResponse<ArticleImage[]>> {
    return apiClient.get('/v1/article-images', { params: { articleId } });
  }

  async uploadArticleImageByUrl(data: UploadArticleImageByUrlRequest): Promise<ApiResponse<ArticleImage>> {
    return apiClient.post('/v1/article-images', data);
  }

  async uploadArticleImageByFile(data: UploadArticleImageByFileRequest): Promise<ApiResponse<ArticleImage>> {
    const formData = new FormData();
    formData.append('articleId', data.articleId);
    formData.append('articleTitle', data.articleTitle);
    formData.append('filename', data.filename);
    formData.append('file', data.file);
    return apiClient.post('/v1/article-images', formData);
  }

  async deleteArticleImage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/article-images/${id}/permanent`);
  }
}

export const articleService = new ArticleService();
