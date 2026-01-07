import type { McqRuFormData } from '../types/mcqRu.types';

export const getEmptyMcqRuFormData = (): McqRuFormData => ({
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswers: '',
  isMultipleCorrect: false,
  explanation: '',
  difficultyLevel: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});