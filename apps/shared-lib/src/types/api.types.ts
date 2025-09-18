// Shared API Response Types
// These types are used across multiple microfrontends for consistent API communication

export interface ApiResponse<T = any> {
  status: {
    code: number;
    message: string;
    errors?: any;
  };
  data: T;
  meta: {
    serverDateTime: string;
    requestId?: string;
    sessionId?: string;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// Common pagination parameters
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// Common search/filter parameters
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

// Standard success response
export interface SuccessResponse {
  success: boolean;
  message?: string;
}
