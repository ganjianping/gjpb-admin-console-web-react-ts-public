import type { FreeTextQuestionRuFormData } from '../types/freeTextQuestionRu.types';

export const getEmptyFreeTextQuestionRuFormData = (): FreeTextQuestionRuFormData => ({
  question: '',
  correctAnswer: '',
  explanation: '',
  difficultyLevel: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});
