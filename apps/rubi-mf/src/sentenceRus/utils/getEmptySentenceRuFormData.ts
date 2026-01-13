import type { SentenceRuFormData } from '../types/sentenceRu.types';

export const getEmptySentenceRuFormData = (): SentenceRuFormData => ({
  name: '',
  phonetic: '',
  translation: '',
  explanation: '',
  tags: '',
  lang: 'EN',
  difficultyLevel: 'Easy',
  displayOrder: 999,
  isActive: true,
});
