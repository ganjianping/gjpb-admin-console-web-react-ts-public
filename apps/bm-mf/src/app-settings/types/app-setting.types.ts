// App Setting interface based on API response
export interface AppSetting {
  id: string;
  name: string;
  value: string;
  lang: string;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

// Search form data interface
export interface AppSettingSearchFormData {
  name: string;
  lang: string;
  isSystem: string; // '', 'true', 'false'
  isPublic: string; // '', 'true', 'false'
}

// Form data for create/edit app setting
export interface AppSettingFormData {
  name: string;
  value: string;
  lang: string;
  isSystem: boolean;
  isPublic: boolean;
}

// Dialog action types
export type AppSettingActionType = 'view' | 'edit' | 'create' | 'delete' | null;
