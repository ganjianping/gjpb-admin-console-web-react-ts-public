import type { MultipleChoiceQuestionRuFormData } from '../types/multipleChoiceQuestionRu.types';

export const getEmptyMultipleChoiceQuestionRuFormData = (): MultipleChoiceQuestionRuFormData => ({
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
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