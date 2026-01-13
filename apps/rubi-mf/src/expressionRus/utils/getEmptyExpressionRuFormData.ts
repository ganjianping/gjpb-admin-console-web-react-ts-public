import type { ExpressionRuFormData } from '../types/expressionRu.types';

export const getEmptyExpressionRuFormData = (): ExpressionRuFormData => ({
  name: '',
  phonetic: '',
  translation: '',
  explanation: '',
  example: '',
  tags: '',
  lang: 'EN',
  difficultyLevel: 'Beginner',
  displayOrder: 999,
  isActive: true,
});
