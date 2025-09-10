import dashboardService from '../../../shell/src/services/dashboardService';
import auditLogService from '../../../user-mf/src/audit-logs/services/auditLogService';
import type { DashboardStats } from '../../../shell/src/services/dashboardService';
import type { AuditLogEntry } from '../../../user-mf/src/audit-logs/services/auditLogService';

// Interface for recent activity item
interface RecentLoginActivityItem {
  id: string;
  action: string;
  user: string;
  date: Date;
  endpoint?: string;
  result?: 'SUCCESS' | 'ERROR';
  httpMethod?: string;
}

// Cache keys for localStorage
const DASHBOARD_CACHE_KEY = 'dashboard_stats_cache';
const RECENT_ACTIVITY_CACHE_KEY = 'recent_activity_cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

class DashboardCacheService {
  /**
   * Clear all dashboard-related caches
   */
  public clearAllDashboardCaches(): void {
    try {
      localStorage.removeItem(DASHBOARD_CACHE_KEY);
      localStorage.removeItem(RECENT_ACTIVITY_CACHE_KEY);
      console.log('🗑️ All dashboard caches cleared');
    } catch (error) {
      console.error('❌ Error clearing dashboard caches:', error);
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
   * Get cached recent activity
   */
  private getCachedRecentActivity(): RecentLoginActivityItem[] | null {
    try {
      const cached = localStorage.getItem(RECENT_ACTIVITY_CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        console.log('📦 Using cached recent activity data');
        return parsedCache.data;
      }
    } catch (error) {
      console.error('❌ Error reading recent activity cache:', error);
      localStorage.removeItem(RECENT_ACTIVITY_CACHE_KEY);
    }
    return null;
  }

  /**
   * Set cached recent activity
   */
  private setCachedRecentActivity(data: RecentLoginActivityItem[], username?: string): void {
    try {
      const cacheData = {
        data,
        timestamp: new Date().getTime(),
        username: username, // Track which user's data this is
      };
      localStorage.setItem(RECENT_ACTIVITY_CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Recent activity cached successfully for user:', username);
    } catch (error) {
      console.error('❌ Error caching recent activity:', error);
    }
  }

  /**
   * Helper function to get action description from audit log entry
   */
  private getActionDescription(entry: AuditLogEntry): string {
    const method = entry.httpMethod?.toUpperCase() || '';
    const endpoint = entry.endpoint || '';
    
    return this.getActionByEndpoint(endpoint, method);
  }

  /**
   * Get action description based on endpoint and method
   */
  private getActionByEndpoint(endpoint: string, method: string): string {
    if (endpoint.includes('/auth/tokens')) return this.getAuthTokenAction(method);
    if (endpoint.includes('/auth/login')) return 'User Login';
    if (endpoint.includes('/auth/logout')) return 'User Logout';
    if (endpoint.includes('/users')) return this.getUserAction(method);
    if (endpoint.includes('/password')) return 'Password Reset';
    if (endpoint.includes('/roles')) return 'Role Management';
    
    return `${method} ${endpoint}`;
  }

  /**
   * Get auth token action description
   */
  private getAuthTokenAction(method: string): string {
    if (method === 'POST') return 'Token Authentication';
    if (method === 'DELETE') return 'Token Revocation';
    return 'Token Validation';
  }

  /**
   * Get user action description
   */
  private getUserAction(method: string): string {
    if (method === 'POST') return 'User Creation';
    if (method === 'PUT') return 'User Update';
    if (method === 'DELETE') return 'User Deletion';
    return 'User Action';
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
   * Fetch and cache recent login activity
   */
  public async fetchAndCacheRecentActivity(username?: string, forceRefresh = false): Promise<RecentLoginActivityItem[]> {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedActivity = this.getCachedRecentActivity();
      if (cachedActivity) {
        return cachedActivity;
      }
    }

    try {
      console.log('🔄 Fetching recent activity from audit logs...', forceRefresh ? '(forced refresh)' : '');
      
      // Use provided username or fallback
      const currentUsername = username || 'gjpb_user_info';
      
      const response = await auditLogService.getAuditLogs({
        endpoint: '/api/v1/auth/tokens',
        username: currentUsername,
        size: 5, // Limit to 5 recent activities
        sort: 'timestamp,desc'
      });
      
      if (response.status.code === 200 && response.data?.content) {
        // Transform audit log entries to recent activity items
        const activities: RecentLoginActivityItem[] = response.data.content.map((entry: AuditLogEntry) => ({
          id: entry.id,
          action: this.getActionDescription(entry),
          user: entry.username || 'Unknown User',
          date: new Date(entry.timestamp),
          endpoint: entry.endpoint,
          result: entry.result,
          httpMethod: entry.httpMethod
        }));
        
        this.setCachedRecentActivity(activities, currentUsername);
        console.log('✅ Recent activity successfully fetched and cached:', activities.length, 'items');
        return activities;
      } else {
        console.warn('⚠️ No recent activity data found');
        return [];
      }
    } catch (error: any) {
      console.error('💥 Error fetching recent activity:', error);
      return [];
    }
  }

  /**
   * Refresh all dashboard data after login
   * This is the main function to call after successful login
   */
  public async refreshDashboardAfterLogin(username?: string): Promise<{
    dashboardStats: DashboardStats | null;
    recentActivity: RecentLoginActivityItem[];
  }> {
    console.log('🔐 Login detected, refreshing all dashboard data for user:', username);
    
    // Clear existing caches to ensure fresh data
    this.clearAllDashboardCaches();
    
    // Fetch fresh data in parallel
    const [dashboardStats, recentActivity] = await Promise.all([
      this.fetchAndCacheDashboardStats(true),
      this.fetchAndCacheRecentActivity(username, true)
    ]);
    
    console.log('✅ Dashboard refresh complete after login');
    
    return {
      dashboardStats,
      recentActivity
    };
  }

  /**
   * Get cached data without fetching (for immediate use)
   */
  public getCachedData(): {
    dashboardStats: DashboardStats | null;
    recentActivity: RecentLoginActivityItem[] | null;
  } {
    return {
      dashboardStats: this.getCachedDashboardStats(),
      recentActivity: this.getCachedRecentActivity()
    };
  }
}

// Export singleton instance
export const dashboardCacheService = new DashboardCacheService();
export default dashboardCacheService;
