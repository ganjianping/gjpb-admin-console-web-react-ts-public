// Website interface based on API response
export interface Website {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  description: string;
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
export interface WebsiteSearchFormData {
  name: string;
  lang: string;
  tags: string;
  isActive: string; // '', 'true', 'false'
}

// Form data for create/edit website
export interface WebsiteFormData {
  name: string;
  url: string;
  logoUrl: string;
  description: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

// Dialog action types
export type WebsiteActionType = 'view' | 'edit' | 'create' | 'delete' | null;
