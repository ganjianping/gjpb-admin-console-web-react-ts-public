// App Settings Service - handles app settings management API calls
import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { 
  ApiResponse, 
  PaginatedResponse
} from '../../../../shared-lib/src/api/api.types';
import type { AppSetting } from '../types/app-setting.types';

// Query parameters for app settings search
export interface AppSettingQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  name?: string;
  lang?: string;
  isSystem?: boolean;
  isPublic?: boolean;
}

// Create app setting request
export interface CreateAppSettingRequest {
  name: string;
  value: string;
  lang: string;
  isSystem?: boolean;
  isPublic?: boolean;
}

// Update app setting request
export interface UpdateAppSettingRequest {
  name?: string;
  value?: string;
  lang?: string;
  isSystem?: boolean;
  isPublic?: boolean;
}

class AppSettingService {
  private readonly baseUrl = '/v1/app-settings';

  /**
   * Get all app settings with pagination and search
   */
  async getAppSettings(params?: AppSettingQueryParams): Promise<ApiResponse<PaginatedResponse<AppSetting>>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const url = searchParams.toString() 
      ? `${this.baseUrl}?${searchParams}` 
      : this.baseUrl;

    return apiClient.get<PaginatedResponse<AppSetting>>(url);
  }

  /**
   * Get a specific app setting by ID
   */
  async getAppSetting(id: string): Promise<ApiResponse<AppSetting>> {
    return apiClient.get<AppSetting>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new app setting
   */
  async createAppSetting(data: CreateAppSettingRequest): Promise<ApiResponse<AppSetting>> {
    return apiClient.post<AppSetting>(this.baseUrl, data);
  }

  /**
   * Update an existing app setting
   */
  async updateAppSetting(id: string, data: UpdateAppSettingRequest): Promise<ApiResponse<AppSetting>> {
    return apiClient.put<AppSetting>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete an app setting
   */
  async deleteAppSetting(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const appSettingService = new AppSettingService();
export default appSettingService;
