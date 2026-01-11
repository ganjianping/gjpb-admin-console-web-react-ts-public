// ImageRu Service - handles imageRu management API calls
import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type { ApiResponse } from "../../../../shared-lib/src/api/api.types";
import type { ImageRu, ImageRuPaginatedResponse } from "../types/imageRu.types";

// Query parameters for imageRu search
export interface ImageRuQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

// Create imageRu request by originalUrl
export interface CreateImageRequest {
  name: string;
  originalUrl: string;
  sourceName: string;
  filename?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Create imageRu request by file upload
export interface CreateImageRuByUploadRequest {
  file: File;
  name: string;
  sourceName: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Update imageRu request
export interface UpdateImageRequest {
  name?: string;
  originalUrl?: string | null;
  filename?: string;
  thumbnailFilename?: string;
  extension?: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  altText?: string;
  sourceName?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class ImageRuService {
  private readonly getUrl = "/v1/image-rus";
  private readonly crudUrl = "/v1/image-rus";

  /**
   * Get all imageRus (no pagination based on API response)
   */
  async getImageRus(params?: ImageRuQueryParams): Promise<ApiResponse<ImageRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  /**
   * Create imageRu by originalUrl
   */
  async createImageRu(data: CreateImageRequest): Promise<ApiResponse<ImageRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  /**
   * Create imageRu by file upload
   */
  async createImageRuByUpload(data: CreateImageRuByUploadRequest): Promise<ApiResponse<ImageRu>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    formData.append('sourceName', data.sourceName);
    formData.append('tags', data.tags);
    formData.append('lang', data.lang);
    if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    // Use dedicated upload endpoint for file uploads
    // apiClient.post will set multipart Content-Type automatically when data is FormData
    return apiClient.post(`${this.crudUrl}`, formData);
  }

  /**
   * Update image
   */
  async updateImageRu(id: string, data: UpdateImageRequest): Promise<ApiResponse<ImageRu>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  /**
   * Delete image
   */
  async deleteImageRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const imageRuService = new ImageRuService();
