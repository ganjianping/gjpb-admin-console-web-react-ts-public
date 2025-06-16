import { useEffect } from 'react';
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
} from '@mui/material';
import { 
  Users, 
  Activity, 
  ChevronRight,
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

// Mock data for dashboard
const recentActivity = [
  { id: 1, action: 'User login', user: 'admin@example.com', date: new Date(2025, 5, 6, 14, 25) },
  { id: 2, action: 'User created', user: 'john.doe@example.com', date: new Date(2025, 5, 5, 16, 10) },
  { id: 3, action: 'Password reset', user: 'jane.smith@example.com', date: new Date(2025, 5, 5, 11, 32) },
  { id: 4, action: 'Role updated', user: 'mark.wilson@example.com', date: new Date(2025, 5, 4, 9, 45) },
];

// Summary stats (removed Documents & System Alerts)
const summaryStats = [
  { title: 'Total Users', value: '1,245', icon: Users, color: '#1976d2' },
  { title: 'Active Sessions', value: '37', icon: Activity, color: '#2e7d32' },
];

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  
  // Firebase Performance tracking for dashboard page
  useFirebasePerformance('dashboard', user?.username);
  
  useEffect(() => {
    // Update page title
    dispatch(setPageTitle(t('navigation.dashboard')));
    
    // Track page view for analytics
    trackPageView('Dashboard', t('navigation.dashboard'));
  }, [dispatch, t]);
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Welcome message */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          {t('dashboard.welcome')}, {user?.nickname ?? user?.username}!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Typography>
      </Box>
      
      {/* Stats summary */}
      <Grid container component="div" spacing={3} sx={{ mb: 4 }}>
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item component="div" xs={12} sm={6} key={stat.title}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    mr: 3,
                  }}
                >
                  <Icon size={32} />
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
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