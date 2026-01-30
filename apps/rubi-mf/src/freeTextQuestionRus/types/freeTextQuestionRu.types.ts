export interface FreeTextQuestionRu {
  id: string;
  question: string;
  answer: string | null;
  explanation?: string | null;
  description?: string | null;
  questiona?: string | null;
  answera?: string | null;
  questionb?: string | null;
  answerb?: string | null;
  questionc?: string | null;
  answerc?: string | null;
  questiond?: string | null;
  answerd?: string | null;
  questione?: string | null;
  answere?: string | null;
  questionf?: string | null;
  answerf?: string | null;
  failCount?: number | null;
  successCount?: number | null;
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
  answer: string;
  explanation: string;
  description: string;
  questiona: string;
  answera: string;
  questionb: string;
  answerb: string;
  questionc: string;
  answerc: string;
  questiond: string;
  answerd: string;
  questione: string;
  answere: string;
  questionf: string;
  answerf: string;
  failCount?: number;
  successCount?: number;
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
