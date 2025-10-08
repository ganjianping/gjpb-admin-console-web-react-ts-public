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

// Create logo request
export interface CreateLogoRequest {
  name: string;
  originalUrl?: string | null;
  filename: string;
  extension: string;
  logoUrl: string;
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
  private readonly baseUrl = "/v1/logos";

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
      ? `${this.baseUrl}?${searchParams}`
      : this.baseUrl;

    return apiClient.get<Logo[]>(url);
  }

  /**
   * Get a specific logo by ID
   */
  async getLogo(id: string): Promise<ApiResponse<Logo>> {
    return apiClient.get<Logo>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new logo
   */
  async createLogo(
    data: CreateLogoRequest,
  ): Promise<ApiResponse<Logo>> {
    return apiClient.post<Logo>(this.baseUrl, data);
  }

  /**
   * Update an existing logo
   */
  async updateLogo(
    id: string,
    data: UpdateLogoRequest,
  ): Promise<ApiResponse<Logo>> {
    return apiClient.put<Logo>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete a logo
   */
  async deleteLogo(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const logoService = new LogoService();
