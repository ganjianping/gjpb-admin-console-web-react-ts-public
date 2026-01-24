export interface VideoRu {
  id: string;
  name: string;
  filename: string;
  fileUrl: string;
  sizeBytes: number;
  coverImageFilename?: string | null;
  coverImageFileUrl?: string | null;
  originalUrl?: string | null;
  sourceName?: string | null;
  description?: string | null;
  tags?: string | null;
  lang: string;
  term?: number | null;
  week?: number | null;
  displayOrder: number;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface VideoRuPaginatedResponse {
  content: VideoRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type VideoRuActionType = 'create' | 'edit' | 'view';

export interface VideoRuFormData {
  name: string;
  filename: string;
  coverImageFilename: string;
  originalUrl: string;
  sourceName: string;
  description: string;
  tags: string;
  lang: string;
  term?: number;
  week?: number;
  displayOrder: number;
  isActive: boolean;
  videoFile: File | null;
  coverImageFile: File | null;
}

export interface VideoRuSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
