import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import type {
  VocabularyRu,
  VocabularyRuPaginatedResponse,
} from '../types/vocabularyRu.types';

export interface VocabularyRuQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  word?: string;
  lang?: string;
  difficultyLevel?: string;
  tags?: string;
  isActive?: boolean;
}

export interface CreateVocabularyRuRequest {
  word: string;
  wordImageFilename?: string;
  wordImageOriginalUrl?: string;
  simplePastTense?: string;
  pastPerfectTense?: string;
  translation?: string;
  synonyms?: string;
  pluralForm?: string;
  phonetic?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
  tags?: string;
  lang: string;
  difficultyLevel?: string;
  displayOrder?: number;
  isActive?: boolean;
  dictionaryUrl?: string;
}

export interface CreateVocabularyRuByUploadRequest extends CreateVocabularyRuRequest {
  wordImageFile?: File;
  phoneticAudioFile?: File;
}

export interface UpdateVocabularyRuRequest {
  word?: string;
  wordImageFilename?: string;
  wordImageOriginalUrl?: string;
  simplePastTense?: string;
  pastPerfectTense?: string;
  translation?: string;
  synonyms?: string;
  pluralForm?: string;
  phonetic?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
  tags?: string;
  lang?: string;
  difficultyLevel?: string;
  displayOrder?: number;
  isActive?: boolean;
  dictionaryUrl?: string;
}

class VocabularyRuService {
  private readonly getUrl = '/v1/vocabulary-rus';
  private readonly crudUrl = '/v1/vocabulary-rus';

  async getVocabularyRus(params?: VocabularyRuQueryParams): Promise<ApiResponse<VocabularyRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  async createVocabularyRu(data: CreateVocabularyRuRequest): Promise<ApiResponse<VocabularyRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async createVocabularyRuByUpload(data: CreateVocabularyRuByUploadRequest): Promise<ApiResponse<VocabularyRu>> {
    const formData = new FormData();
    formData.append('word', data.word);
    formData.append('lang', data.lang);
    
    if (data.wordImageFile) {
      formData.append('wordImageFile', data.wordImageFile);
    }
    if (data.wordImageFilename) {
      formData.append('wordImageFilename', data.wordImageFilename);
    }
    if (data.wordImageOriginalUrl) {
      formData.append('wordImageOriginalUrl', data.wordImageOriginalUrl);
    }
    if (data.phoneticAudioFile) {
      formData.append('phoneticAudioFile', data.phoneticAudioFile);
    }
    if (data.phoneticAudioFilename) {
      formData.append('phoneticAudioFilename', data.phoneticAudioFilename);
    }
    if (data.phoneticAudioOriginalUrl) {
      formData.append('phoneticAudioOriginalUrl', data.phoneticAudioOriginalUrl);
    }
    if (data.simplePastTense) {
      formData.append('simplePastTense', data.simplePastTense);
    }
    if (data.pastPerfectTense) {
      formData.append('pastPerfectTense', data.pastPerfectTense);
    }
    if (data.translation) {
      formData.append('translation', data.translation);
    }
    if (data.synonyms) {
      formData.append('synonyms', data.synonyms);
    }
    if (data.pluralForm) {
      formData.append('pluralForm', data.pluralForm);
    }
    if (data.phonetic) {
      formData.append('phonetic', data.phonetic);
    }
    if (data.partOfSpeech) {
      formData.append('partOfSpeech', data.partOfSpeech);
    }
    if (data.definition) {
      formData.append('definition', data.definition);
    }
    if (data.example) {
      formData.append('example', data.example);
    }
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    if (data.dictionaryUrl) {
      formData.append('dictionaryUrl', data.dictionaryUrl);
    }

    return apiClient.post(`${this.crudUrl}`, formData);
  }

  async updateVocabularyRu(id: string, data: UpdateVocabularyRuRequest): Promise<ApiResponse<VocabularyRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async updateVocabularyRuWithFiles(
    id: string,
    data: UpdateVocabularyRuRequest & { wordImageFile?: File | null; phoneticAudioFile?: File | null },
  ): Promise<ApiResponse<VocabularyRu>> {
    const formData = new FormData();
    
    if (data.wordImageFile) {
      formData.append('wordImageFile', data.wordImageFile);
    }
    if (data.phoneticAudioFile) {
      formData.append('phoneticAudioFile', data.phoneticAudioFile);
    }
    if (data.word) {
      formData.append('word', data.word);
    }
    if (data.wordImageFilename) {
      formData.append('wordImageFilename', data.wordImageFilename);
    }
    if (data.wordImageOriginalUrl) {
      formData.append('wordImageOriginalUrl', data.wordImageOriginalUrl);
    }
    if (data.simplePastTense !== undefined) {
      formData.append('simplePastTense', data.simplePastTense);
    }
    if (data.pastPerfectTense !== undefined) {
      formData.append('pastPerfectTense', data.pastPerfectTense);
    }
    if (data.translation !== undefined) {
      formData.append('translation', data.translation);
    }
    if (data.synonyms !== undefined) {
      formData.append('synonyms', data.synonyms);
    }
    if (data.pluralForm !== undefined) {
      formData.append('pluralForm', data.pluralForm);
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
    if (data.partOfSpeech) {
      formData.append('partOfSpeech', data.partOfSpeech);
    }
    if (data.definition !== undefined) {
      formData.append('definition', data.definition);
    }
    if (data.example !== undefined) {
      formData.append('example', data.example);
    }
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    if (data.lang) {
      formData.append('lang', data.lang);
    }
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    if (data.dictionaryUrl !== undefined) {
      formData.append('dictionaryUrl', data.dictionaryUrl);
    }

    return apiClient.put(`${this.crudUrl}/${id}`, formData);
  }

  async deleteVocabularyRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const vocabularyRuService = new VocabularyRuService();
