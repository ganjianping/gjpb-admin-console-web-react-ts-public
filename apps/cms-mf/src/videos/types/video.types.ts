
export interface Video {
  id: string;
  name: string;
  filename: string;
  sizeBytes: number;
  coverImageFilename: string;
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


export type VideoActionType = 'create' | 'edit' | 'view';


export interface VideoFormData {
  name: string;
  filename: string;
  coverImageFilename: string;
  description: string;
  sizeBytes: number;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  uploadMethod: 'file';
  file: File | null;
}


export interface VideoSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: string | null;
}
