export interface FreeTextQuestionRu {
  id: string;
  question: string;
  correctAnswer: string | null;
  explanation?: string | null;
  difficultyLevel?: string | null;
  tags?: string | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface FreeTextQuestionRuPaginatedResponse {
  content: FreeTextQuestionRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type FreeTextQuestionRuActionType = "create" | "edit" | "view";

export interface FreeTextQuestionRuFormData {
  question: string;
  correctAnswer: string;
  explanation: string;
  difficultyLevel: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

export interface FreeTextQuestionRuSearchFormData {
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
  freeTextQuestionId: string;
  originalUrl: string;
  filename: string;
  lang: string;
}

export interface UploadQuestionImageRuByFileRequest {
  freeTextQuestionId: string;
  file: File;
  filename: string;
}
