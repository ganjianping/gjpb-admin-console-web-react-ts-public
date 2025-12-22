// File Service - handles file management API calls
import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type { ApiResponse } from "../../../../shared-lib/src/api/api.types";
import type { CmsFile, FilePaginatedResponse } from "../types/file.types";

// Query parameters for file search
export interface FileQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}

// Create file request by originalUrl
export interface CreateFileRequest {
  name: string;
  originalUrl: string;
  sourceName: string;
  filename?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Create file request by file upload
export interface CreateFileByUploadRequest {
  file: File;
  name: string;
  sourceName: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Update file request
export interface UpdateFileRequest {
  name?: string;
  originalUrl?: string | null;
  filename?: string;
  extension?: string;
  mimeType?: string;
  sizeBytes?: number;
  sourceName?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class FileService {
  private readonly getUrl = "/v1/files";
  private readonly crudUrl = "/v1/files";

  /**
   * Get all files (supports pagination)
   */
  async getFiles(params?: FileQueryParams): Promise<ApiResponse<FilePaginatedResponse | CmsFile[]>> {
    return apiClient.get(this.getUrl, { params });
  }

  /**
   * Create file by originalUrl
   */
  async createFile(data: CreateFileRequest): Promise<ApiResponse<CmsFile>> {
    return apiClient.post(this.crudUrl, data);
  }

  /**
   * Create file by file upload
   */
  async createFileByUpload(data: CreateFileByUploadRequest): Promise<ApiResponse<CmsFile>> {
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
   * Update file
   */
  async updateFile(id: string, data: UpdateFileRequest): Promise<ApiResponse<CmsFile>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  /**
   * Delete file
   */
  async deleteFile(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const fileService = new FileService();
