import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Alert,
  Skeleton,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  Users, 
  Activity, 
  ChevronRight,
  UserCheck,
  Lock,
  UserX,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

// Firebase Performance
import { useFirebasePerformance } from '../hooks/useFirebasePerformance';

// Firebase Analytics
import { trackPageView } from '../utils/firebaseAnalytics';

// Redux
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { setPageTitle } from '../redux/slices/uiSlice';

// Dashboard service
import dashboardService, { type DashboardStats } from '../services/dashboardService';

// Audit log service
import auditLogService, { type AuditLogEntry } from '../services/auditLogService';

// Custom hooks
import { useSingletonEffect } from '../hooks/useSingletonEffect';

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

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentLoginActivity, setRecentLoginActivity] = useState<RecentLoginActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Use ref to prevent duplicate API calls
  const isApiCallInProgress = useRef(false);
  
  // Cache keys for localStorage
  const CACHE_KEY = 'dashboard_stats_cache';
  const RECENT_ACTIVITY_CACHE_KEY = 'recent_activity_cache';
  const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  
  // Firebase Performance tracking for dashboard page
  useFirebasePerformance('dashboard', user?.username);
  
  // Helper function to get date-fns locale based on current language
  const getDateLocale = () => {
    return i18n.language.startsWith('zh') ? zhCN : enUS;
  };

  // Cache management helpers
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const now = new Date().getTime();
        if (now - parsedCache.timestamp < CACHE_EXPIRY_MS) {
          console.log('📦 Using cached dashboard data');
          return parsedCache.data;
        } else {
          console.log('⏰ Cache expired, removing old data');
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('❌ Error reading cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  };
  
  const setCachedData = (data: any) => {
    try {
      const cacheData = {
        data,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Data cached successfully');
    } catch (error) {
      console.error('❌ Error caching data:', error);
    }
  };
  
  // Recent Activity Cache management helpers
  const getCachedRecentLoginActivity = () => {
    try {
      const cached = localStorage.getItem(RECENT_ACTIVITY_CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        // For recent activity, we don't expire by time but only update on login
        console.log('📦 Using cached recent activity data');
        return parsedCache.data;
      }
    } catch (error) {
      console.error('❌ Error reading recent activity cache:', error);
      localStorage.removeItem(RECENT_ACTIVITY_CACHE_KEY);
    }
    return null;
  };
  
  const setCachedRecentLoginActivity = (data: RecentLoginActivityItem[]) => {
    try {
      const cacheData = {
        data,
        timestamp: new Date().getTime(),
        username: user?.username, // Track which user's data this is
      };
      localStorage.setItem(RECENT_ACTIVITY_CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Recent activity cached successfully for user:', user?.username);
    } catch (error) {
      console.error('❌ Error caching recent activity:', error);
    }
  };
  
  const clearRecentLoginActivityCache = () => {
    try {
      localStorage.removeItem(RECENT_ACTIVITY_CACHE_KEY);
      console.log('🗑️ Recent activity cache cleared');
    } catch (error) {
      console.error('❌ Error clearing recent activity cache:', error);
    }
  };
  
  // Fetch dashboard statistics
  const fetchDashboardStats = async (forceRefresh = false) => {
    // If not forcing refresh, check cache first
    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        setDashboardStats(cachedData.stats);
        setLastUpdated(new Date(cachedData.lastUpdated));
        setLoading(false);
        console.log('📦 Loaded data from cache');
        return;
      }
    }
    
    // Prevent duplicate calls using ref
    if (isApiCallInProgress.current) {
      console.log('🔄 API call already in progress, skipping duplicate request');
      return;
    }
    
    // Set flag before async operation
    isApiCallInProgress.current = true;
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching dashboard stats...', forceRefresh ? '(forced refresh)' : '');
      
      const apiResponse = await dashboardService.getDashboardStats();
      console.log('✅ API Response received:', apiResponse);
      
      // Now we should have the correct structure: apiResponse.data contains the dashboard stats
      if (apiResponse?.status?.code === 200 && apiResponse.data) {
        console.log('📊 Setting dashboard stats:', apiResponse.data);
        setDashboardStats(apiResponse.data);
        
        // Extract server date time from meta or use current time
        const serverTime = apiResponse.meta?.serverDateTime || new Date().toISOString();
        setLastUpdated(new Date());
        
        // Cache the data
        const dataToCache = {
          stats: apiResponse.data,
          serverDateTime: serverTime,
          lastUpdated: new Date().toISOString(),
        };
        setCachedData(dataToCache);
        
        console.log('✨ Dashboard stats successfully set in state');
      } else {
        const errorMsg = apiResponse?.status?.message || t('dashboard.errors.fetchFailed');
        console.error('❌ API error - status code:', apiResponse?.status?.code);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('💥 Error fetching dashboard stats:', err);
      setError(`${t('dashboard.errors.loadFailed')}: ${err?.message || t('dashboard.errors.tryAgain')}`);
    } finally {
      setLoading(false);
      isApiCallInProgress.current = false;
      console.log('🏁 Fetch dashboard stats completed');
    }
  };
  
  // Fetch recent activity from audit logs
  const fetchRecentLoginActivity = async (forceRefresh = false) => {
    // If not forcing refresh, check cache first
    if (!forceRefresh) {
      const cachedActivity = getCachedRecentLoginActivity();
      if (cachedActivity) {
        setRecentLoginActivity(cachedActivity);
        console.log('� Loaded recent activity from cache');
        return;
      }
    }
    
    try {
      console.log('�🔄 Fetching recent activity from audit logs...', forceRefresh ? '(forced refresh)' : '');
      
      // Get the current user's username or fallback to 'gjpb_user_info'
      const currentUsername = user?.username || 'gjpb_user_info';
      
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
          action: getActionDescription(entry),
          user: entry.username || t('dashboard.unknownUser'),
          date: new Date(entry.timestamp),
          endpoint: entry.endpoint,
          result: entry.result,
          httpMethod: entry.httpMethod
        }));
        
        setRecentLoginActivity(activities);
        setCachedRecentLoginActivity(activities); // Cache the data
        console.log('✅ Recent activity successfully loaded and cached:', activities.length, 'items');
      } else {
        console.warn('⚠️ No recent activity data found');
        setRecentLoginActivity([]);
      }
    } catch (error: any) {
      console.error('💥 Error fetching recent activity:', error);
      // Keep existing activities or set empty array
      setRecentLoginActivity([]);
    }
  };
  
  // Helper functions for action descriptions
  const getAuthAction = (method: string): string => {
    if (method === 'POST') return t('dashboard.actions.tokenAuth');
    if (method === 'DELETE') return t('dashboard.actions.tokenRevoke');
    return t('dashboard.actions.tokenValidate');
  };
  
  const getUserAction = (method: string): string => {
    if (method === 'POST') return t('dashboard.actions.userCreate');
    if (method === 'PUT') return t('dashboard.actions.userUpdate');
    if (method === 'DELETE') return t('dashboard.actions.userDelete');
    return t('dashboard.actions.userAction');
  };

  // Helper function to get human-readable action description
  const getActionDescription = (entry: AuditLogEntry): string => {
    const method = entry.httpMethod?.toUpperCase() || '';
    const endpoint = entry.endpoint || '';
    
    if (endpoint.includes('/auth/tokens')) return getAuthAction(method);
    if (endpoint.includes('/auth/login')) return t('dashboard.actions.userLogin');
    if (endpoint.includes('/auth/logout')) return t('dashboard.actions.userLogout');
    if (endpoint.includes('/users')) return getUserAction(method);
    if (endpoint.includes('/password')) return t('dashboard.actions.passwordReset');
    if (endpoint.includes('/roles')) return t('dashboard.actions.roleManagement');
    
    return `${method} ${endpoint}`;
  };
  
  // Public function to update recent activity cache after login
  // This can be called from auth service or login components
  const updateRecentLoginActivityAfterLogin = async () => {
    console.log('🔐 Login detected, updating recent activity cache');
    clearRecentLoginActivityCache(); // Clear old cache
    await fetchRecentLoginActivity(true); // Fetch fresh data
  };
  
  // Expose function for external use (e.g., from auth service)
  // You can call this after successful login: window.updateDashboardRecentLoginActivity?.()
  if (typeof window !== 'undefined') {
    (window as any).updateDashboardRecentLoginActivity = updateRecentLoginActivityAfterLogin;
  }
  
  // Use a different approach: combine useRef with useEffect to prevent duplicate calls
  const hasMounted = useRef(false);
  
  useSingletonEffect(() => {
    if (hasMounted.current) {
      console.log('🚫 Dashboard already mounted, skipping initialization');
      return;
    }
    
    hasMounted.current = true;
    console.log('🚀 Dashboard component initializing with singleton effect');
    
    // Update page title
    dispatch(setPageTitle(t('navigation.dashboard')));
    
    // Track page view for analytics
    trackPageView('Dashboard', t('navigation.dashboard'));
    
    // Fetch dashboard data
    fetchDashboardStats();
    
    // Load recent activity from cache first, don't fetch fresh data on component mount
    const cachedActivity = getCachedRecentLoginActivity();
    if (cachedActivity) {
      setRecentLoginActivity(cachedActivity);
      console.log('📦 Loaded recent activity from cache on mount');
    } else {
      // Only fetch fresh data if no cache exists
      fetchRecentLoginActivity();
    }
  }, []); // Empty dependency array to prevent multiple calls
  
  // Function to refresh recent activity after login
  const refreshRecentLoginActivityAfterLogin = async () => {
    console.log('🔄 Refreshing recent activity after user login');
    await fetchRecentLoginActivity(true); // Force refresh
  };
  
  // Watch for user changes (login/logout) to update recent activity
  useSingletonEffect(() => {
    if (user?.username) {
      console.log('👤 User detected, checking if recent activity needs refresh');
      
      // Check if cached data is for a different user
      try {
        const cached = localStorage.getItem(RECENT_ACTIVITY_CACHE_KEY);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          if (parsedCache.username !== user.username) {
            console.log('🔄 User changed, refreshing recent activity');
            clearRecentLoginActivityCache();
            refreshRecentLoginActivityAfterLogin();
          }
        } else {
          // No cache exists, fetch data for the logged-in user
          console.log('📭 No cached data, fetching recent activity for logged-in user');
          refreshRecentLoginActivityAfterLogin();
        }
      } catch (error) {
        console.error('❌ Error checking user cache:', error);
        refreshRecentLoginActivityAfterLogin();
      }
    }
  }, [user?.username]); // Depend on username to trigger when user changes
  
  // Navigation handlers for stats cards
  const handleStatsCardClick = (statTitle: string) => {
    switch (statTitle) {
      case t('dashboard.stats.totalUsers'):
        navigate('/users');
        break;
      case t('dashboard.stats.activeUsers'):
        navigate('/users?accountStatus=active');
        break;
      case t('dashboard.stats.lockedUsers'):
        navigate('/users?accountStatus=locked');
        break;
      case t('dashboard.stats.suspendedUsers'):
        navigate('/users?accountStatus=suspend');
        break;
      case t('dashboard.stats.pendingVerification'):
        navigate('/users?accountStatus=pending_verification');
        break;
      default:
        // For other stats like Active Sessions, we might not have specific pages yet
        console.log(`Clicked on ${statTitle} - no navigation configured`);
        break;
    }
  };

  // Create summary stats from API data
  const getSummaryStats = () => {
    console.log('🔍 getSummaryStats called with dashboardStats:', dashboardStats);
    console.log('⏳ loading state:', loading);
    
    // If we don't have data yet, show loading or default values
    if (!dashboardStats) {
      console.log('📭 No dashboard stats, returning default values');
      return [
        { 
          title: t('dashboard.stats.totalUsers'), 
          value: loading ? '-' : '0', 
          icon: Users, 
          color: theme.palette.primary.main,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          bgColor: alpha(theme.palette.primary.main, 0.1),
          navigable: true,
        },
        { 
          title: t('dashboard.stats.activeSessions'), 
          value: loading ? '-' : '0', 
          icon: Activity, 
          color: theme.palette.success.main,
          gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
          bgColor: alpha(theme.palette.success.main, 0.1),
          navigable: false,
        },
        { 
          title: t('dashboard.stats.activeUsers'), 
          value: loading ? '-' : '0', 
          icon: UserCheck, 
          color: theme.palette.success.dark,
          gradient: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
          bgColor: alpha(theme.palette.success.dark, 0.1),
          navigable: true,
        },
        { 
          title: t('dashboard.stats.lockedUsers'), 
          value: loading ? '-' : '0', 
          icon: Lock, 
          color: theme.palette.warning.main,
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          navigable: true,
        },
        { 
          title: t('dashboard.stats.suspendedUsers'), 
          value: loading ? '-' : '0', 
          icon: UserX, 
          color: theme.palette.error.main,
          gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
          bgColor: alpha(theme.palette.error.main, 0.1),
          navigable: true,
        },
        { 
          title: t('dashboard.stats.pendingVerification'), 
          value: loading ? '-' : '0', 
          icon: Clock, 
          color: theme.palette.secondary.main,
          gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
          bgColor: alpha(theme.palette.secondary.main, 0.1),
          navigable: true,
        },
      ];
    }
    
    console.log('📈 Creating stats from API data:', dashboardStats);
    
    // Handle the actual API response structure
    const stats = [
      { 
        title: t('dashboard.stats.totalUsers'), 
        value: (dashboardStats.totalUsers ?? 0).toString(), 
        icon: Users, 
        color: theme.palette.primary.main,
        gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        bgColor: alpha(theme.palette.primary.main, 0.1),
        navigable: true,
      },
      { 
        title: t('dashboard.stats.activeSessions'), 
        value: (dashboardStats.activeSessions ?? 0).toString(), 
        icon: Activity, 
        color: theme.palette.success.main,
        gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
        bgColor: alpha(theme.palette.success.main, 0.1),
        navigable: false,
      },
      { 
        title: t('dashboard.stats.activeUsers'), 
        value: (dashboardStats.activeUsers ?? 0).toString(), 
        icon: UserCheck, 
        color: theme.palette.success.dark,
        gradient: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
        bgColor: alpha(theme.palette.success.dark, 0.1),
        navigable: true,
      },
      { 
        title: t('dashboard.stats.lockedUsers'), 
        value: (dashboardStats.lockedUsers ?? 0).toString(), 
        icon: Lock, 
        color: theme.palette.warning.main,
        gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
        bgColor: alpha(theme.palette.warning.main, 0.1),
        navigable: true,
      },
      { 
        title: t('dashboard.stats.suspendedUsers'), 
        value: (dashboardStats.suspendedUsers ?? 0).toString(), 
        icon: UserX, 
        color: theme.palette.error.main,
        gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
        bgColor: alpha(theme.palette.error.main, 0.1),
        navigable: true,
      },
      { 
        title: t('dashboard.stats.pendingVerification'), 
        value: (dashboardStats.pendingVerificationUsers ?? 0).toString(), 
        icon: Clock, 
        color: theme.palette.secondary.main,
        gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
        bgColor: alpha(theme.palette.secondary.main, 0.1),
        navigable: true,
      },
    ];
    
    console.log('📊 Final stats array:', stats);
    return stats;
  };
  
  const summaryStats = getSummaryStats();
  
  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: theme.palette.background.default, 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Add CSS keyframes for animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
            }
            50% {
              box-shadow: 0 12px 35px rgba(25, 118, 210, 0.5);
            }
          }

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
            }
            50% {
              box-shadow: 0 12px 35px rgba(25, 118, 210, 0.5);
            }
          }
        `}
      </style>
      
      <Box sx={{ 
        flex: 1,
        maxWidth: { xs: '100%', sm: '100%', md: '1200px', lg: '1400px', xl: '1600px' }, 
        mx: 'auto', 
        p: { xs: 1, sm: 2, md: 3, lg: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        overflow: 'auto',
      }}>
        {/* Error handling */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: { xs: 2, sm: 3 },
              border: 1,
              borderColor: 'error.light',
              animation: 'slideInLeft 0.5s ease-out',
            }}
          >
            {error}
          </Alert>
        )}
      
        {/* Welcome Hero Section */}
        <Box sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <Box 
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: { xs: 2, sm: 3, md: 4 },
              p: { xs: 2, sm: 3, md: 4 },
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: {
                xs: '0 4px 16px rgba(0,0,0,0.08)',
                sm: '0 6px 24px rgba(0,0,0,0.1)',
                md: '0 8px 32px rgba(0,0,0,0.12)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-30%',
                right: '-10%',
                width: { xs: '120px', sm: '180px', md: '240px' },
                height: { xs: '120px', sm: '180px', md: '240px' },
                background: `radial-gradient(circle, ${alpha(theme.palette.common.white, 0.08)} 0%, transparent 70%)`,
                borderRadius: '50%',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-20%',
                left: '-5%',
                width: { xs: '100px', sm: '140px', md: '180px' },
                height: { xs: '100px', sm: '140px', md: '180px' },
                background: `radial-gradient(circle, ${alpha(theme.palette.common.white, 0.06)} 0%, transparent 70%)`,
                borderRadius: '50%',
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              {/* Main greeting */}
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 1, sm: 1.5 },
                  fontSize: { 
                    xs: '1.5rem', 
                    sm: '1.75rem', 
                    md: '2.25rem', 
                    lg: '2.5rem'
                  },
                  lineHeight: { xs: 1.3, sm: 1.4 },
                  background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.9) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {t('dashboard.welcome')}, {user?.nickname ?? user?.username}! 👋
              </Typography>
              
              {/* Date and status row */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1.5, sm: 2 },
                flexWrap: 'wrap',
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 400, 
                    opacity: 0.9, 
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  📅 {format(new Date(), 'EEEE, MMMM d, yyyy', { locale: getDateLocale() })}
                </Typography>
                
                {/* Update status */}
                {lastUpdated && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    backgroundColor: alpha(theme.palette.common.white, 0.12),
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    backdropFilter: 'blur(8px)',
                  }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        fetchDashboardStats(true);
                        // Note: Recent activity cache only updates on user login, not on manual refresh
                      }}
                      disabled={loading}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.common.white, 0.2),
                        },
                        '&:disabled': {
                          color: alpha(theme.palette.common.white, 0.5),
                        },
                        width: 28,
                        height: 28,
                      }}
                    >
                      <RefreshCw 
                        size={14} 
                        style={{ 
                          animation: loading ? 'spin 1s linear infinite' : undefined,
                          transformOrigin: 'center'
                        }} 
                      />
                    </IconButton>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontWeight: 500,
                      }}
                    >
                      {t('dashboard.updated')}: {format(lastUpdated, 'HH:mm, MMM d, yyyy', { locale: getDateLocale() })}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      
        {/* Stats Grid - Responsive Design */}
        <Box sx={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(6, 1fr)',
                lg: 'repeat(6, 1fr)',
              },
              gap: { xs: 2, sm: 3, md: 4 },
              mb: { xs: 3, sm: 4 },
            }}
          >
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Paper 
                  key={stat.title}
                  elevation={0} 
                  onClick={() => stat.navigable ? handleStatsCardClick(stat.title) : undefined}
                  sx={{ 
                    p: { xs: 2, sm: 3, md: 4 }, 
                    borderRadius: { xs: 3, sm: 4 }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${stat.bgColor} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                    border: `2px solid ${alpha(stat.color, 0.1)}`,
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: { xs: 140, sm: 160, md: 180 },
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: stat.navigable ? 'pointer' : 'default',
                    '&:hover': {
                      transform: stat.navigable ? 'translateY(-8px) scale(1.02)' : 'translateY(-4px) scale(1.01)',
                      boxShadow: `0 20px 40px ${alpha(stat.color, 0.25)}`,
                      borderColor: stat.color,
                      background: `linear-gradient(135deg, ${alpha(stat.color, 0.15)} 0%, ${alpha(stat.color, 0.08)} 100%)`,
                      '& .stat-icon': {
                        transform: 'scale(1.15) rotate(10deg)',
                        boxShadow: `0 10px 30px ${alpha(stat.color, 0.4)}`,
                      },
                      '& .stat-value': {
                        transform: 'scale(1.1)',
                        color: stat.color,
                      },
                      '& .stat-glow': {
                        opacity: 1,
                      },
                      '& .nav-indicator': {
                        opacity: stat.navigable ? 1 : 0,
                        transform: 'translateX(0)',
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: { xs: '4px', sm: '5px' },
                      background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                    },
                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                  }}
                >
                  {/* Glow effect */}
                  <Box
                    className="stat-glow"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '200%',
                      height: '200%',
                      background: `radial-gradient(circle, ${alpha(stat.color, 0.1)} 0%, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Navigation indicator for clickable cards */}
                  {stat.navigable && (
                    <Box
                      className="nav-indicator"
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        opacity: 0,
                        transform: 'translateX(10px)',
                        transition: 'all 0.3s ease',
                        color: stat.color,
                        fontSize: '1.2rem',
                        pointerEvents: 'none',
                      }}
                    >
                      →
                    </Box>
                  )}
                  
                  {loading ? (
                    <>
                      <Skeleton 
                        variant="circular" 
                        sx={{ 
                          width: { xs: 48, sm: 56, md: 64 },
                          height: { xs: 48, sm: 56, md: 64 },
                          mb: 2,
                        }} 
                      />
                      <Skeleton 
                        variant="text" 
                        width="80%" 
                        sx={{ height: 20, mb: 1 }}
                      />
                      <Skeleton 
                        variant="text" 
                        width="60%" 
                        sx={{ height: 32 }}
                      />
                    </>
                  ) : (
                    <>
                      <Box
                        className="stat-icon"
                        sx={{
                          p: { xs: 2, sm: 2.5, md: 3 },
                          borderRadius: { xs: 3, sm: 4 },
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                          color: 'white',
                          mb: { xs: 2, sm: 3 },
                          transition: 'all 0.4s ease',
                          boxShadow: `0 8px 25px ${alpha(stat.color, 0.3)}`,
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        <Icon 
                          size={24} 
                          style={{ 
                            fontSize: 'clamp(20px, 5vw, 32px)',
                            width: 'clamp(20px, 5vw, 32px)',
                            height: 'clamp(20px, 5vw, 32px)',
                          }} 
                        />
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1, 
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          lineHeight: 1.2,
                          textAlign: 'center',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        {stat.title}
                      </Typography>
                      
                      <Typography 
                        className="stat-value"
                        variant="h3" 
                        sx={{ 
                          fontWeight: 900,
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          transition: 'all 0.4s ease',
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          lineHeight: 1,
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </>
                  )}
                </Paper>
              );
            })}
          </Box>
        </Box>
      
        {/* Activity Section - Modern Design */}
        <Box sx={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: { xs: 3, sm: 4, md: 5 }, 
              border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: 'hidden',
              background: `linear-gradient(145deg, 
                ${theme.palette.background.paper} 0%, 
                ${alpha(theme.palette.background.default, 0.5)} 100%)`,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
                boxShadow: { 
                  xs: '0 8px 30px rgba(0,0,0,0.08)', 
                  sm: '0 12px 40px rgba(0,0,0,0.1)', 
                  md: '0 16px 50px rgba(0,0,0,0.12)' 
                },
              }
            }}
          >
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                  <Box 
                    sx={{ 
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: { xs: 2, sm: 3 },
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: 'white',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    <Activity 
                      size={20} 
                      style={{ 
                        fontSize: 'clamp(16px, 4vw, 24px)',
                        width: 'clamp(16px, 4vw, 24px)',
                        height: 'clamp(16px, 4vw, 24px)',
                      }} 
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                      background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {t('dashboard.recentLoginActivity.title')}
                  </Typography>
                </Box>
              }
              action={
                <Button
                  endIcon={
                    <ChevronRight 
                      size={16} 
                      style={{ 
                        fontSize: 'clamp(14px, 3vw, 18px)',
                        width: 'clamp(14px, 3vw, 18px)',
                        height: 'clamp(14px, 3vw, 18px)',
                      }} 
                    />
                  }
                  onClick={() => navigate('/audit-logs')}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 600,
                    borderRadius: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    color: theme.palette.primary.main,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                      borderColor: theme.palette.primary.main,
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                  variant="outlined"
                  size="small"
                >
                  {t('dashboard.recentLoginActivity.viewAll')}
                </Button>
              }
              sx={{ 
                pb: { xs: 1, sm: 2 }, 
                px: { xs: 3, sm: 4, md: 5 },
                pt: { xs: 3, sm: 4, md: 5 },
              }}
            />
            
            <Divider sx={{ mx: { xs: 3, sm: 4, md: 5 } }} />
            
            <CardContent sx={{ p: 0 }}>
              <List sx={{ py: 0 }}>
                {recentLoginActivity.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem 
                      sx={{ 
                        py: { xs: 2, sm: 3, md: 4 }, 
                        px: { xs: 3, sm: 4, md: 5 },
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          '&::before': {
                            opacity: 1,
                            width: { xs: '4px', sm: '6px' },
                          },
                          '& .activity-avatar': {
                            transform: 'scale(1.1)',
                            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                          },
                          '& .activity-content': {
                            transform: 'translateX(8px)',
                          }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: { xs: '3px', sm: '4px' },
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          opacity: 0,
                          transition: 'all 0.3s ease',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <ListItemAvatar sx={{ mr: { xs: 2, sm: 3 } }}>
                        <Avatar
                          className="activity-avatar"
                          sx={{
                            bgcolor: 'transparent',
                            background: index % 2 === 0 
                              ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                              : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                            width: { xs: 40, sm: 48, md: 56 },
                            height: { xs: 40, sm: 48, md: 56 },
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                            fontWeight: 700,
                            color: 'white',
                            border: `3px solid ${theme.palette.background.paper}`,
                            boxShadow: `0 4px 15px ${alpha(theme.palette.text.primary, 0.15)}`,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {activity.user.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        className="activity-content"
                        sx={{ transition: 'transform 0.3s ease' }}
                        primary={
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              color: theme.palette.text.primary,
                              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                              lineHeight: 1.4,
                              mb: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            🕒 {format(activity.date, 'MMM d, yyyy • HH:mm', { locale: getDateLocale() })}
                          </Typography>
                        }
                      />
                    </ListItem>
                    
                    {index < recentLoginActivity.length - 1 && (
                      <Divider 
                        variant="inset" 
                        component="li" 
                        sx={{ 
                          ml: { xs: 7, sm: 8, md: 9 },
                          borderColor: alpha(theme.palette.divider, 0.3),
                        }} 
                      />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};export default DashboardPage;