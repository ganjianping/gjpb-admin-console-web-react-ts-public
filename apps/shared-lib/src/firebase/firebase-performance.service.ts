import { trace, type PerformanceTrace } from 'firebase/performance';
import { performance as firebasePerf } from './firebase-config.service';

// Re-export the performance instance for external use
export { firebasePerf as performance };

/**
 * Firebase Performance Monitoring utilities
 * Provides easy-to-use functions for custom performance tracking
 */

/**
 * Create and start a custom trace
 */
export const startTrace = (traceName: string): PerformanceTrace | null => {
  if (!firebasePerf) {
    // Only log warning in production to avoid console spam in development
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn(`Performance trace "${traceName}" not started - Firebase Performance not initialized`);
    }
    return null;
  }

  try {
    const customTrace = trace(firebasePerf, traceName);
    customTrace.start();
    console.log(`🔥 Started trace: ${traceName}`);
    return customTrace;
  } catch (error) {
    console.error(`Failed to start trace "${traceName}":`, error);
    return null;
  }
};

/**
 * Stop a custom trace
 */
export const stopTrace = (customTrace: PerformanceTrace | null): void => {
  if (!customTrace) return;

  try {
    customTrace.stop();
    console.log('🔥 Trace completed');
  } catch (error) {
    console.error('Failed to stop trace:', error);
  }
};

/**
 * Add custom attributes to a trace
 */
export const setTraceAttribute = (
  customTrace: PerformanceTrace | null, 
  attributeName: string, 
  attributeValue: string
): void => {
  if (!customTrace) return;

  try {
    customTrace.putAttribute(attributeName, attributeValue);
    console.log(`🔥 Added trace attribute: ${attributeName} = ${attributeValue}`);
  } catch (error) {
    console.error(`Failed to set trace attribute "${attributeName}":`, error);
  }
};

/**
 * Add custom metrics to a trace
 */
export const setTraceMetric = (
  customTrace: PerformanceTrace | null, 
  metricName: string, 
  value: number
): void => {
  if (!customTrace) return;

  try {
    customTrace.putMetric(metricName, value);
    console.log(`🔥 Added trace metric: ${metricName} = ${value}`);
  } catch (error) {
    console.error(`Failed to set trace metric "${metricName}":`, error);
  }
};

/**
 * Convenience function to measure async operations
 */
export const measureAsync = async <T>(
  traceName: string,
  operation: () => Promise<T>,
  attributes?: Record<string, string>
): Promise<T> => {
  const customTrace = startTrace(traceName);
  
  // Add attributes if provided
  if (attributes && customTrace) {
    Object.entries(attributes).forEach(([key, value]) => {
      setTraceAttribute(customTrace, key, value);
    });
  }

  try {
    const startTime = performance.now();
    const result = await operation();
    const duration = performance.now() - startTime;
    
    if (customTrace) {
      setTraceMetric(customTrace, 'duration_ms', Math.round(duration));
      setTraceAttribute(customTrace, 'status', 'success');
    }
    
    return result;
  } catch (error) {
    if (customTrace) {
      setTraceAttribute(customTrace, 'status', 'error');
      setTraceAttribute(customTrace, 'error_message', error instanceof Error ? error.message : 'unknown');
    }
    throw error;
  } finally {
    stopTrace(customTrace);
  }
};

/**
 * Convenience function to measure synchronous operations
 */
export const measureSync = <T>(
  traceName: string,
  operation: () => T,
  attributes?: Record<string, string>
): T => {
  const customTrace = startTrace(traceName);
  
  // Add attributes if provided
  if (attributes && customTrace) {
    Object.entries(attributes).forEach(([key, value]) => {
      setTraceAttribute(customTrace, key, value);
    });
  }

  try {
    const startTime = performance.now();
    const result = operation();
    const duration = performance.now() - startTime;
    
    if (customTrace) {
      setTraceMetric(customTrace, 'duration_ms', Math.round(duration));
      setTraceAttribute(customTrace, 'status', 'success');
    }
    
    return result;
  } catch (error) {
    if (customTrace) {
      setTraceAttribute(customTrace, 'status', 'error');
      setTraceAttribute(customTrace, 'error_message', error instanceof Error ? error.message : 'unknown');
    }
    throw error;
  } finally {
    stopTrace(customTrace);
  }
};
