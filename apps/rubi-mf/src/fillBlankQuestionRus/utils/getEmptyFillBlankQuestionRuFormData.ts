import type { FillBlankQuestionRuFormData } from '../types/fillBlankQuestionRu.types';

export const getEmptyFillBlankQuestionRuFormData = (): FillBlankQuestionRuFormData => ({
  question: '',
  answer: '',
  explanation: '',
  difficultyLevel: '',
  tags: '',
  grammarChapter: '',
  scienceChapter: '',
  lang: 'EN',
  term: undefined,
  week: undefined,
  displayOrder: 999,
  isActive: true,
});
