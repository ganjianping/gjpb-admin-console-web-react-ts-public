/**
 * Auth-MF Store Lifecycle Management
 * 
 * Utilities for managing the auth-mf store lifecycle from the shell.
 * This helps ensure proper memory management when navigating between auth and main app.
 */

interface AuthMfModule {
  destroyAuthMfStore?: () => void;
  getAuthMfStore?: () => any;
}

/**
 * Cleanup auth-mf resources when navigating away from auth flow
 * Call this when user successfully logs in or navigates away from auth pages
 */
export const cleanupAuthMfResources = async (): Promise<void> => {
  try {
    // Dynamically import auth-mf module if it's loaded
    const authMfModule = await import('../../../auth-mf/src/redux/store').catch(() => null) as AuthMfModule | null;
    
    if (authMfModule?.destroyAuthMfStore) {
      console.log('[Shell] Cleaning up auth-mf store resources');
      authMfModule.destroyAuthMfStore();
    }
  } catch (error) {
    console.warn('[Shell] Could not cleanup auth-mf resources:', error);
  }
};

/**
 * Preload auth-mf store for faster login page loading
 * Call this when you anticipate the user will need to login soon
 */
export const preloadAuthMfStore = async (): Promise<void> => {
  try {
    const authMfModule = await import('../../../auth-mf/src/redux/store').catch(() => null) as AuthMfModule | null;
    
    if (authMfModule?.getAuthMfStore) {
      console.log('[Shell] Preloading auth-mf store');
      authMfModule.getAuthMfStore();
    }
  } catch (error) {
    console.warn('[Shell] Could not preload auth-mf store:', error);
  }
};

/**
 * Hook to manage auth-mf lifecycle in shell components
 */
export const useAuthMfLifecycle = () => {
  return {
    cleanup: cleanupAuthMfResources,
    preload: preloadAuthMfStore,
  };
};
