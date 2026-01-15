
export interface VideoRu {
  id: string;
  name: string;
  phonetic?: string | null;
  partOfSpeech?: string | null;
  nounPluralForm?: string | null;
  verbSimplePastTense?: string | null;
  verbPastPerfectTense?: string | null;
  verbPresentParticiple?: string | null;
  adjectiveComparativeForm?: string | null;
  adjectiveSuperlativeForm?: string | null;
  verbForm?: string | null;
  verbMeaning?: string | null;
  verbExample?: string | null;
  adjectiveForm?: string | null;
  adjectiveMeaning?: string | null;
  adjectiveExample?: string | null;
  adverbForm?: string | null;
  adverbMeaning?: string | null;
  adverbExample?: string | null;
  translation?: string | null;
  synonyms?: string | null;
  definition?: string | null;
  example?: string | null;
  dictionaryUrl?: string | null;
  imageFilename?: string | null;
  imageUrl?: string | null;
  imageOriginalUrl?: string | null;
  phoneticAudioFilename?: string | null;
  phoneticAudioUrl?: string | null;
  phoneticAudioOriginalUrl?: string | null;
  tags?: string;
  difficultyLevel?: string | null;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  // Legacy videoRu fields (keeping for backward compatibility)
  filename?: string;
  sizeBytes?: number;
  coverImageFilename?: string;
  fileUrl?: string;
  coverImageFileUrl?: string;
  originalUrl?: string | null;
  sourceName?: string | null;
  description?: string | null;
}

export interface VideoRuPaginatedResponse {
  content: VideoRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type VideoRuActionType = 'create' | 'edit' | 'view';


export interface VideoRuFormData {
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
  imageUrl?: string;
  imageOriginalUrl?: string;
  phoneticAudioFilename?: string;
  phoneticAudioUrl?: string;
  phoneticAudioOriginalUrl?: string;
  tags: string;
  difficultyLevel?: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  // Legacy videoRu fields (keeping for backward compatibility)
  filename?: string;
  coverImageFilename?: string;
  sourceName?: string;
  originalUrl?: string;
  description?: string;
  sizeBytes?: number;
  uploadMethod?: 'file';
  file?: File | null;
  coverImageFile?: File | null;
  imageFile?: File | null;
  phoneticAudioFile?: File | null;
}


export interface VideoRuSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
