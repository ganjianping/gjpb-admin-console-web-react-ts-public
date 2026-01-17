import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  FillBlankQuestionRu,
  FillBlankQuestionRuPaginatedResponse,
  QuestionImageRu,
  UploadQuestionImageRuByUrlRequest,
  UploadQuestionImageRuByFileRequest,
} from '../types/fillBlankQuestionRu.types';

export interface FillBlankQuestionRuQueryParams {
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

export interface CreateFillBlankQuestionRuRequest {
  question: string;
  answer: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateFillBlankQuestionRuRequest {
  question?: string;
  answer?: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang?: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
}

class FillBlankQuestionRuService {
  private readonly getUrl = '/v1/fill-blank-question-rus';
  private readonly crudUrl = '/v1/fill-blank-question-rus';

  async getFillBlankQuestionRus(params?: FillBlankQuestionRuQueryParams): Promise<ApiResponse<FillBlankQuestionRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createFillBlankQuestionRu(data: CreateFillBlankQuestionRuRequest): Promise<ApiResponse<FillBlankQuestionRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async updateFillBlankQuestionRu(id: string, data: UpdateFillBlankQuestionRuRequest): Promise<ApiResponse<FillBlankQuestionRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteFillBlankQuestionRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }

  async getQuestionImages(fillBlankQuestionId: string): Promise<ApiResponse<QuestionImageRu[]>> {
    return apiClient.get('/v1/question-image-rus', { params: { fillBlankQuestionId } });
  }

  async uploadQuestionImageByUrl(data: UploadQuestionImageRuByUrlRequest): Promise<ApiResponse<QuestionImageRu>> {
    return apiClient.post('/v1/question-image-rus', data);
  }

  async uploadQuestionImageByFile(data: UploadQuestionImageRuByFileRequest): Promise<ApiResponse<QuestionImageRu>> {
    const formData = new FormData();
    formData.append('fillBlankQuestionId', data.fillBlankQuestionId);
    formData.append('filename', data.filename);
    formData.append('file', data.file);
    return apiClient.post('/v1/question-image-rus', formData);
  }

  async deleteQuestionImage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/question-image-rus/${id}/permanent`);
  }
}

export const fillBlankQuestionRuService = new FillBlankQuestionRuService();
