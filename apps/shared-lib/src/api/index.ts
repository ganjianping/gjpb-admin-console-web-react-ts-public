/**
 * API Feature
 * 
 * Provides API client services, authentication, and mock API functionality.
 */

// API services
export * from './api-client';
export * from './auth-service';
export * from './mock-api-service';

// API types (explicit re-export to avoid ApiResponse conflict)
export type { 
  PaginatedResponse,
  PaginationParams
} from './api.types';