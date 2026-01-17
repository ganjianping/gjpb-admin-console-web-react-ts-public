import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type { ApiResponse } from "../../../../shared-lib/src/api/api.types";
import type { VideoRu, VideoRuPaginatedResponse } from "../types/videoRu.types";

export interface VideoRuQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}


export interface CreateVideoRequest {
  name: string;
  filename: string;
  coverImageFilename: string;
  sourceName?: string;
  originalUrl?: string;
  description?: string;
  tags: string;
  lang: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
}


export interface CreateVideoRuByUploadRequest {
  file: File;
  name: string;
  filename?: string;
  coverImageFilename?: string;
  sourceName?: string;
  originalUrl?: string;
  description?: string;
  tags: string;
  lang: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
  coverImageFile?: File;
}


export interface UpdateVideoRequest {
  name?: string;
  filename?: string;
  coverImageFilename?: string;
  sourceName?: string;
  originalUrl?: string;
  description?: string;
  sizeBytes?: number;
  tags?: string;
  lang?: string;
  term?: number;
  week?: number;
  displayOrder?: number;
  isActive?: boolean;
}

class VideoRuService {
  private readonly getUrl = "/v1/video-rus";
  private readonly crudUrl = "/v1/video-rus";

  async getVideoRus(params?: VideoRuQueryParams): Promise<ApiResponse<VideoRuPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }


  async createVideoRu(data: CreateVideoRequest): Promise<ApiResponse<VideoRu>> {
    return apiClient.post(this.crudUrl, data);
  }

  async createVideoRuByUpload(data: CreateVideoRuByUploadRequest): Promise<ApiResponse<VideoRu>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    if (data.filename) {
      formData.append('filename', data.filename);
    }
    if (data.coverImageFilename) {
      formData.append('coverImageFilename', data.coverImageFilename);
    }
    // If a cover image file is provided, append it as 'coverImageFile'
    // Some backends expect both filename and file field.
    if ((data as any).coverImageFile) {
      formData.append('coverImageFile', (data as any).coverImageFile);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if ((data as any).sourceName) {
      formData.append('sourceName', (data as any).sourceName);
    }
    if ((data as any).originalUrl) {
      formData.append('originalUrl', (data as any).originalUrl);
    }
    formData.append('tags', data.tags);
    formData.append('lang', data.lang);
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    return apiClient.post(`${this.crudUrl}`, formData);
  }

  async updateVideoRu(id: string, data: UpdateVideoRequest): Promise<ApiResponse<VideoRu>> {
    // Ensure we don't send client-only fields like sizeBytes or uploadMethod in the update payload
    const payload: any = { ...data };
    if (payload.sizeBytes !== undefined) delete payload.sizeBytes;
    if (payload.uploadMethod !== undefined) delete payload.uploadMethod;
    if (payload.file !== undefined) delete payload.file;
    return apiClient.put(`${this.crudUrl}/${id}`, payload);
  }

  async updateVideoRuWithFiles(id: string, data: UpdateVideoRequest & { file?: File | null; coverImageFile?: File | null }): Promise<ApiResponse<VideoRu>> {
    const formData = new FormData();
    // Do not allow changing the primary videoRu file via Edit — only allow cover image updates here.
    if ((data as any).coverImageFile) {
      formData.append('coverImageFile', (data as any).coverImageFile as File);
    }
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.filename) {
      formData.append('filename', data.filename);
    }
    if (data.coverImageFilename) {
      formData.append('coverImageFilename', data.coverImageFilename);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if ((data as any).sourceName) {
      formData.append('sourceName', (data as any).sourceName);
    }
    if ((data as any).originalUrl) {
      formData.append('originalUrl', (data as any).originalUrl);
    }
    if (data.tags) {
      formData.append('tags', data.tags);
    }
    if (data.lang) {
      formData.append('lang', data.lang);
    }
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    // Skip client-only fields like sizeBytes and uploadMethod
    // Use PUT for update; backend should accept multipart PUT. If not, change to POST to an update-upload endpoint.
    return apiClient.put(`${this.crudUrl}/${id}`, formData);
  }

  async deleteVideoRu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const videoRuService = new VideoRuService();
