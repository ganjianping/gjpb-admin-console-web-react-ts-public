import type { QuestionFormData } from '../types/question.types';

export const getEmptyQuestionFormData = (): QuestionFormData => ({
  question: '',
  answer: '',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});
