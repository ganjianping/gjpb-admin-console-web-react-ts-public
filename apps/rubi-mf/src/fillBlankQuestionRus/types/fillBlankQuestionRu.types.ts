export interface FillBlankQuestionRu {
  id: string;
  question: string;
  answer: string | null;
  explanation?: string | null;
  difficultyLevel?: string | null;
  tags?: string | null;
  grammarChapter?: string | null;
  scienceChapter?: string | null;
  lang?: string | null;
  displayOrder?: number | null;
  term?: number | null;
  week?: number | null;
  isActive?: boolean | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface FillBlankQuestionRuPaginatedResponse {
  content: FillBlankQuestionRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type FillBlankQuestionRuActionType = "create" | "edit" | "view";

export interface FillBlankQuestionRuFormData {
  question: string;
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

export interface FillBlankQuestionRuSearchFormData {
  question?: string;
  lang?: string;
  tags?: string;
  difficultyLevel?: string;
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
  fillBlankQuestionId: string;
  originalUrl: string;
  filename: string;
  lang: string;
}

export interface UploadQuestionImageRuByFileRequest {
  fillBlankQuestionId: string;
  file: File;
  filename: string;
}
