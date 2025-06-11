import { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  TextField,
  useTheme
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Shield, Lock, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Firebase Analytics
import { trackPageView, trackFormSubmission } from '../utils/firebaseAnalytics';

// Redux
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { setPageTitle } from '../redux/slices/uiSlice';
import { Grid } from '../../../shared-lib/src/utils/grid';

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      style={{
        animation: value === index ? 'fadeIn 0.3s ease-in-out' : 'none',
      }}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

// Profile form schema
const profileSchema = z.object({
  nickname: z.string().min(2, 'Nickname must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobileCountryCode: z.string().optional(),
  mobileNumber: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Password form schema
const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [tabIndex, setTabIndex] = useState(0);
  
  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: user?.nickname || '',
      email: user?.email || '',
      mobileCountryCode: user?.mobileCountryCode || '',
      mobileNumber: user?.mobileNumber || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle(t('navigation.profile')));
    
    // Track page view for analytics
    trackPageView('Profile', t('navigation.profile'));
  }, [dispatch, t]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Handle profile update
  const handleProfileUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      // In a real app, this would call an API to update the profile
      console.log('Updated profile data:', data);
      
      // Track form submission
      trackFormSubmission('profile_update', 'user_profile', true);
      
      // Show success message
      toast.success(t('profile.updateSuccess'));
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Track failed submission
      trackFormSubmission('profile_update', 'user_profile', false);
      
      toast.error(t('profile.updateError'));
    }
  };

  // Handle password change
  const handlePasswordChange: SubmitHandler<PasswordFormData> = async (data) => {
    try {
      // In a real app, this would call an API to change the password
      console.log('Password change data:', data);
      
      // Track password change success
      trackFormSubmission('password_change', 'security', true);
      
      // Reset form
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Show success message
      toast.success(t('profile.passwordChangeSuccess'));
    } catch (error) {
      console.error('Password change error:', error);
      
      // Track password change failure
      trackFormSubmission('password_change', 'security', false);
      
      toast.error(t('profile.passwordChangeError'));
    }
  };

  // If user data is not available
  if (!user) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Profile Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Grid container component="div" spacing={3} alignItems="center">
          <Grid item component="div" xs={12} sm="auto">
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100,
                bgcolor: 'primary.main',
                fontSize: 40,
              }}
            >
              {user.nickname?.[0] || user.username?.[0] || 'U'}
            </Avatar>
          </Grid>
          
          <Grid item component="div" xs={12} sm>
            <Typography variant="h4" gutterBottom>
              {user.nickname || user.username}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ marginRight: 6 }} />
                <Typography variant="body2" color="text.secondary">
                  {user.email || t('profile.noEmailProvided')}
                </Typography>
              </Box>
              
              {user.mobileNumber && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ marginRight: 6 }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.mobileCountryCode && `+${user.mobileCountryCode}`} {user.mobileNumber}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Shield size={16} style={{ marginRight: 6 }} />
                <Typography variant="body2" color="text.secondary">
                  {user.roleCodes?.join(', ') || 'User'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Profile Tabs */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                py: 2,
                minHeight: 48,
              },
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={16} />
                  <span>{t('profile.tabs.personal')}</span>
                </Box>
              } 
              {...a11yProps(0)} 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={16} />
                  <span>{t('profile.tabs.security')}</span>
                </Box>
              } 
              {...a11yProps(1)} 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} />
                  <span>{t('profile.tabs.activity')}</span>
                </Box>
              } 
              {...a11yProps(2)} 
            />
          </Tabs>
        </Box>
        
        <CardContent>
          {/* Personal Info Tab */}
          <TabPanel value={tabIndex} index={0}>
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
              <Grid container component="div" spacing={3}>
                <Grid item component="div" xs={12} md={6}>
                  <Controller
                    name="nickname"
                    control={profileForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={t('profile.form.nickname')}
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <User size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item component="div" xs={12} md={6}>
                  <Controller
                    name="email"
                    control={profileForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={t('profile.form.email')}
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <Mail size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item component="div" xs={12} md={3}>
                  <Controller
                    name="mobileCountryCode"
                    control={profileForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={t('profile.form.countryCode')}
                        placeholder="1"
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item component="div" xs={12} md={9}>
                  <Controller
                    name="mobileNumber"
                    control={profileForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={t('profile.form.mobileNumber')}
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <Phone size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item component="div" xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!profileForm.formState.isDirty || profileForm.formState.isSubmitting}
                      sx={{ py: 1, px: 4 }}
                    >
                      {t('common.save')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          
          {/* Security Tab */}
          <TabPanel value={tabIndex} index={1}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
              <Grid container component="div" spacing={3}>
                <Grid item component="div" xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {t('profile.changePassword')}
                  </Typography>
                </Grid>
                
                <Grid item component="div" xs={12} md={6}>
                  <Controller
                    name="currentPassword"
                    control={passwordForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="password"
                        label={t('profile.form.currentPassword')}
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item component="div" xs={12} md={6}></Grid>
                
                <Grid item component="div" xs={12} md={6}>
                  <Controller
                    name="newPassword"
                    control={passwordForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="password"
                        label={t('profile.form.newPassword')}
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item component="div" xs={12} md={6}>
                  <Controller
                    name="confirmPassword"
                    control={passwordForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="password"
                        label={t('profile.form.confirmPassword')}
                        variant="outlined"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item component="div" xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!passwordForm.formState.isDirty || passwordForm.formState.isSubmitting}
                      sx={{ py: 1, px: 4 }}
                    >
                      {t('profile.updatePassword')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          
          {/* Activity Tab */}
          <TabPanel value={tabIndex} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('profile.loginActivity')}
              </Typography>
              
              <Grid container component="div" spacing={2} sx={{ mb: 3 }}>
                <Grid item component="div" xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('profile.lastLogin')}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : t('common.notAvailable')}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item component="div" xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('profile.lastIP')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MapPin size={14} style={{ marginRight: 4 }} />
                      <Typography variant="body1" fontWeight={500}>
                        {user.lastLoginIp || t('common.notAvailable')}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item component="div" xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      bgcolor: user.failedLoginAttempts ? 'error.lighter' : 'inherit',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('profile.failedAttempts')}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color={user.failedLoginAttempts ? 'error.main' : 'inherit'}
                    >
                      {user.failedLoginAttempts || 0}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item component="div" xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('profile.accountStatus')}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color={user.accountStatus === 'ACTIVE' ? 'success.main' : 'error.main'}
                    >
                      {user.accountStatus || t('common.notAvailable')}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                {t('profile.deviceSessions')}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('profile.noActiveSessions')}
              </Typography>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
