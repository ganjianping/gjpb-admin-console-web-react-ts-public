export interface MultipleChoiceQuestionRu {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation?: string | null;
  difficultyLevel?: string | null;
  failCount: number;
  successCount: number;
  tags: string;
  grammarChapter?: string | null;
  scienceChapter?: string | null;
  lang: string;
  term?: number;
  week?: number;
  displayOrder: number;
  isActive: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MultipleChoiceQuestionRuPaginatedResponse {
  content: MultipleChoiceQuestionRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type MultipleChoiceQuestionRuActionType = 'create' | 'edit' | 'view';

export interface MultipleChoiceQuestionRuFormData {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation: string;
  difficultyLevel: string;
  tags: string;
  grammarChapter: string;
  scienceChapter: string;
  lang: string;
  term?: number;
  week?: number;
  displayOrder: number;
  isActive: boolean;
}

export interface MultipleChoiceQuestionRuSearchFormData {
  question?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}

export interface QuestionImageRu {
  id: string;
  questionId: string;
  questionTitle?: string;
  filename: string;
  fileUrl?: string;
  originalUrl?: string | null;
  url?: string;
  width?: number;
  height?: number;
  lang?: string;
  displayOrder?: number;
  createdBy?: string;
  updatedBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadQuestionImageRuByUrlRequest {
  multipleChoiceQuestionId: string;
  originalUrl: string;
  filename: string;
  lang: string;
}

export interface UploadQuestionImageRuByFileRequest {
  multipleChoiceQuestionId: string;
  file: File;
  filename: string;
}