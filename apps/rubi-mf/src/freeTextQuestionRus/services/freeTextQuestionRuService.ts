import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  FreeTextQuestionRu,
  FreeTextQuestionRuPaginatedResponse,
} from '../types/freeTextQuestionRu.types';

export interface FreeTextQuestionRuQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  question?: string;
  lang?: string;
  tags?: string;
  difficultyLevel?: string;
  isActive?: boolean;
}

export interface CreateFreeTextQuestionRuRequest {
  question: string;
  correctAnswer: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateFreeTextQuestionRuRequest {
  question?: string;
  correctAnswer?: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class FreeTextQuestionRuService {
  private readonly getUrl = '/v1/free-text-question-rus';
  private readonly crudUrl = '/v1/free-text-question-rus';

  async getFreeTextQuestionRus(params?: FreeTextQuestionRuQueryParams): Promise<ApiResponse<FreeTextQuestionRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createFreeTextQuestionRu(data: CreateFreeTextQuestionRuRequest): Promise<ApiResponse<FreeTextQuestionRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async updateFreeTextQuestionRu(id: string, data: UpdateFreeTextQuestionRuRequest): Promise<ApiResponse<FreeTextQuestionRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteFreeTextQuestionRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const freeTextQuestionRuService = new FreeTextQuestionRuService();
