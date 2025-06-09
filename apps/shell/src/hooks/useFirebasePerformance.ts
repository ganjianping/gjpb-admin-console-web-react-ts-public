import { useEffect } from 'react';
import { startTrace, stopTrace, setTraceAttribute } from '../utils/firebasePerformance';

/**
 * React hook for Firebase Performance page tracking
 * Automatically tracks page load time and user interactions
 */
export const useFirebasePerformance = (pageName: string, userId?: string) => {
  useEffect(() => {
    // Start page load trace
    const pageTrace = startTrace(`page_load_${pageName}`);
    
    if (pageTrace) {
      setTraceAttribute(pageTrace, 'page_name', pageName);
      if (userId) {
        setTraceAttribute(pageTrace, 'user_id', userId);
      }
      setTraceAttribute(pageTrace, 'timestamp', new Date().toISOString());
    }

    // Stop trace when component unmounts
    return () => {
      stopTrace(pageTrace);
    };
  }, [pageName, userId]);
};

/**
 * Hook for tracking specific user actions
 */
export const useActionTracing = () => {
  const traceAction = async <T>(
    actionName: string,
    action: () => Promise<T>,
    metadata?: Record<string, string>
  ): Promise<T> => {
    const actionTrace = startTrace(`user_action_${actionName}`);
    
    if (actionTrace && metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        setTraceAttribute(actionTrace, key, value);
      });
    }

    try {
      const result = await action();
      if (actionTrace) {
        setTraceAttribute(actionTrace, 'status', 'success');
      }
      return result;
    } catch (error) {
      if (actionTrace) {
        setTraceAttribute(actionTrace, 'status', 'error');
        setTraceAttribute(actionTrace, 'error_message', error instanceof Error ? error.message : 'unknown');
      }
      throw error;
    } finally {
      stopTrace(actionTrace);
    }
  };

  return { traceAction };
};
