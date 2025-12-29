import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  Question,
  QuestionPaginatedResponse,
  QuestionFormData,
} from '../types/question.types';

export interface QuestionQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  question?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

class QuestionService {
  private readonly getUrl = '/v1/questions';
  private readonly crudUrl = '/v1/questions';

  async getQuestions(params?: QuestionQueryParams): Promise<ApiResponse<QuestionPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createQuestion(data: QuestionFormData): Promise<ApiResponse<Question>> {
    return apiClient.post(this.crudUrl, data);
  }

  async updateQuestion(id: string, data: QuestionFormData): Promise<ApiResponse<Question>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteQuestion(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const questionService = new QuestionService();
