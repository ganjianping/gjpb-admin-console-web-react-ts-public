import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { APP_ENV, APP_CONFIG } from '../utils/config';
import { getCookie, setCookie, removeCookie } from '../utils/cookie';

// Response type definition
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  status: {
    code: number;
    message: string;
    errors: null | Record<string, string[]>;
  };
  data: T;
  meta: {
    serverDateTime: string;
    requestId: string;
    sessionId: string;
  };
}

// Error type definition
export class ApiError extends Error {
  public code: number;
  public errors?: Record<string, string[]> | null;
  public requestId?: string;

  constructor(message: string, code: number, errors?: Record<string, string[]> | null, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.errors = errors;
    this.requestId = requestId;
  }
}

class HttpClient {
  private readonly instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = getCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY);
        const tokenType = getCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY) ?? 'Bearer';
        
        if (accessToken) {
          config.headers.Authorization = `${tokenType} ${accessToken}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async (error: AxiosError<ApiResponse>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const originalRequest = error.config as any;

        // Handle token expiration (401 error)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== APP_CONFIG.AUTH.LOGIN_URL
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = getCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY);
            
            if (!refreshToken) {
              this.handleAuthError();
              return Promise.reject(error);
            }

            const response = await this.instance.put<ApiResponse<{
              accessToken: string;
              refreshToken: string;
              tokenType: string;
              expiresIn: number;
            }>>(
              APP_CONFIG.AUTH.REFRESH_TOKEN_URL,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken, tokenType, expiresIn } = response.data.data;

            // Store new tokens with explicit SameSite protection
            setCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY, accessToken, expiresIn, '/', import.meta.env.PROD, 'Lax');
            setCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY, newRefreshToken, undefined, '/', import.meta.env.PROD, 'Lax');
            setCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY, tokenType, undefined, '/', import.meta.env.PROD, 'Lax');

            // Update authorization header
            originalRequest.headers.Authorization = `${tokenType} ${accessToken}`;

            // Resolve all waiting requests
            this.refreshSubscribers.forEach((cb) => cb(accessToken));
            this.refreshSubscribers = [];
            
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(new Error(refreshError instanceof Error ? refreshError.message : 'Token refresh failed'));
          } finally {
            this.isRefreshing = false;
          }
        }

        // Transform error response
        if (error.response?.data) {
          const { status, meta } = error.response.data;
          throw new ApiError(
            status.message || error.message,
            status.code || error.response.status,
            status.errors,
            meta?.requestId
          );
        }

        if (error.response?.status === 403) {
          window.location.href = APP_CONFIG.ROUTES.UNAUTHORIZED;
        }

        return Promise.reject(error);
      }
    );
  }

  private handleAuthError(): void {
    // Clear auth tokens
    removeCookie(APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY);
    removeCookie(APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY);
    removeCookie(APP_CONFIG.TOKEN.TOKEN_TYPE_KEY);
    
    // Redirect to login
    window.location.href = APP_CONFIG.ROUTES.LOGIN;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.instance.get<any, ApiResponse<T>>(url, { params });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.instance.post<any, ApiResponse<T>>(url, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.instance.put<any, ApiResponse<T>>(url, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.instance.patch<any, ApiResponse<T>>(url, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public delete<T = any>(url: string): Promise<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.instance.delete<any, ApiResponse<T>>(url);
  }
}

// Create and export the API client instance
export const apiClient = new HttpClient(APP_ENV.VITE_API_BASE_URL);

export default apiClient;
