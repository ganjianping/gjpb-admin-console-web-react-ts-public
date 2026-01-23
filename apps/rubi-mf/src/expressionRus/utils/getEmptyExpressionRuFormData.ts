import type { ExpressionRuFormData } from '../types/expressionRu.types';

export const getEmptyExpressionRuFormData = (): ExpressionRuFormData => ({
  name: '',
  phonetic: '',
  translation: '',
  explanation: '',
  example: '',
  phoneticAudioFilename: '',
  phoneticAudioOriginalUrl: '',
  phoneticAudioUploadMethod: 'url',
  phoneticAudioFile: null,
  tags: '',
  lang: 'EN',
  difficultyLevel: 'Beginner',
  term: undefined,
  week: undefined,
  displayOrder: 999,
  isActive: true,
});
