// Profile Service - handles profile management API calls
import { apiClient } from '../../../../shared-lib/src/services/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/types/api.types';

// Profile update request interface
export interface UpdateProfileRequest {
  nickname?: string;
  email?: string;
  mobileCountryCode?: string;
  mobileNumber?: string;
}

// Profile response interface (subset of User with profile-relevant fields)
export interface ProfileResponse {
  id: string;
  username: string;
  nickname: string | null;
  email: string | null;
  mobileCountryCode: string | null;
  mobileNumber: string | null;
  accountStatus: string;
  active: boolean;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  updatedAt: string;
}

// Password change request interface
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  private readonly baseUrl = '/v1/profile';

  /**
   * Update user profile information
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> {
    return apiClient.put<ProfileResponse>(this.baseUrl, profileData);
  }

  /**
   * Change user password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`${this.baseUrl}/password`, passwordData);
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    return apiClient.get<ProfileResponse>(this.baseUrl);
  }
}

export const profileService = new ProfileService();