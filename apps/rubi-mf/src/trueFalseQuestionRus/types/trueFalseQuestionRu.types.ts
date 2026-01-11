export interface TrueFalseQuestionRu {
  id: string;
  question: string;
  answer: string | null;
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

export interface TrueFalseQuestionRuPaginatedResponse {
  content: TrueFalseQuestionRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type TrueFalseQuestionRuActionType = "create" | "edit" | "view";

export interface TrueFalseQuestionRuFormData {
  question: string;
  answer: string;
  explanation: string;
  difficultyLevel: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

export interface TrueFalseQuestionRuSearchFormData {
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
  trueFalseQuestionId: string;
  originalUrl: string;
  filename: string;
  lang: string;
}

export interface UploadQuestionImageRuByFileRequest {
  trueFalseQuestionId: string;
  file: File;
  filename: string;
}
