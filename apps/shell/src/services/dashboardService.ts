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
   * Get dashboard statistics - now returns static data instead of API call
   */
  async getDashboardStats(): Promise<DashboardResponse> {
    try {
      apiCallCounter++;
      console.log(`� Returning static dashboard data (No API call made) - Call #${apiCallCounter}`);
      
      // Return static mock data instead of making API call
      const mockResponse: DashboardResponse = {
        status: {
          code: 200,
          message: 'Success',
          errors: null
        },
        data: {
          totalUsers: 150,
          activeSessions: 23,
          activeUsers: 142,
          lockedUsers: 3,
          suspendedUsers: 2,
          pendingVerificationUsers: 3
        },
        meta: {
          serverDateTime: new Date().toISOString(),
          requestId: 'mock-request-' + Date.now(),
          sessionId: 'mock-session-' + Date.now()
        }
      };
      
      console.log('📊 Static dashboard data:', mockResponse.data);
      return mockResponse;
    } catch (error) {
      console.error('💥 Error returning dashboard stats:', error);
      throw error;
    }
  },
};

export default dashboardService;
