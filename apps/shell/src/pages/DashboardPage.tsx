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
  FileText, 
  Activity, 
  Layers, 
  AlertCircle,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// Firebase Performance
import { useFirebasePerformance } from '../hooks/useFirebasePerformance';

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

// Summary stats
const summaryStats = [
  { title: 'Total Users', value: '1,245', icon: Users, color: '#1976d2' },
  { title: 'Active Sessions', value: '37', icon: Activity, color: '#2e7d32' },
  { title: 'Documents', value: '874', icon: FileText, color: '#ed6c02' },
  { title: 'System Alerts', value: '5', icon: AlertCircle, color: '#d32f2f' },
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
  }, [dispatch, t]);
  
  return (
    <Box>
      {/* Welcome message */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('dashboard.welcome')}, {user?.nickname ?? user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Typography>
      </Box>
      
      {/* Stats summary */}
      <Grid container component="div" spacing={3} sx={{ mb: 4 }}>
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item component="div" xs={12} sm={6} md={3} key={stat.title}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    mr: 2,
                  }}
                >
                  <Icon size={24} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Main dashboard content */}
      <Grid container component="div" spacing={3}>
        {/* Recent activity */}
        <Grid item component="div" xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <CardHeader 
              title={t('dashboard.recentActivity')}
              action={
                <Button
                  endIcon={<ChevronRight size={16} />}
                  sx={{ textTransform: 'none' }}
                >
                  {t('common.viewAll')}
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {recentActivity.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem>
                      <ListItemText
                        primary={activity.action}
                        secondary={`${activity.user} • ${format(activity.date, 'MMM d, HH:mm')}`}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Quick actions */}
        <Grid item component="div" xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <CardHeader title={t('dashboard.quickActions')} />
            <Divider />
            <CardContent>
              <Grid container component="div" spacing={2}>
                <Grid item component="div" xs={12} sm={6}>
                  <Button
                    variant="contained"
                    startIcon={<Users size={18} />}
                    fullWidth
                    sx={{ mb: 2, justifyContent: 'flex-start', py: 1 }}
                  >
                    {t('navigation.manageUsers')}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FileText size={18} />}
                    fullWidth
                    sx={{ mb: 2, justifyContent: 'flex-start', py: 1 }}
                  >
                    {t('navigation.createDocument')}
                  </Button>
                </Grid>
                <Grid item component="div" xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Download size={18} />}
                    fullWidth
                    sx={{ mb: 2, justifyContent: 'flex-start', py: 1 }}
                  >
                    {t('dashboard.downloadReport')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<Layers size={18} />}
                    fullWidth
                    sx={{ mb: 2, justifyContent: 'flex-start', py: 1 }}
                  >
                    {t('dashboard.manageSystem')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;