import type { FillBlankQuestionRuFormData } from '../types/fillBlankQuestionRu.types';

export const getEmptyFillBlankQuestionRuFormData = (): FillBlankQuestionRuFormData => ({
  question: '',
  answer: '',
  explanation: '',
  difficultyLevel: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});
