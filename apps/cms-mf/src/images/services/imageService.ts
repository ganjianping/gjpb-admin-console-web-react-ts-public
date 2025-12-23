// Image Service - handles image management API calls
import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type { ApiResponse } from "../../../../shared-lib/src/api/api.types";
import type { Image, ImagePaginatedResponse } from "../types/image.types";

// Query parameters for image search
export interface ImageQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

// Create image request by originalUrl
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

// Create image request by file upload
export interface CreateImageByUploadRequest {
  file: File;
  name: string;
  sourceName: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Update image request
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

class ImageService {
  private readonly getUrl = "/v1/images";
  private readonly crudUrl = "/v1/images";

  /**
   * Get all images (no pagination based on API response)
   */
  async getImages(params?: ImageQueryParams): Promise<ApiResponse<ImagePaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }

  /**
   * Create image by originalUrl
   */
  async createImage(data: CreateImageRequest): Promise<ApiResponse<Image>> {
    return apiClient.post(this.crudUrl, data);
  }

  /**
   * Create image by file upload
   */
  async createImageByUpload(data: CreateImageByUploadRequest): Promise<ApiResponse<Image>> {
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
  async updateImage(id: string, data: UpdateImageRequest): Promise<ApiResponse<Image>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  /**
   * Delete image
   */
  async deleteImage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const imageService = new ImageService();
