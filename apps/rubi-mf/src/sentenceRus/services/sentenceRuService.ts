import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  SentenceRu,
  SentenceRuPaginatedResponse,
} from '../types/sentenceRu.types';

export interface SentenceRuQueryParams {
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

export interface CreateSentenceRuRequest {
  name: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  tags?: string;
  lang: string;
  term?: number;
  week?: number;
  difficultyLevel?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateSentenceRuRequest {
  name?: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  tags?: string;
  lang?: string;
  term?: number;
  week?: number;
  difficultyLevel?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class SentenceRuService {
  private readonly getUrl = '/v1/sentence-rus';
  private readonly crudUrl = '/v1/sentence-rus';

  async getSentenceRus(params?: SentenceRuQueryParams): Promise<ApiResponse<SentenceRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createSentenceRu(data: CreateSentenceRuRequest): Promise<ApiResponse<SentenceRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async updateSentenceRu(id: string, data: UpdateSentenceRuRequest): Promise<ApiResponse<SentenceRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteSentenceRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const sentenceRuService = new SentenceRuService();
