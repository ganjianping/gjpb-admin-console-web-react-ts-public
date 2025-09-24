import dashboardService from '../../../shell/src/services/dashboardService';
import type { DashboardStats } from '../../../shell/src/services/dashboardService';

// Cache keys for localStorage
const DASHBOARD_CACHE_KEY = 'dashboard_stats_cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

class DashboardCacheService {
  /**
   * Clear dashboard stats cache
   */
  public clearDashboardCache(): void {
    try {
      localStorage.removeItem(DASHBOARD_CACHE_KEY);
      console.log('🗑️ Dashboard cache cleared');
    } catch (error) {
      console.error('❌ Error clearing dashboard cache:', error);
    }
  }

  /**
   * Get cached dashboard stats
   */
  private getCachedDashboardStats(): DashboardStats | null {
    try {
      const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const now = new Date().getTime();
        if (now - parsedCache.timestamp < CACHE_EXPIRY_MS) {
          console.log('📦 Using cached dashboard stats');
          return parsedCache.data.stats;
        } else {
          console.log('⏰ Dashboard cache expired, removing old data');
          localStorage.removeItem(DASHBOARD_CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('❌ Error reading dashboard cache:', error);
      localStorage.removeItem(DASHBOARD_CACHE_KEY);
    }
    return null;
  }

  /**
   * Set cached dashboard stats
   */
  private setCachedDashboardStats(data: DashboardStats): void {
    try {
      const cacheData = {
        data: {
          stats: data,
          lastUpdated: new Date().toISOString(),
        },
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Dashboard stats cached successfully');
    } catch (error) {
      console.error('❌ Error caching dashboard stats:', error);
    }
  }

  /**
   * Fetch and cache dashboard stats
   */
  public async fetchAndCacheDashboardStats(forceRefresh = false): Promise<DashboardStats | null> {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = this.getCachedDashboardStats();
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      console.log('🔄 Fetching dashboard stats...', forceRefresh ? '(forced refresh)' : '');
      
      const apiResponse = await dashboardService.getDashboardStats();
      
      if (apiResponse?.status?.code === 200 && apiResponse.data) {
        console.log('📊 Dashboard stats fetched successfully');
        this.setCachedDashboardStats(apiResponse.data);
        return apiResponse.data;
      } else {
        console.error('❌ API error - status code:', apiResponse?.status?.code);
        return null;
      }
    } catch (error: any) {
      console.error('💥 Error fetching dashboard stats:', error);
      return null;
    }
  }

  /**
   * Refresh dashboard data after login
   */
  public async refreshDashboardAfterLogin(): Promise<{
    dashboardStats: DashboardStats | null;
  }> {
    console.log('�� Login detected, refreshing dashboard data');
    
    // Clear existing cache to ensure fresh data
    this.clearDashboardCache();
    
    // Fetch fresh dashboard data
    const dashboardStats = await this.fetchAndCacheDashboardStats(true);
    
    console.log('✅ Dashboard refresh complete after login');
    
    return {
      dashboardStats
    };
  }

  /**
   * Get cached data without fetching (for immediate use)
   */
  public getCachedData(): {
    dashboardStats: DashboardStats | null;
  } {
    return {
      dashboardStats: this.getCachedDashboardStats()
    };
  }
}

// Export singleton instance
export const dashboardCacheService = new DashboardCacheService();
export default dashboardCacheService;
