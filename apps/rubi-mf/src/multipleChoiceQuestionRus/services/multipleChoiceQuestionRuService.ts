import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  MultipleChoiceQuestionRu,
  MultipleChoiceQuestionRuPaginatedResponse,
  QuestionImageRu,
  UploadQuestionImageRuByUrlRequest,
  UploadQuestionImageRuByFileRequest,
} from '../types/multipleChoiceQuestionRu.types';

export interface MultipleChoiceQuestionRuQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  question?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

export interface CreateMultipleChoiceQuestionRuRequest {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateMultipleChoiceQuestionRuRequest {
  question?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  answer?: string;
  explanation?: string;
  difficultyLevel?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class MultipleChoiceQuestionRuService {
  private readonly getUrl = '/v1/multiple-choice-question-rus';
  private readonly crudUrl = '/v1/multiple-choice-question-rus';

  async getMultipleChoiceQuestionRus(params?: MultipleChoiceQuestionRuQueryParams): Promise<ApiResponse<MultipleChoiceQuestionRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createMultipleChoiceQuestionRu(data: CreateMultipleChoiceQuestionRuRequest): Promise<ApiResponse<MultipleChoiceQuestionRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async updateMultipleChoiceQuestionRu(id: string, data: UpdateMultipleChoiceQuestionRuRequest): Promise<ApiResponse<MultipleChoiceQuestionRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteMultipleChoiceQuestionRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }

  async getQuestionImages(multipleChoiceQuestionId: string): Promise<ApiResponse<QuestionImageRu[]>> {
    return apiClient.get('/v1/question-image-rus', { params: { multipleChoiceQuestionId } });
  }

  async uploadQuestionImageByUrl(data: UploadQuestionImageRuByUrlRequest): Promise<ApiResponse<QuestionImageRu>> {
    return apiClient.post('/v1/question-image-rus', data);
  }

  async uploadQuestionImageByFile(data: UploadQuestionImageRuByFileRequest): Promise<ApiResponse<QuestionImageRu>> {
    const formData = new FormData();
    formData.append('multipleChoiceQuestionId', data.multipleChoiceQuestionId);
    formData.append('filename', data.filename);
    formData.append('file', data.file);
    return apiClient.post('/v1/question-image-rus', formData);
  }

  async deleteQuestionImage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/question-image-rus/${id}/permanent`);
  }
}

export const multipleChoiceQuestionRuService = new MultipleChoiceQuestionRuService();