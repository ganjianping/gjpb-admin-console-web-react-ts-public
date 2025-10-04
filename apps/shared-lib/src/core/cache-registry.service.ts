// Cache Service Interface - provides abstraction for different cache implementations
// This allows microfrontends to register their cache providers without creating circular dependencies

export interface CacheProvider {
  clearCache(): void;
  getCacheKey(): string;
}

export interface DashboardDataProvider {
  getDashboardStats(): Promise<any>;
  getRecentActivity(): Promise<any>;
}

class CacheManagerService {
  private static providers: CacheProvider[] = [];
  private static dashboardProviders: DashboardDataProvider[] = [];

  /**
   * Register a cache provider (allows microfrontends to register their caches)
   */
  public static registerCacheProvider(provider: CacheProvider): void {
    this.providers.push(provider);
  }

  /**
   * Register a dashboard data provider
   */
  public static registerDashboardProvider(provider: DashboardDataProvider): void {
    this.dashboardProviders.push(provider);
  }

  /**
   * Clear all registered caches
   */
  public static clearAllCaches(): void {
    console.log('🗑️ Clearing all registered caches...');
    this.providers.forEach(provider => {
      try {
        provider.clearCache();
        console.log(`✅ Cleared cache: ${provider.getCacheKey()}`);
      } catch (error) {
        console.error(`❌ Failed to clear cache: ${provider.getCacheKey()}`, error);
      }
    });
  }

  /**
   * Get dashboard stats from all registered providers
   */
  public static async getDashboardStats(): Promise<any> {
    const results = await Promise.allSettled(
      this.dashboardProviders.map(provider => provider.getDashboardStats())
    );
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);
  }

  /**
   * Get recent activity from all registered providers
   */
  public static async getRecentActivity(): Promise<any[]> {
    const results = await Promise.allSettled(
      this.dashboardProviders.map(provider => provider.getRecentActivity())
    );
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value)
      .flat();
  }
}

export default CacheManagerService;
