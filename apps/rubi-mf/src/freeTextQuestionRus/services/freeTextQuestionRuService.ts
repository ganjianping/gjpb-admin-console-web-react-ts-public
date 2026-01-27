import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  FreeTextQuestionRu,
  FreeTextQuestionRuPaginatedResponse,
  QuestionImageRu,
  UploadQuestionImageRuByUrlRequest,
  UploadQuestionImageRuByFileRequest,
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
  answer: string;
  explanation?: string;
  description?: string;
  questiona?: string;
  answera?: string;
  questionb?: string;
  answerb?: string;
  questionc?: string;
  answerc?: string;
  questiond?: string;
  answerd?: string;
  questione?: string;
  answere?: string;
  questionf?: string;
  answerf?: string;
  difficultyLevel?: string;
  tags?: string;
  lang: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateFreeTextQuestionRuRequest {
  question?: string;
  answer?: string;
  explanation?: string;
  description?: string;
  questiona?: string;
  answera?: string;
  questionb?: string;
  answerb?: string;
  questionc?: string;
  answerc?: string;
  questiond?: string;
  answerd?: string;
  questione?: string;
  answere?: string;
  questionf?: string;
  answerf?: string;
  difficultyLevel?: string;
  tags?: string;
  lang?: string;
  term?: number;
  week?: number;
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

  async getQuestionImages(freeTextQuestionId: string): Promise<ApiResponse<QuestionImageRu[]>> {
    return apiClient.get('/v1/question-image-rus', { params: { freeTextQuestionId } });
  }

  async uploadQuestionImageByUrl(data: UploadQuestionImageRuByUrlRequest): Promise<ApiResponse<QuestionImageRu>> {
    return apiClient.post('/v1/question-image-rus', data);
  }

  async uploadQuestionImageByFile(data: UploadQuestionImageRuByFileRequest): Promise<ApiResponse<QuestionImageRu>> {
    const formData = new FormData();
    formData.append('freeTextQuestionId', data.freeTextQuestionId);
    formData.append('filename', data.filename);
    formData.append('file', data.file);
    return apiClient.post('/v1/question-image-rus', formData);
  }

  async deleteQuestionImage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/question-image-rus/${id}/permanent`);
  }
}

export const freeTextQuestionRuService = new FreeTextQuestionRuService();
