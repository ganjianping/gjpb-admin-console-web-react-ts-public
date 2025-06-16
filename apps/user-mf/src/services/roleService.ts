// Role Service - handles role management API calls
import { apiClient } from '../../../shared-lib/src/services/api-client';
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: 'active' | 'inactive';
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFilters {
  status?: 'active' | 'inactive';
  search?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
  status?: 'active' | 'inactive';
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  status?: 'active' | 'inactive';
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

class RoleService {
  private readonly baseUrl = '/api/roles';

  async getRoles(filters?: RoleFilters): Promise<Role[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
    const response = await apiClient.get<Role[]>(url, { params: Object.fromEntries(params) });
    return response.data;
  }

  async getRoleById(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createRole(roleData: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post<Role>(this.baseUrl, roleData);
    return response.data;
  }

  async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.patch<Role>(`${this.baseUrl}/${id}`, roleData);
    return response.data;
  }

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>('/api/permissions');
    return response.data;
  }

  async exportRoles(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await apiClient.get<Blob>(`${this.baseUrl}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }
}

export const roleService = new RoleService();
