import type { FreeTextQuestionRuFormData } from '../types/freeTextQuestionRu.types';

export const getEmptyFreeTextQuestionRuFormData = (): FreeTextQuestionRuFormData => ({
  question: '',
  answer: '',
  explanation: '',
  difficultyLevel: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});
