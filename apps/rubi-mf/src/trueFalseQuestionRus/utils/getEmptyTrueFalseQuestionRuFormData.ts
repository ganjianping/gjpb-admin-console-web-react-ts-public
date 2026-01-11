import type { TrueFalseQuestionRuFormData } from '../types/trueFalseQuestionRu.types';

export const getEmptyTrueFalseQuestionRuFormData = (): TrueFalseQuestionRuFormData => ({
  question: '',
  answer: '',
  explanation: '',
  difficultyLevel: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});
