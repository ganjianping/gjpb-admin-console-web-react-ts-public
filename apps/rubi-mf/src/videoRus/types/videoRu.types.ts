
export interface VideoRu {
  id: string;
  name: string;
  filename: string;
  sizeBytes: number;
  coverImageFilename: string;
  fileUrl: string;
  coverImageFileUrl: string;
  // optional fields returned by the API
  originalUrl?: string | null;
  sourceName?: string | null;
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
  sourceName?: string;
  originalUrl?: string;
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


export interface VideoRuSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
