export interface Question {
  id: string;
  question: string;
  answer: string;
  tags?: string | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface QuestionPaginatedResponse {
  content: Question[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type QuestionActionType = 'create' | 'edit' | 'view';

export interface QuestionFormData {
  question: string;
  answer: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

export interface QuestionSearchFormData {
  question?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
