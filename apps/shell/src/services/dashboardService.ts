import { apiClient } from '../../../shared-lib/src/services/api-client';

// Counter to track API calls (for debugging)
let apiCallCounter = 0;

// Dashboard statistics interface
export interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  activeUsers: number;
  lockedUsers: number;
  suspendedUsers: number;
  pendingVerificationUsers: number;
}

// API response interface - updated to match actual API structure
export interface DashboardResponse {
  status: {
    code: number;
    message: string;
    errors: null | string[];
  };
  data: DashboardStats;
  meta?: {
    serverDateTime?: string;
    requestId?: string;
    sessionId?: string;
  };
}

// Dashboard service
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardResponse> {
    try {
      apiCallCounter++;
      console.log(`📡 Making API call to /v1/users/dashboard (Call #${apiCallCounter})`);
      const response = await apiClient.get('/v1/users/dashboard');
      
      console.log('📥 Raw API response:', response);
      console.log('📦 Response data (axios):', response.data);
      
      // The apiClient returns axios response, so we need response.data
      const apiResponse = response as DashboardResponse;
      console.log('📋 Parsed API response:', apiResponse);
      
      // Validate the essential structure (status and data fields)
      if (apiResponse?.status && typeof apiResponse.status.code === 'number' && apiResponse.data) {
        console.log('✅ API response structure is valid');
        console.log('📊 Dashboard data:', apiResponse.data);
        
        // Validate that the data contains the expected fields
        const { data } = apiResponse;
        if (typeof data.totalUsers === 'number' && 
            typeof data.activeSessions === 'number' && 
            typeof data.activeUsers === 'number') {
          console.log('✅ Dashboard data structure is valid');
          return apiResponse;
        } else {
          console.error('❌ Invalid dashboard data structure:', data);
          throw new Error('Invalid dashboard data structure from API');
        }
      } else {
        console.error('❌ Invalid API response structure:', apiResponse);
        console.error('❌ Missing status or data fields');
        throw new Error('Invalid response structure from dashboard API');
      }
    } catch (error) {
      console.error('💥 Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

export default dashboardService;
