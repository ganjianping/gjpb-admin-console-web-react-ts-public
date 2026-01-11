export interface AudioRu {
  id: string;
  name: string;
  subtitle?: string | null;
  filename: string;
  sizeBytes: number;
  coverImageFilename: string;
  fileUrl: string;
  coverImageFileUrl: string;
  // optional fields returned by the API
  originalUrl?: string | null;
  sourceName?: string | null;
  artist?: string | null;
  description?: string | null;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AudioRuPaginatedResponse {
  content: AudioRu[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type AudioRuActionType = 'create' | 'edit' | 'view';

export interface AudioRuFormData {
  name: string;
  subtitle?: string;
  filename: string;
  coverImageFilename: string;
  sourceName?: string;
  originalUrl?: string;
  artist?: string;
  description: string;
  sizeBytes: number;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  uploadMethod: 'file';
  file: File | null;
  coverImageFile: File | null;
}

export interface AudioRuSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
