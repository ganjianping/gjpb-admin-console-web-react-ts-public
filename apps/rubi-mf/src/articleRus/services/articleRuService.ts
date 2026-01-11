import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  ArticleRu,
  ArticleRuImage,
  ArticleRuPaginatedResponse,
  UploadArticleRuImageByUrlRequest,
  UploadArticleRuImageByFileRequest,
} from '../types/articleRu.types';

export interface ArticleRuQueryParams {
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

export interface CreateArticleRuByUploadRequest extends CreateArticleRequest {
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

class ArticleRuService {
  private readonly getUrl = '/v1/article-rus';
  private readonly crudUrl = '/v1/article-rus';

  async getArticleRus(params?: ArticleRuQueryParams): Promise<ApiResponse<ArticleRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createArticleRu(data: CreateArticleRequest): Promise<ApiResponse<ArticleRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async createArticleRuByUpload(data: CreateArticleRuByUploadRequest): Promise<ApiResponse<ArticleRu>> {
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

  async updateArticleRu(id: string, data: UpdateArticleRequest): Promise<ApiResponse<ArticleRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async updateArticleRuWithFiles(
    id: string,
    data: UpdateArticleRequest & { coverImageFile?: File | null },
  ): Promise<ApiResponse<ArticleRu>> {
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

  async deleteArticleRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }

  async getArticleRuImages(articleRuId: string): Promise<ApiResponse<ArticleRuImage[]>> {
    return apiClient.get('/v1/article-image-rus', { params: { articleRuId } });
  }

  async uploadArticleRuImageByUrl(data: UploadArticleRuImageByUrlRequest): Promise<ApiResponse<ArticleRuImage>> {
    return apiClient.post('/v1/article-image-rus', data);
  }

  async uploadArticleRuImageByFile(data: UploadArticleRuImageByFileRequest): Promise<ApiResponse<ArticleRuImage>> {
    const formData = new FormData();
    formData.append('articleRuId', data.articleRuId);
    formData.append('articleRuTitle', data.articleRuTitle);
    formData.append('filename', data.filename);
    formData.append('file', data.file);
    return apiClient.post('/v1/article-image-rus', formData);
  }

  async deleteArticleRuImage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/article-image-rus/${id}/permanent`);
  }
}

export const articleRuService = new ArticleRuService();
