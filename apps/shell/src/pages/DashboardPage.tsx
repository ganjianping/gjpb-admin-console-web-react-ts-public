import { useState, useRef } from 'react';
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
  Divider,
  Button,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
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

// Firebase Performance
import { useFirebasePerformance } from '../hooks/useFirebasePerformance';

// Firebase Analytics
import { trackPageView } from '../utils/firebaseAnalytics';

// Redux
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { setPageTitle } from '../redux/slices/uiSlice';
import { Grid } from '../../../shared-lib/src/utils/grid';

// Dashboard service
import dashboardService, { type DashboardStats } from '../services/dashboardService';

// Custom hooks
import { useSingletonEffect } from '../hooks/useSingletonEffect';

// Mock data for dashboard
const recentActivity = [
  { id: 1, action: 'User login', user: 'admin@example.com', date: new Date(2025, 5, 6, 14, 25) },
  { id: 2, action: 'User created', user: 'john.doe@example.com', date: new Date(2025, 5, 5, 16, 10) },
  { id: 3, action: 'Password reset', user: 'jane.smith@example.com', date: new Date(2025, 5, 5, 11, 32) },
  { id: 4, action: 'Role updated', user: 'mark.wilson@example.com', date: new Date(2025, 5, 4, 9, 45) },
];

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverDateTime, setServerDateTime] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Use ref to prevent duplicate API calls
  const isApiCallInProgress = useRef(false);
  
  // Cache key for localStorage
  const CACHE_KEY = 'dashboard_stats_cache';
  const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  
  // Firebase Performance tracking for dashboard page
  useFirebasePerformance('dashboard', user?.username);
  
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
  
  // Fetch dashboard statistics
  const fetchDashboardStats = async (forceRefresh = false) => {
    // If not forcing refresh, check cache first
    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        setDashboardStats(cachedData.stats);
        setServerDateTime(cachedData.serverDateTime);
        setLastUpdated(new Date(cachedData.lastUpdated));
        setLoading(false);
        console.log('� Loaded data from cache');
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
        setServerDateTime(serverTime);
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
        const errorMsg = apiResponse?.status?.message || 'Failed to fetch dashboard statistics';
        console.error('❌ API error - status code:', apiResponse?.status?.code);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('💥 Error fetching dashboard stats:', err);
      setError(`Failed to load dashboard statistics: ${err?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
      isApiCallInProgress.current = false;
      console.log('🏁 Fetch dashboard stats completed');
    }
  };
  
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
  }, []); // Empty dependency array to prevent multiple calls
  
  // Create summary stats from API data
  const getSummaryStats = () => {
    console.log('🔍 getSummaryStats called with dashboardStats:', dashboardStats);
    console.log('⏳ loading state:', loading);
    
    // If we don't have data yet, show loading or default values
    if (!dashboardStats) {
      console.log('📭 No dashboard stats, returning default values');
      return [
        { title: 'Total Users', value: loading ? '-' : '0', icon: Users, color: '#1976d2' },
        { title: 'Active Sessions', value: loading ? '-' : '0', icon: Activity, color: '#2e7d32' },
        { title: 'Active Users', value: loading ? '-' : '0', icon: UserCheck, color: '#388e3c' },
        { title: 'Locked Users', value: loading ? '-' : '0', icon: Lock, color: '#f57c00' },
        { title: 'Suspended Users', value: loading ? '-' : '0', icon: UserX, color: '#d32f2f' },
        { title: 'Pending Verification', value: loading ? '-' : '0', icon: Clock, color: '#7b1fa2' },
      ];
    }
    
    console.log('📈 Creating stats from API data:', dashboardStats);
    
    // Handle the actual API response structure
    const stats = [
      { 
        title: 'Total Users', 
        value: (dashboardStats.totalUsers ?? 0).toString(), 
        icon: Users, 
        color: '#1976d2' 
      },
      { 
        title: 'Active Sessions', 
        value: (dashboardStats.activeSessions ?? 0).toString(), 
        icon: Activity, 
        color: '#2e7d32' 
      },
      { 
        title: 'Active Users', 
        value: (dashboardStats.activeUsers ?? 0).toString(), 
        icon: UserCheck, 
        color: '#388e3c' 
      },
      { 
        title: 'Locked Users', 
        value: (dashboardStats.lockedUsers ?? 0).toString(), 
        icon: Lock, 
        color: '#f57c00' 
      },
      { 
        title: 'Suspended Users', 
        value: (dashboardStats.suspendedUsers ?? 0).toString(), 
        icon: UserX, 
        color: '#d32f2f' 
      },
      { 
        title: 'Pending Verification', 
        value: (dashboardStats.pendingVerificationUsers ?? 0).toString(), 
        icon: Clock, 
        color: '#7b1fa2' 
      },
    ];
    
    console.log('📊 Final stats array:', stats);
    return stats;
  };
  
  const summaryStats = getSummaryStats();
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Add CSS keyframes for spin animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Error handling */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Welcome message */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
            {t('dashboard.welcome')}, {user?.nickname ?? user?.username}!
          </Typography>
          <Tooltip title="Refresh Dashboard Data">
            <IconButton 
              onClick={() => fetchDashboardStats(true)}
              disabled={loading}
              sx={{ 
                ml: 2,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
                '&:disabled': {
                  color: 'action.disabled',
                }
              }}
            >
              <RefreshCw 
                size={20} 
                style={{ 
                  animation: loading ? 'spin 1s linear infinite' : undefined,
                  transformOrigin: 'center'
                }} 
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Typography>
        
        {/* Server DateTime and Last Updated */}
        {(serverDateTime || lastUpdated) && (
          <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary">
                Last Updated: {format(lastUpdated, 'MMM d, yyyy HH:mm:ss')}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      {/* Stats summary */}
      <Grid container component="div" spacing={3} sx={{ mb: 4 }}>
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item component="div" xs={12} sm={6} md={4} lg={2} key={stat.title}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  height: '100%',
                  minHeight: 140,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {loading ? (
                  <>
                    <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={32} />
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${stat.color}15`,
                        color: stat.color,
                        mb: 2,
                      }}
                    >
                      <Icon size={28} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Main dashboard content - Recent activity taking full width */}
      <Grid container component="div" spacing={3}>
        <Grid item component="div" xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
            <CardHeader 
              title={
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {t('dashboard.recentActivity')}
                </Typography>
              }
              action={
                <Button
                  endIcon={<ChevronRight size={16} />}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                  variant="outlined"
                  size="small"
                >
                  {t('common.viewAll')}
                </Button>
              }
              sx={{ pb: 1 }}
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ py: 0 }}>
                {recentActivity.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem 
                      sx={{ 
                        py: 3, 
                        px: 3,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {activity.user} • {format(activity.date, 'MMM d, HH:mm')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;