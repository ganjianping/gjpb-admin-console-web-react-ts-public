export interface ArticleRu {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  originalUrl?: string | null;
  sourceName?: string | null;
  coverImageFilename?: string | null;
  coverImageFileUrl?: string | null;
  coverImageOriginalUrl?: string | null;
  tags?: string | null;
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

export interface ArticleRuPaginatedResponse {
  content: ArticleRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ArticleRuActionType = 'create' | 'edit' | 'view';

export interface ArticleRuFormData {
  title: string;
  summary: string;
  content: string;
  originalUrl: string;
  sourceName: string;
  coverImageFilename: string;
  coverImageOriginalUrl: string;
  tags: string;
  lang: string;
  term?: number;
  week?: number;
  displayOrder: number;
  isActive: boolean;
  coverImageFile: File | null;
}

export interface ArticleRuSearchFormData {
  title?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}

export interface ArticleRuImage {
  id: string;
  articleRuId: string;
  articleRuTitle?: string;
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

export interface UploadArticleRuImageByUrlRequest {
  articleRuId: string;
  articleRuTitle: string;
  originalUrl: string;
  filename: string;
  lang: string;
}

export interface UploadArticleRuImageByFileRequest {
  articleRuId: string;
  articleRuTitle: string;
  file: File;
  filename: string;
}
