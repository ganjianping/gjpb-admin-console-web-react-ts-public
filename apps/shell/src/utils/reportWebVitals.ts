/**
 * Web Vitals reporting utility
 * 
 * This module provides functions to measure and report Core Web Vitals
 * metrics for better performance monitoring in production.
 */

// Define the ReportHandler function type
type ReportHandler = (metric: {
  name: string;
  delta: number;
  value: number;
  id: string;
}) => void;

// Initialize analytics if available
let analyticsInitialized = false;

/**
 * Initialize analytics (placeholder for actual analytics implementation)
 */
const initAnalytics = (): boolean => {
  // Check if we've already initialized
  if (analyticsInitialized) return true;
  
  try {
    // This would be replaced with actual analytics initialization
    // e.g., Google Analytics, Mixpanel, etc.
    console.info('Analytics initialized for performance monitoring');
    analyticsInitialized = true;
    return true;
  } catch (e) {
    console.warn('Failed to initialize analytics:', e);
    return false;
  }
};

/**
 * Send metric data to analytics service
 */
const sendToAnalytics = ({ name, delta, value, id }: {
  name: string;
  delta: number;
  value: number;
  id: string;
}): void => {
  // Ensure analytics is initialized
  if (!initAnalytics()) return;
  
  // Here you would send the metric to your analytics service
  // For now, we just log to console in production
  console.debug(`Web Vital: ${name}`, { delta, value, id });
};

/**
 * Report web vitals metrics
 * 
 * Updated for web-vitals v5 which uses a different API
 */
export const reportWebVitals = async (onPerfEntry?: ReportHandler): Promise<void> => {
  try {
    // Import web-vitals library (supports v5+)
    const webVitals = await import('web-vitals');
    
    // Use provided handler or default to analytics
    const handler = onPerfEntry && typeof onPerfEntry === 'function' ? onPerfEntry : sendToAnalytics;
    
    // Register all metrics using the new API (v5+)
    // The API changed in v5, so we need to use the new methods
    webVitals.onCLS(handler);
    webVitals.onINP(handler); // Uses INP instead of FID in v5+
    webVitals.onFCP(handler);
    webVitals.onLCP(handler);
    webVitals.onTTFB(handler);
  } catch (error) {
    console.warn('Web Vitals library not available', error);
  }
};

export default reportWebVitals;
