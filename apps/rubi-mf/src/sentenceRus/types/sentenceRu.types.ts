export interface SentenceRu {
  id: string;
  name: string;
  phonetic?: string | null;
  translation?: string | null;
  explanation?: string | null;
  tags?: string | null;
  difficultyLevel?: string | null;
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

export interface SentenceRuPaginatedResponse {
  content: SentenceRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type SentenceRuActionType = "create" | "edit" | "view";

export interface SentenceRuFormData {
  name: string;
  phonetic: string;
  translation: string;
  explanation: string;
  tags: string;
  lang: string;
  difficultyLevel: string;
  term?: number;
  week?: number;
  displayOrder: number;
  isActive: boolean;
}

export interface SentenceRuSearchFormData {
  name?: string;
  lang?: string;
  difficultyLevel?: string;
  tags?: string;
  isActive?: string | null;
}
