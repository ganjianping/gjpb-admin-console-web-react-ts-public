// CMS File interface based on `/v1/files` API response
export interface CmsFile {
  id: string;
  name: string;
  originalUrl: string | null;
  sourceName: string | null;
  filename: string;
  extension: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  tags: string;
  lang: string;
  displayOrder: number;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Search form data interface
export interface FileSearchFormData {
  name: string;
  lang: string;
  tags: string;
  isActive: string; // '', 'true', 'false'
}

// Form data for create/edit file
export interface FileFormData {
  name: string;
  originalUrl: string;
  sourceName: string;
  filename: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  uploadMethod: 'url' | 'file'; // 'url' for originalUrl, 'file' for upload
  file?: File | null;
}

// Dialog action types
export type FileActionType = 'view' | 'edit' | 'create' | 'delete' | null;
