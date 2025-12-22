import { apiClient } from "../../../../shared-lib/src/api/api-client";
import type { ApiResponse } from "../../../../shared-lib/src/api/api.types";
import type { Audio, AudioPaginatedResponse } from "../types/audio.types";

export interface AudioQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  name?: string;
  lang?: string;
  tags?: string;
  isActive?: boolean;
}


export interface CreateAudioRequest {
  name: string;
  filename: string;
  coverImageFilename: string;
  artist?: string;
  subtitle?: string;
  sourceName?: string;
  originalUrl?: string;
  description?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}


export interface CreateAudioByUploadRequest {
  file: File;
  name: string;
  filename: string;
  coverImageFilename: string;
  artist?: string;
  subtitle?: string;
  sourceName?: string;
  originalUrl?: string;
  description?: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
  coverImageFile?: File;
}


export interface UpdateAudioRequest {
  artist?: string;
  name?: string;
  filename?: string;
  coverImageFilename?: string;
  subtitle?: string;
  sourceName?: string;
  originalUrl?: string;
  description?: string;
  sizeBytes?: number;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
}

class AudioService {
  private readonly getUrl = "/v1/audios";
  private readonly crudUrl = "/v1/audios";

  async getAudios(params?: AudioQueryParams): Promise<ApiResponse<AudioPaginatedResponse>> {
    return apiClient.get(this.getUrl, { params });
  }


  async createAudio(data: CreateAudioRequest): Promise<ApiResponse<Audio>> {
    return apiClient.post(this.crudUrl, data);
  }

  async createAudioByUpload(data: CreateAudioByUploadRequest): Promise<ApiResponse<Audio>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    formData.append('filename', data.filename);
    formData.append('coverImageFilename', data.coverImageFilename);
    if ((data as any).subtitle) {
      formData.append('subtitle', (data as any).subtitle);
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
    if ((data as any).artist) {
      formData.append('artist', (data as any).artist);
    }
    formData.append('tags', data.tags);
    if ((data as any).subtitle) {
      formData.append('subtitle', (data as any).subtitle);
    }
    formData.append('lang', data.lang);
    if (data.displayOrder !== undefined) {
      formData.append('displayOrder', String(data.displayOrder));
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    return apiClient.post(`${this.crudUrl}`, formData);
  }

  async updateAudio(id: string, data: UpdateAudioRequest): Promise<ApiResponse<Audio>> {
    // Ensure we don't send client-only fields like sizeBytes or uploadMethod in the update payload
    const payload: any = { ...data };
    if (payload.sizeBytes !== undefined) delete payload.sizeBytes;
    if (payload.uploadMethod !== undefined) delete payload.uploadMethod;
    if (payload.file !== undefined) delete payload.file;
    return apiClient.put(`${this.crudUrl}/${id}`, payload);
  }

  async updateAudioWithFiles(id: string, data: UpdateAudioRequest & { file?: File | null; coverImageFile?: File | null }): Promise<ApiResponse<Audio>> {
    const formData = new FormData();
    // Do not allow changing the primary audio file via Edit — only allow cover image updates here.
    if ((data as any).coverImageFile) {
      formData.append('coverImageFile', (data as any).coverImageFile as File);
    }
    if (data.name) {
      formData.append('name', data.name);
    }
    if ((data as any).subtitle) {
      formData.append('subtitle', (data as any).subtitle);
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
    if ((data as any).artist) {
      formData.append('artist', (data as any).artist);
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

  async deleteAudio(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}`);
  }
}

export const audioService = new AudioService();
