// Website Service - handles website management API calls
import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
} from "../../../../shared-lib/src/api/api.types";
import type { Website } from "../types/website.types";

// Query parameters for website search
export interface WebsiteQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

// Create website request
export interface CreateWebsiteRequest {
  name: string;
  url: string;
  logoUrl: string;
  description: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Update website request
export interface UpdateWebsiteRequest {
  name?: string;
  url?: string;
  logoUrl?: string;
  description?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class WebsiteService {
  private readonly baseUrl = "/v1/websites";

  /**
   * Get all websites with pagination and search
   */
  async getWebsites(
    params?: WebsiteQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<Website>>> {
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

    return apiClient.get<PaginatedResponse<Website>>(url);
  }

  /**
   * Get a specific website by ID
   */
  async getWebsite(id: string): Promise<ApiResponse<Website>> {
    return apiClient.get<Website>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new website
   */
  async createWebsite(
    data: CreateWebsiteRequest,
  ): Promise<ApiResponse<Website>> {
    return apiClient.post<Website>(this.baseUrl, data);
  }

  /**
   * Update an existing website
   */
  async updateWebsite(
    id: string,
    data: UpdateWebsiteRequest,
  ): Promise<ApiResponse<Website>> {
    return apiClient.put<Website>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete a website
   */
  async deleteWebsite(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const websiteService = new WebsiteService();
export default websiteService;
