export interface VocabularyRu {
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
  tags?: string | null;
  difficultyLevel?: string | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface VocabularyRuPaginatedResponse {
  content: VocabularyRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type VocabularyRuActionType = "create" | "edit" | "view";

export interface VocabularyRuFormData {
  name: string;
  phonetic: string;
  partOfSpeech: string;
  nounPluralForm: string;
  verbSimplePastTense: string;
  verbPastPerfectTense: string;
  verbPresentParticiple: string;
  adjectiveComparativeForm: string;
  adjectiveSuperlativeForm: string;
  verbForm: string;
  verbMeaning: string;
  verbExample: string;
  adjectiveForm: string;
  adjectiveMeaning: string;
  adjectiveExample: string;
  adverbForm: string;
  adverbMeaning: string;
  adverbExample: string;
  translation: string;
  synonyms: string;
  definition: string;
  example: string;
  dictionaryUrl: string;
  imageFilename: string;
  imageOriginalUrl: string;
  imageUploadMethod?: "url" | "file";
  phoneticAudioFilename: string;
  phoneticAudioOriginalUrl: string;
  phoneticAudioUploadMethod?: "url" | "file";
  tags: string;
  difficultyLevel: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  imageFile: File | null;
  phoneticAudioFile: File | null;
}

export interface VocabularyRuSearchFormData {
  name?: string;
  lang?: string;
  difficultyLevel?: string;
  tags?: string;
  isActive?: string | null;
}
