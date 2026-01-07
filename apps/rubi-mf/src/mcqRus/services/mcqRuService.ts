import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  McqRu,
  McqRuPaginatedResponse,
} from '../types/mcqRu.types';

export interface McqRuQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  question?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

export interface CreateMcqRuRequest {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string;
  isMultipleCorrect: boolean;
  explanation?: string;
  difficultyLevel?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateMcqRuRequest {
  question?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswers?: string;
  isMultipleCorrect?: boolean;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class McqRuService {
  private readonly getUrl = '/v1/ru/mcqs';
  private readonly crudUrl = '/v1/ru/mcqs';

  async getMcqRus(params?: McqRuQueryParams): Promise<ApiResponse<McqRuPaginatedResponse>> {
    return apiClient.get<McqRuPaginatedResponse>(this.getUrl, { params });
  }

  async createMcqRu(data: CreateMcqRuRequest): Promise<ApiResponse<McqRu>> {
    return apiClient.post<McqRu>(this.crudUrl, data);
  }

  async updateMcqRu(id: string, data: UpdateMcqRuRequest): Promise<ApiResponse<McqRu>> {
    return apiClient.put<McqRu>(`${this.crudUrl}/${id}`, data);
  }

  async deleteMcqRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.crudUrl}/${id}`);
  }

  async getMcqRuById(id: string): Promise<ApiResponse<McqRu>> {
    return apiClient.get<McqRu>(`${this.crudUrl}/${id}`);
  }
}

export const mcqRuService = new McqRuService();