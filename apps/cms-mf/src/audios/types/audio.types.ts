export interface Audio {
  id: string;
  name: string;
  subtitle?: string | null;
  filename: string;
  sizeBytes: number;
  coverImageFilename: string;
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

export interface AudioPaginatedResponse {
  content: Audio[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type AudioActionType = 'create' | 'edit' | 'view';

export interface AudioFormData {
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

export interface AudioSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
