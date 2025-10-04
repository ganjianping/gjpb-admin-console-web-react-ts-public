/**
 * Firebase Feature
 * 
 * Provides Firebase integration services including configuration,
 * analytics, performance monitoring, and related hooks.
 */

// Firebase services
export * from './firebase-config.service';
export * from './firebase-analytics.service';
export * from './firebase-performance.service';

// Firebase hooks
export { useFirebasePerformance } from './useFirebasePerformance';