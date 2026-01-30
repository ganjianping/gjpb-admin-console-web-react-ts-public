import type { TrueFalseQuestionRuFormData } from '../types/trueFalseQuestionRu.types';

export const getEmptyTrueFalseQuestionRuFormData = (): TrueFalseQuestionRuFormData => ({
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
