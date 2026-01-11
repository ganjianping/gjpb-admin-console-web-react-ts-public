import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  TrueFalseQuestionRu,
  TrueFalseQuestionRuPaginatedResponse,
  QuestionImageRu,
  UploadQuestionImageRuByUrlRequest,
  UploadQuestionImageRuByFileRequest,
} from '../types/trueFalseQuestionRu.types';

export interface TrueFalseQuestionRuQueryParams {
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

export interface CreateTrueFalseQuestionRuRequest {
  question: string;
  answer: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateTrueFalseQuestionRuRequest {
  question?: string;
  answer?: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class TrueFalseQuestionRuService {
  private readonly getUrl = '/v1/true-false-question-rus';
  private readonly crudUrl = '/v1/true-false-question-rus';

  async getTrueFalseQuestionRus(params?: TrueFalseQuestionRuQueryParams): Promise<ApiResponse<TrueFalseQuestionRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createTrueFalseQuestionRu(data: CreateTrueFalseQuestionRuRequest): Promise<ApiResponse<TrueFalseQuestionRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async updateTrueFalseQuestionRu(id: string, data: UpdateTrueFalseQuestionRuRequest): Promise<ApiResponse<TrueFalseQuestionRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteTrueFalseQuestionRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }

  async getQuestionImages(trueFalseQuestionId: string): Promise<ApiResponse<QuestionImageRu[]>> {
    return apiClient.get('/v1/question-image-rus', { params: { trueFalseQuestionId } });
  }

  async uploadQuestionImageByUrl(data: UploadQuestionImageRuByUrlRequest): Promise<ApiResponse<QuestionImageRu>> {
    return apiClient.post('/v1/question-image-rus', data);
  }

  async uploadQuestionImageByFile(data: UploadQuestionImageRuByFileRequest): Promise<ApiResponse<QuestionImageRu>> {
    const formData = new FormData();
    formData.append('trueFalseQuestionId', data.trueFalseQuestionId);
    formData.append('filename', data.filename);
    formData.append('file', data.file);
    return apiClient.post('/v1/question-image-rus', formData);
  }

  async deleteQuestionImage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/question-image-rus/${id}/permanent`);
  }
}

export const trueFalseQuestionRuService = new TrueFalseQuestionRuService();
