import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';
import { analytics } from './firebase-config.service';

/**
 * Firebase Analytics utilities
 * Provides easy-to-use functions for tracking user behavior and events
 */

/**
 * Track page views
 */
export const trackPageView = (pageName: string, pageTitle?: string): void => {
  if (!analytics) {
    // Only show warning in production, debug info in development
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn(`Analytics page view "${pageName}" not tracked - Firebase Analytics not initialized`);
      console.warn('Check Firebase configuration in environment variables');
    } else {
      console.log(`🔧 Analytics page view "${pageName}" not tracked - disabled in development`);
    }
    return;
  }

  try {
    logEvent(analytics, 'page_view', {
      page_title: pageTitle ?? pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
      custom_page_name: pageName
    });
    console.log(`📊 Analytics: Page view tracked - ${pageName}`);
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

/**
 * Track user login
 */
export const trackUserLogin = (method: string = 'email'): void => {
  if (!analytics) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn('Analytics login event not tracked - Firebase Analytics not initialized');
    } else {
      console.log('🔧 Analytics login event not tracked - disabled in development');
    }
    return;
  }

  try {
    logEvent(analytics, 'login', {
      method: method
    });
    console.log('📊 Analytics: Login tracked');
  } catch (error) {
    console.error('Failed to track login:', error);
  }
};

/**
 * Track user logout
 */
export const trackUserLogout = (): void => {
  if (!analytics) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn('Analytics logout event not tracked - Firebase Analytics not initialized');
    } else {
      console.log('🔧 Analytics logout event not tracked - disabled in development');
    }
    return;
  }

  try {
    logEvent(analytics, 'logout');
    console.log('📊 Analytics: Logout tracked');
  } catch (error) {
    console.error('Failed to track logout:', error);
  }
};

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string, 
  eventParameters?: Record<string, any>
): void => {
  if (!analytics) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn(`Analytics event "${eventName}" not tracked - Firebase Analytics not initialized`);
    } else {
      console.log(`🔧 Analytics event "${eventName}" not tracked - disabled in development`);
    }
    return;
  }

  try {
    logEvent(analytics, eventName, eventParameters);
    console.log(`📊 Analytics: Event tracked - ${eventName}`, eventParameters);
  } catch (error) {
    console.error(`Failed to track event "${eventName}":`, error);
  }
};

/**
 * Track user interactions (clicks, form submissions, etc.)
 */
export const trackUserAction = (
  action: string,
  category: string = 'engagement',
  label?: string,
  value?: number
): void => {
  if (!analytics) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn(`Analytics user action "${action}" not tracked - Firebase Analytics not initialized`);
    } else {
      console.log(`🔧 Analytics user action "${action}" not tracked - disabled in development`);
    }
    return;
  }

  try {
    logEvent(analytics, 'user_action', {
      action: action,
      category: category,
      label: label,
      value: value,
      timestamp: Date.now()
    });
    console.log(`📊 Analytics: User action tracked - ${action}`);
  } catch (error) {
    console.error(`Failed to track user action "${action}":`, error);
  }
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (
  formName: string,
  formType: string = 'form',
  success: boolean = true
): void => {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType,
    success: success,
    timestamp: Date.now()
  });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
  buttonName: string,
  buttonType: string = 'button',
  context?: string
): void => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_type: buttonType,
    context: context,
    timestamp: Date.now()
  });
};

/**
 * Track navigation events
 */
export const trackNavigation = (
  fromPage: string,
  toPage: string,
  method: string = 'click'
): void => {
  trackEvent('navigation', {
    from_page: fromPage,
    to_page: toPage,
    method: method,
    timestamp: Date.now()
  });
};

/**
 * Track search events
 */
export const trackSearch = (
  searchTerm: string,
  searchCategory?: string,
  resultsCount?: number
): void => {
  trackEvent('search', {
    search_term: searchTerm,
    search_category: searchCategory,
    results_count: resultsCount,
    timestamp: Date.now()
  });
};

/**
 * Track errors
 */
export const trackError = (
  errorMessage: string,
  errorType: string = 'javascript_error',
  context?: string
): void => {
  trackEvent('error', {
    error_message: errorMessage,
    error_type: errorType,
    context: context,
    page_path: window.location.pathname,
    timestamp: Date.now()
  });
};

/**
 * Set user properties
 */
export const setAnalyticsUserProperties = (properties: Record<string, any>): void => {
  if (!analytics) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn('Analytics user properties not set - Firebase Analytics not initialized');
    } else {
      console.log('🔧 Analytics user properties not set - disabled in development');
    }
    return;
  }

  try {
    setUserProperties(analytics, properties);
    console.log('📊 Analytics: User properties set', properties);
  } catch (error) {
    console.error('Failed to set user properties:', error);
  }
};

/**
 * Set user ID for analytics
 */
export const setAnalyticsUserId = (userId: string): void => {
  if (!analytics) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.warn('Analytics user ID not set - Firebase Analytics not initialized');
    } else {
      console.log('🔧 Analytics user ID not set - disabled in development');
    }
    return;
  }

  try {
    setUserId(analytics, userId);
    console.log(`📊 Analytics: User ID set - ${userId}`);
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
};

/**
 * Track time spent on page (call when leaving page)
 */
export const trackTimeOnPage = (pageName: string, timeSpentMs: number): void => {
  trackEvent('time_on_page', {
    page_name: pageName,
    time_spent_ms: timeSpentMs,
    time_spent_seconds: Math.round(timeSpentMs / 1000),
    timestamp: Date.now()
  });
};
