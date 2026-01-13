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
  tags?: string;
  lang: string;
  difficultyLevel?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateExpressionRuRequest {
  name?: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  example?: string;
  tags?: string;
  lang?: string;
  difficultyLevel?: string;
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

  async updateExpressionRu(id: string, data: UpdateExpressionRuRequest): Promise<ApiResponse<ExpressionRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteExpressionRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const expressionRuService = new ExpressionRuService();
