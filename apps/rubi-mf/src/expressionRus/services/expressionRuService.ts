import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  ExpressionRu,
  ExpressionRuPaginatedResponse,
} from '../types/expressionRu.types';

export interface ExpressionRuQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  name?: string;
  lang?: string;
  difficultyLevel?: string;
  tags?: string;
  isActive?: boolean;
}

export interface CreateExpressionRuRequest {
  name: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  example?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  tags?: string;
  lang: string;
  difficultyLevel?: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateExpressionRuByUploadRequest extends CreateExpressionRuRequest {
  phoneticAudioFile?: File;
}

export interface UpdateExpressionRuRequest {
  name?: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  example?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  tags?: string;
  lang?: string;
  difficultyLevel?: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
}

class ExpressionRuService {
  private readonly getUrl = '/v1/expression-rus';
  private readonly crudUrl = '/v1/expression-rus';

  async getExpressionRus(params?: ExpressionRuQueryParams): Promise<ApiResponse<ExpressionRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createExpressionRu(data: CreateExpressionRuRequest): Promise<ApiResponse<ExpressionRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async createExpressionRuByUpload(data: CreateExpressionRuByUploadRequest): Promise<ApiResponse<ExpressionRu>> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('lang', data.lang);
    
    if (data.phoneticAudioFile) {
      formData.append('phoneticAudioFile', data.phoneticAudioFile);
    }
    if (data.phoneticAudioFilename) {
      formData.append('phoneticAudioFilename', data.phoneticAudioFilename);
    }
    if (data.phoneticAudioOriginalUrl) {
      formData.append('phoneticAudioOriginalUrl', data.phoneticAudioOriginalUrl);
    }
    if (data.phonetic) {
      formData.append('phonetic', data.phonetic);
    }
    if (data.translation) {
      formData.append('translation', data.translation);
    }
    if (data.explanation) {
      formData.append('explanation', data.explanation);
    }
    if (data.example) {
      formData.append('example', data.example);
    }
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    if (data.difficultyLevel) {
      formData.append('difficultyLevel', data.difficultyLevel);
    }
    if (data.term !== undefined) {
      formData.append('term', String(data.term));
    }
    if (data.week !== undefined) {
      formData.append('week', String(data.week));
    }
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }

    return apiClient.post(this.crudUrl, formData);
  }

  async updateExpressionRu(id: string, data: UpdateExpressionRuRequest): Promise<ApiResponse<ExpressionRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async updateExpressionRuWithFiles(
    id: string,
    data: UpdateExpressionRuRequest & { phoneticAudioFile?: File | null },
  ): Promise<ApiResponse<ExpressionRu>> {
    const formData = new FormData();
    
    if (data.phoneticAudioFile) {
      formData.append('phoneticAudioFile', data.phoneticAudioFile);
    }
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.phonetic) {
      formData.append('phonetic', data.phonetic);
    }
    if (data.phoneticAudioFilename) {
      formData.append('phoneticAudioFilename', data.phoneticAudioFilename);
    }
    if (data.phoneticAudioOriginalUrl) {
      formData.append('phoneticAudioOriginalUrl', data.phoneticAudioOriginalUrl);
    }
    if (data.translation !== undefined) {
      formData.append('translation', data.translation);
    }
    if (data.explanation !== undefined) {
      formData.append('explanation', data.explanation);
    }
    if (data.example !== undefined) {
      formData.append('example', data.example);
    }
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    if (data.lang) {
      formData.append('lang', data.lang);
    }
    if (data.difficultyLevel !== undefined) {
      formData.append('difficultyLevel', data.difficultyLevel);
    }
    if (data.term !== undefined) {
      formData.append('term', String(data.term));
    }
    if (data.week !== undefined) {
      formData.append('week', String(data.week));
    }
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }

    return apiClient.put(`${this.crudUrl}/${id}`, formData);
  }

  async deleteExpressionRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const expressionRuService = new ExpressionRuService();
