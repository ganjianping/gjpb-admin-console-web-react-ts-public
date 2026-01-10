import type { MultipleChoiceQuestionRuFormData } from '../types/multipleChoiceQuestionRu.types';

export const getEmptyMultipleChoiceQuestionRuFormData = (): MultipleChoiceQuestionRuFormData => ({
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswers: '',
  explanation: '',
  difficultyLevel: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});