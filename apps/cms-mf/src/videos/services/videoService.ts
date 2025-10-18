import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type { ApiResponse } from "../../../../shared-lib/src/api/api.types";
import type { Video } from "../types/video.types";

export interface VideoQueryParams {
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
  description?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}


export interface CreateVideoByUploadRequest {
  file: File;
  name: string;
  filename: string;
  coverImageFilename: string;
  description?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
  coverImageFile?: File;
}


export interface UpdateVideoRequest {
  name?: string;
  filename?: string;
  coverImageFilename?: string;
  description?: string;
  sizeBytes?: number;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class VideoService {
  private readonly getUrl = "/v1/videos/search";
  private readonly crudUrl = "/v1/videos";

  async getVideos(params?: VideoQueryParams): Promise<ApiResponse<Video[]>> {
    return apiClient.get(this.getUrl, { params });
  }


  async createVideo(data: CreateVideoRequest): Promise<ApiResponse<Video>> {
    return apiClient.post(this.crudUrl, data);
  }

  async createVideoByUpload(data: CreateVideoByUploadRequest): Promise<ApiResponse<Video>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    formData.append('filename', data.filename);
    formData.append('coverImageFilename', data.coverImageFilename);
    // If a cover image file is provided, append it as 'coverImageFile'
    // Some backends expect both filename and file field.
    if ((data as any).coverImageFile) {
      formData.append('coverImageFile', (data as any).coverImageFile);
    }
    if (data.description) formData.append('description', data.description);
    formData.append('tags', data.tags);
    formData.append('lang', data.lang);
    if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    return apiClient.post(`${this.crudUrl}/upload`, formData);
  }

  async updateVideo(id: string, data: UpdateVideoRequest): Promise<ApiResponse<Video>> {
    return apiClient.put(`${this.crudUrl}/${id}`, data);
  }

  async deleteVideo(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const videoService = new VideoService();
