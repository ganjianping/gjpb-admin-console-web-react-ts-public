export interface McqRu {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string;
  isMultipleCorrect: boolean;
  explanation?: string | null;
  difficultyLevel?: string | null;
  failCount: number;
  successCount: number;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface McqRuPaginatedResponse {
  content: McqRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type McqRuActionType = 'create' | 'edit' | 'view';

export interface McqRuFormData {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string;
  isMultipleCorrect: boolean;
  explanation: string;
  difficultyLevel: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

export interface McqRuSearchFormData {
  question?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}