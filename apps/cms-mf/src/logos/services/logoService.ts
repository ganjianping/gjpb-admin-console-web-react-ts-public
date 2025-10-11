// Logo Service - handles logo management API calls
import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type {
  ApiResponse,
} from "../../../../shared-lib/src/api/api.types";
import type { Logo } from "../types/logo.types";

// Query parameters for logo search
export interface LogoQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

// Create logo request by originalUrl
export interface CreateLogoRequest {
  name: string;
  originalUrl: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Create logo request by file upload
export interface CreateLogoByUploadRequest {
  file: File;
  name: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Update logo request
export interface UpdateLogoRequest {
  name?: string;
  originalUrl?: string | null;
  filename?: string;
  extension?: string;
  logoUrl?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class LogoService {
  private readonly getUrl = "/v1/logos/search";
  private readonly crudUrl = "/v1/logos";

  /**
   * Get all logos (no pagination based on API response)
   */
  async getLogos(
    params?: LogoQueryParams,
  ): Promise<ApiResponse<Logo[]>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    const url = searchParams.toString()
      ? `${this.getUrl}?${searchParams}`
      : this.getUrl;

    return apiClient.get<Logo[]>(url);
  }

  /**
   * Get a specific logo by ID
   */
  async getLogo(id: string): Promise<ApiResponse<Logo>> {
    return apiClient.get<Logo>(`${this.crudUrl}/${id}`);
  }

  /**
   * Create a new logo by originalUrl
   */
  async createLogo(
    data: CreateLogoRequest,
  ): Promise<ApiResponse<Logo>> {
    return apiClient.post<Logo>(this.crudUrl, data);
  }

  /**
   * Create a new logo by uploading a file
   */
  async createLogoByUpload(
    data: CreateLogoByUploadRequest,
  ): Promise<ApiResponse<Logo>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    formData.append('tags', data.tags);
    formData.append('lang', data.lang);
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }

    // Note: FormData automatically sets the correct Content-Type with boundary
    return apiClient.post<Logo>(`${this.crudUrl}/upload`, formData);
  }

  /**
   * Update an existing logo
   */
  async updateLogo(
    id: string,
    data: UpdateLogoRequest,
  ): Promise<ApiResponse<Logo>> {
    return apiClient.put<Logo>(`${this.crudUrl}/${id}`, data);
  }

  /**
   * Delete a logo
   */
  async deleteLogo(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.crudUrl}/${id}`);
  }
}

export const logoService = new LogoService();
