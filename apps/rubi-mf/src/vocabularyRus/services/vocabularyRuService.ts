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
  name?: string;
  lang?: string;
  difficultyLevel?: string;
  tags?: string;
  isActive?: boolean;
}

export interface CreateVocabularyRuRequest {
  name: string;
  phonetic?: string;
  partOfSpeech?: string;
  nounPluralForm?: string;
  verbSimplePastTense?: string;
  verbPastPerfectTense?: string;
  verbPresentParticiple?: string;
  adjectiveComparativeForm?: string;
  adjectiveSuperlativeForm?: string;
  verbForm?: string;
  verbMeaning?: string;
  verbExample?: string;
  adjectiveForm?: string;
  adjectiveMeaning?: string;
  adjectiveExample?: string;
  adverbForm?: string;
  adverbMeaning?: string;
  adverbExample?: string;
  translation?: string;
  synonyms?: string;
  definition?: string;
  example?: string;
  dictionaryUrl?: string;
  imageFilename?: string;
  imageOriginalUrl?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  tags?: string;
  difficultyLevel?: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateVocabularyRuByUploadRequest extends CreateVocabularyRuRequest {
  imageFile?: File;
  phoneticAudioFile?: File;
}

export interface UpdateVocabularyRuRequest {
  name?: string;
  phonetic?: string;
  partOfSpeech?: string;
  nounPluralForm?: string;
  verbSimplePastTense?: string;
  verbPastPerfectTense?: string;
  verbPresentParticiple?: string;
  adjectiveComparativeForm?: string;
  adjectiveSuperlativeForm?: string;
  verbForm?: string;
  verbMeaning?: string;
  verbExample?: string;
  adjectiveForm?: string;
  adjectiveMeaning?: string;
  adjectiveExample?: string;
  adverbForm?: string;
  adverbMeaning?: string;
  adverbExample?: string;
  translation?: string;
  synonyms?: string;
  definition?: string;
  example?: string;
  dictionaryUrl?: string;
  imageFilename?: string;
  imageOriginalUrl?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  tags?: string;
  difficultyLevel?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
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
    formData.append('name', data.name);
    formData.append('lang', data.lang);
    
    if (data.imageFile) {
      formData.append('imageFile', data.imageFile);
    }
    if (data.imageFilename) {
      formData.append('imageFilename', data.imageFilename);
    }
    if (data.imageOriginalUrl) {
      formData.append('imageOriginalUrl', data.imageOriginalUrl);
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
    if (data.verbSimplePastTense) {
      formData.append('verbSimplePastTense', data.verbSimplePastTense);
    }
    if (data.verbPastPerfectTense) {
      formData.append('verbPastPerfectTense', data.verbPastPerfectTense);
    }
    if (data.translation) {
      formData.append('translation', data.translation);
    }
    if (data.synonyms) {
      formData.append('synonyms', data.synonyms);
    }
    if (data.nounPluralForm) {
      formData.append('nounPluralForm', data.nounPluralForm);
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
    if (data.difficultyLevel) {
      formData.append('difficultyLevel', data.difficultyLevel);
    }

    return apiClient.post(`${this.crudUrl}`, formData);
  }

  async updateVocabularyRu(id: string, data: UpdateVocabularyRuRequest): Promise<ApiResponse<VocabularyRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async updateVocabularyRuWithFiles(
    id: string,
    data: UpdateVocabularyRuRequest & { imageFile?: File | null; phoneticAudioFile?: File | null },
  ): Promise<ApiResponse<VocabularyRu>> {
    const formData = new FormData();
    
    if (data.imageFile) {
      formData.append('imageFile', data.imageFile);
    }
    if (data.phoneticAudioFile) {
      formData.append('phoneticAudioFile', data.phoneticAudioFile);
    }
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.imageFilename) {
      formData.append('imageFilename', data.imageFilename);
    }
    if (data.imageOriginalUrl) {
      formData.append('imageOriginalUrl', data.imageOriginalUrl);
    }
    if (data.verbSimplePastTense !== undefined) {
      formData.append('verbSimplePastTense', data.verbSimplePastTense);
    }
    if (data.verbPastPerfectTense !== undefined) {
      formData.append('verbPastPerfectTense', data.verbPastPerfectTense);
    }
    if (data.translation !== undefined) {
      formData.append('translation', data.translation);
    }
    if (data.synonyms !== undefined) {
      formData.append('synonyms', data.synonyms);
    }
    if (data.nounPluralForm !== undefined) {
      formData.append('nounPluralForm', data.nounPluralForm);
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
    if (data.difficultyLevel !== undefined) {
      formData.append('difficultyLevel', data.difficultyLevel);
    }

    return apiClient.put(`${this.crudUrl}/${id}`, formData);
  }

  async deleteVocabularyRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const vocabularyRuService = new VocabularyRuService();
