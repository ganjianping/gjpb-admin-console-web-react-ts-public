// Image interface based on API response
export interface Image {
  id: string;
  name: string;
  originalUrl: string;
  sourceName: string;
  filename: string;
  thumbnailFilename: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  altText: string;
  tags: string;
  lang: string;
  displayOrder: number;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ImagePaginatedResponse {
  content: Image[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Search form data interface
export interface ImageSearchFormData {
  name: string;
  lang: string;
  tags: string;
  isActive: string; // '', 'true', 'false'
}

// Form data for create/edit image
export interface ImageFormData {
  name: string;
  originalUrl: string;
  sourceName: string;
  filename: string;
  thumbnailFilename: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  altText: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  uploadMethod: 'url' | 'file'; // 'url' for originalUrl, 'file' for upload
  file?: File | null;
}

// Dialog action types
export type ImageActionType = 'view' | 'edit' | 'create' | 'delete' | null;
