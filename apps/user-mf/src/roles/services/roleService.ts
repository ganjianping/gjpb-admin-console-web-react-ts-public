// Role Service - handles role management API calls based on API spec
import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse, PaginatedResponse } from '../../../../shared-lib/src/api/api.types';

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

// Query parameters for role search
export interface RoleQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  code?: string;
  name?: string;
  active?: boolean;
  systemRole?: boolean;
}

// Create role request
export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  sortOrder?: number;
  level?: number;
  parentRoleId?: string;
  active?: boolean;
}

// Update role request (for PATCH/PUT)
export interface UpdateRoleRequest {
  code?: string;
  name?: string;
  description?: string;
  sortOrder?: number;
  level?: number;
  parentRoleId?: string;
  active?: boolean;
}

// Response type for paginated roles - use shared interface
export type PaginatedRoleResponse = PaginatedResponse<Role>;

class RoleService {
  private readonly baseUrl = '/v1/roles';

  /**
   * Get all roles with pagination support
   */
  async getRoles(params?: RoleQueryParams): Promise<ApiResponse<Role[]>> {
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

    return apiClient.get<Role[]>(url);
  }

  /**
   * Get paginated roles (if API supports pagination response)
   */
  async getRolesPaginated(params?: RoleQueryParams): Promise<ApiResponse<PaginatedRoleResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const url = searchParams.toString() 
      ? `${this.baseUrl}/paginated?${searchParams}` 
      : `${this.baseUrl}/paginated`;

    return apiClient.get<PaginatedRoleResponse>(url);
  }

  /**
   * Get a specific role by ID
   */
  async getRole(roleId: string): Promise<ApiResponse<Role>> {
    return apiClient.get<Role>(`${this.baseUrl}/${roleId}`);
  }

  /**
   * Create a new role
   */
  async createRole(roleData: CreateRoleRequest): Promise<ApiResponse<Role>> {
    return apiClient.post<Role>(this.baseUrl, roleData);
  }

  /**
   * Update role (full update with PUT)
   */
  async updateRole(roleId: string, roleData: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    return apiClient.put<Role>(`${this.baseUrl}/${roleId}`, roleData);
  }

  /**
   * Update role (partial update with PATCH)
   */
  async patchRole(roleId: string, roleData: Partial<UpdateRoleRequest>): Promise<ApiResponse<Role>> {
    return apiClient.patch<Role>(`${this.baseUrl}/${roleId}`, roleData);
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`${this.baseUrl}/${roleId}`);
  }

  /**
   * Helper method to get active roles
   */
  async getActiveRoles(): Promise<ApiResponse<Role[]>> {
    return this.getRoles({
      active: true,
    });
  }

  /**
   * Helper method to search roles
   */
  async searchRoles(query: string): Promise<ApiResponse<Role[]>> {
    return this.getRoles({
      name: query,
    });
  }
}

export const roleService = new RoleService();
