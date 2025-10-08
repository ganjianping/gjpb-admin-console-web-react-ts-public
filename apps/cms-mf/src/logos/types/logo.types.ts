// Logo interface based on API response
export interface Logo {
  id: string;
  name: string;
  originalUrl: string | null;
  filename: string;
  extension: string;
  logoUrl: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  tagsArray: string[];
}

// Search form data interface
export interface LogoSearchFormData {
  name: string;
  lang: string;
  tags: string;
  isActive: string; // '', 'true', 'false'
}

// Form data for create/edit logo
export interface LogoFormData {
  name: string;
  originalUrl: string;
  filename: string;
  extension: string;
  logoUrl: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

// Dialog action types
export type LogoActionType = 'view' | 'edit' | 'create' | 'delete' | null;
