export interface VocabularyRu {
  id: string;
  word: string;
  wordImageFilename?: string | null;
  wordImageOriginalUrl?: string | null;
  simplePastTense?: string | null;
  pastPerfectTense?: string | null;
  translation?: string | null;
  synonyms?: string | null;
  pluralForm?: string | null;
  phonetic?: string | null;
  phoneticAudioFilename?: string | null;
  phoneticAudioOriginalUrl?: string | null;
  dictionaryUrl?: string | null;
  partOfSpeech?: string | null;
  definition?: string | null;
  example?: string | null;
  tags?: string | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface VocabularyRuPaginatedResponse {
  content: VocabularyRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type VocabularyRuActionType = 'create' | 'edit' | 'view';

export interface VocabularyRuFormData {
  word: string;
  wordImageFilename: string;
  wordImageOriginalUrl: string;
  wordImageUploadMethod?: 'url' | 'file';
  simplePastTense: string;
  pastPerfectTense: string;
  translation: string;
  synonyms: string;
  pluralForm: string;
  phonetic: string;
  phoneticAudioFilename: string;
  phoneticAudioOriginalUrl: string;
  phoneticAudioUploadMethod?: 'url' | 'file';
  dictionaryUrl: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  wordImageFile: File | null;
  phoneticAudioFile: File | null;
}

export interface VocabularyRuSearchFormData {
  word?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
