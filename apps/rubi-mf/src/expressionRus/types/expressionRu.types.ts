export interface ExpressionRu {
  id: string;
  name: string;
  phonetic?: string | null;
  translation?: string | null;
  explanation?: string | null;
  example?: string | null;
  tags?: string | null;
  difficultyLevel?: string | null;
  term?: number | null;
  week?: number | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ExpressionRuPaginatedResponse {
  content: ExpressionRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ExpressionRuActionType = "create" | "edit" | "view";

export interface ExpressionRuFormData {
  name: string;
  phonetic: string;
  translation: string;
  explanation: string;
  example: string;
  tags: string;
  lang: string;
  difficultyLevel: string;
  term?: number;
  week?: number;
  displayOrder: number;
  isActive: boolean;
}

export interface ExpressionRuSearchFormData {
  name?: string;
  lang?: string;
  difficultyLevel?: string;
  tags?: string;
  isActive?: string | null;
}
