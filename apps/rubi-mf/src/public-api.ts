export { default as VocabularyRusPage } from './vocabularyRus/pages/VocabularyRusPage';
export * from './vocabularyRus/types/vocabularyRu.types';
export { vocabularyRuService } from './vocabularyRus/services/vocabularyRuService';

export { default as MultipleChoiceQuestionRusPage } from './multipleChoiceQuestionRus/pages/MultipleChoiceQuestionRusPage';
export * from './multipleChoiceQuestionRus/types/multipleChoiceQuestionRu.types';
export { multipleChoiceQuestionRuService } from './multipleChoiceQuestionRus/services/multipleChoiceQuestionRuService';

export { default as FreeTextQuestionRusPage } from './freeTextQuestionRus/pages/FreeTextQuestionRusPage';
// Explicitly export types with prefixes to avoid ambiguity
export type {
  FreeTextQuestionRu,
  FreeTextQuestionRuPaginatedResponse,
  FreeTextQuestionRuActionType,
  FreeTextQuestionRuFormData,
  FreeTextQuestionRuSearchFormData,
  QuestionImageRu as FreeTextQuestionImageRu,
  UploadQuestionImageRuByUrlRequest as FreeTextUploadQuestionImageRuByUrlRequest,
  UploadQuestionImageRuByFileRequest as FreeTextUploadQuestionImageRuByFileRequest,
} from './freeTextQuestionRus/types/freeTextQuestionRu.types';
export { freeTextQuestionRuService } from './freeTextQuestionRus/services/freeTextQuestionRuService';
