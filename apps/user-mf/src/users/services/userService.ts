// User Service - handles user management API calls based on API spec
import { apiClient } from '../../../../shared-lib/src/features/api/api-client';
import type { 
  ApiResponse, 
  PaginatedResponse
} from '../../../../shared-lib/src/features/api/api.types';

// Role interface from API spec
export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  level: number;
  parentRoleId: string | null;
  systemRole: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

// User interface from API spec
export interface User {
  id: string;
  username: string;
  nickname: string | null;
  email: string | null;
  mobileCountryCode: string | null;
  mobileNumber: string | null;
  accountStatus: AccountStatus;
  active: boolean;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  passwordChangedAt: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

// Query parameters for user search
export interface UserQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  username?: string;
  nickname?: string;
  email?: string;
  mobileCountryCode?: string;
  mobileNumber?: string;
  accountStatus?: AccountStatus;
  active?: boolean;
  roleCode?: string;
}

// Create user request
export interface CreateUserRequest {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  mobileCountryCode?: string;
  mobileNumber?: string;
  accountStatus?: AccountStatus;
  roleCodes?: string[];
  active?: boolean;
}

// Update user request (for PATCH/PUT)
export interface UpdateUserRequest {
  username?: string;
  password?: string;
  nickname?: string;
  email?: string;
  mobileCountryCode?: string;
  mobileNumber?: string;
  accountStatus?: AccountStatus;
  roleCodes?: string[];
  active?: boolean;
}

// Account status type
export type AccountStatus = 'active' | 'locked' | 'suspend' | 'pending_verification';

class UserService {
  private readonly baseUrl = '/v1/users';

  /**
   * Query users with pagination and filtering
   */
  async getUsers(params?: UserQueryParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const url = searchParams.toString() 
      ? `${this.baseUrl}?${searchParams}` 
      : this.baseUrl;

    return apiClient.get<PaginatedResponse<User>>(url);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(this.baseUrl, userData);
  }

  /**
   * Update user (full update with PUT)
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`${this.baseUrl}/${userId}`, userData);
  }

  /**
   * Update user (partial update with PATCH)
   */
  async patchUser(userId: string, userData: Partial<UpdateUserRequest>): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`${this.baseUrl}/${userId}`, userData);
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`${this.baseUrl}/${userId}`);
  }

  /**
   * Helper method to get users for a specific status
   */
  async getUsersByStatus(status: AccountStatus, page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.getUsers({
      accountStatus: status,
      page,
      size,
    });
  }

  /**
   * Helper method to search users
   */
  async searchUsers(query: string, page = 0, size = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.getUsers({
      username: query,
      page,
      size,
    });
  }
}

export const userService = new UserService();
