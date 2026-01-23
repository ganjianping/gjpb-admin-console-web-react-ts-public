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
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  tags?: string;
  lang: string;
  term?: number;
  week?: number;
  difficultyLevel?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateSentenceRuByUploadRequest extends CreateSentenceRuRequest {
  phoneticAudioFile?: File;
}

export interface UpdateSentenceRuRequest {
  name?: string;
  phonetic?: string;
  translation?: string;
  explanation?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
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

  async createSentenceRuByUpload(data: CreateSentenceRuByUploadRequest): Promise<ApiResponse<SentenceRu>> {
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

  async updateSentenceRu(id: string, data: UpdateSentenceRuRequest): Promise<ApiResponse<SentenceRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async updateSentenceRuWithFiles(
    id: string,
    data: UpdateSentenceRuRequest & { phoneticAudioFile?: File | null },
  ): Promise<ApiResponse<SentenceRu>> {
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

  async deleteSentenceRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const sentenceRuService = new SentenceRuService();
