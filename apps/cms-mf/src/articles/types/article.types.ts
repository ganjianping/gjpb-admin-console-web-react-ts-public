export interface Article {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  originalUrl?: string | null;
  sourceName?: string | null;
  coverImageFilename?: string | null;
  coverImageOriginalUrl?: string | null;
  tags?: string | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type ArticleActionType = 'create' | 'edit' | 'view';

export interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  originalUrl: string;
  sourceName: string;
  coverImageFilename: string;
  coverImageOriginalUrl: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  coverImageFile: File | null;
}

export interface ArticleSearchFormData {
  title?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}

export interface ArticleImage {
  id: string;
  articleId: string;
  articleTitle?: string;
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

export interface UploadArticleImageByUrlRequest {
  articleId: string;
  articleTitle: string;
  originalUrl: string;
  filename: string;
  lang: string;
}

export interface UploadArticleImageByFileRequest {
  articleId: string;
  articleTitle: string;
  file: File;
  filename: string;
}
