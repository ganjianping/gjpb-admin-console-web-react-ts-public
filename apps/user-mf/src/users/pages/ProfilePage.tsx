import { useEffect, useState } from 'react';
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
  useTheme,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Shield, Lock, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Initialize user-mf translations
import '../utils/i18n';

// Import shared components and services - use user-mf's re-exports
import { useNotification } from '../../shared/hooks';

// Import user types and interfaces
import type { User as UserType } from '../services/userService';
import { profileService } from '../services/profileService';
import type { UpdateProfileRequest, ChangePasswordRequest } from '../services/profileService';

// Import notification component
import { NotificationSnackbar } from '../components/NotificationSnackbar';

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
function TabPanel(props: Readonly<TabPanelProps>) {
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
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

// ProfilePage component with user prop for flexibility
interface ProfilePageProps {
  user?: UserType | null;
}

const ProfilePage = ({ user: propUser }: ProfilePageProps = {}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { showSuccess, showError, snackbar, hideNotification } = useNotification();
  
  // Use prop user if provided, otherwise we'll need to get current user
  // For now, we'll assume user is passed as a prop from shell
  const user = propUser;
  
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

  // Update form defaults when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        nickname: user.nickname || '',
        email: user.email || '',
        mobileCountryCode: user.mobileCountryCode || '',
        mobileNumber: user.mobileNumber || '',
      });
    }
  }, [user, profileForm]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Helper function to build error messages
  const buildErrorMessage = (baseMessage: string, error: any): string => {
    if (error.response?.data?.status?.message) {
      return `${baseMessage}: ${error.response.data.status.message}`;
    }
    if (error.message) {
      return `${baseMessage}: ${error.message}`;
    }
    return baseMessage;
  };

  // Helper function to update local storage user info
  const updateLocalStorageUserInfo = (updatedData: Partial<UserType>) => {
    try {
      const currentUserInfo = localStorage.getItem('gjpb_user_info');
      if (currentUserInfo) {
        const userData = JSON.parse(currentUserInfo);
        const updatedUserData = { ...userData, ...updatedData };
        localStorage.setItem('gjpb_user_info', JSON.stringify(updatedUserData));
        console.log('Local storage user info updated:', updatedUserData);
      }
    } catch (error) {
      console.error('Failed to update local storage user info:', error);
    }
  };

  // Helper function to get updated fields for success message
  const getUpdatedFields = (data: ProfileFormData): string[] => {
    const updatedFields = [];
    if (data.nickname !== user?.nickname) updatedFields.push(t('profile.form.nickname'));
    if (data.email !== user?.email) updatedFields.push(t('profile.form.email'));
    if (data.mobileCountryCode !== user?.mobileCountryCode || data.mobileNumber !== user?.mobileNumber) {
      updatedFields.push(t('profile.form.mobileNumber'));
    }
    return updatedFields;
  };

  // Handle profile update
  const handleProfileUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    setIsUpdatingProfile(true);
    try {
      // Prepare the update data
      const updateData: UpdateProfileRequest = {
        nickname: data.nickname,
        email: data.email,
        mobileCountryCode: data.mobileCountryCode || undefined,
        mobileNumber: data.mobileNumber || undefined,
      };

      // Call the API to update the profile
      const response = await profileService.updateProfile(updateData);
      
      if (response.status.code === 200) {
        // Update local storage with new user info
        updateLocalStorageUserInfo({
          nickname: data.nickname,
          email: data.email,
          mobileCountryCode: data.mobileCountryCode || '',
          mobileNumber: data.mobileNumber || '',
        });
        
        // Show detailed success message
        const updatedFields = getUpdatedFields(data);
        const successMessage = updatedFields.length > 0 
          ? `${t('profile.updateSuccess')}: ${updatedFields.join(', ')}`
          : t('profile.updateSuccess');
          
        showSuccess(successMessage);
        console.log('Profile updated successfully:', response.data);
      } else {
        console.error('Profile update failed:', response.status);
        const errorMessage = response.status.message 
          ? `${t('profile.updateError')}: ${response.status.message}`
          : t('profile.updateError');
        showError(errorMessage);
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = buildErrorMessage(t('profile.updateError'), error);
      showError(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle password change
  const handlePasswordChange: SubmitHandler<PasswordFormData> = async (data) => {
    setIsChangingPassword(true);
    try {
      // Validate passwords match (extra client-side validation)
      if (data.newPassword !== data.confirmPassword) {
        showError(t('profile.passwordMismatchError'));
        return;
      }

      // Prepare the password change data
      const passwordData: ChangePasswordRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      // Call the API to change the password
      const response = await profileService.changePassword(passwordData);
      
      if (response.status.code === 200) {
        // Reset form on success
        passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Show detailed success message with security note
        showSuccess(`${t('profile.passwordChangeSuccess')} ${t('profile.passwordChangeSecurityNote')}`);
        console.log('Password changed successfully');
      } else {
        console.error('Password change failed:', response.status);
        const errorMessage = response.status.message 
          ? `${t('profile.passwordChangeError')}: ${response.status.message}`
          : t('profile.passwordChangeError');
        showError(errorMessage);
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      const errorMessage = buildErrorMessage(t('profile.passwordChangeError'), error);
      showError(errorMessage);
    } finally {
      setIsChangingPassword(false);
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
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: "auto" }}>
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
          
          <Grid size={{ xs: 12, sm: "grow" }}>
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
                  {user.roles?.map(role => role.code || role.name).join(', ') || 'User'}
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
                <Grid size={{ xs: 12, md: 6 }}>
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
                        slotProps={{
                          input: {
                            startAdornment: (
                              <User size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                            ),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
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
                        slotProps={{
                          input: {
                            startAdornment: (
                              <Mail size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                            ),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
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
                
                <Grid size={{ xs: 12, md: 9 }}>
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
                        slotProps={{
                          input: {
                            startAdornment: (
                              <Phone size={18} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                            ),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!profileForm.formState.isDirty || profileForm.formState.isSubmitting || isUpdatingProfile}
                      sx={{ py: 1, px: 4 }}
                    >
                      {isUpdatingProfile ? t('common.saving') : t('common.save')}
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
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    {t('profile.changePassword')}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
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
                
                <Grid size={{ xs: 12, md: 6 }}></Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
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
                
                <Grid size={{ xs: 12, md: 6 }}>
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

                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!passwordForm.formState.isDirty || passwordForm.formState.isSubmitting || isChangingPassword}
                      sx={{ py: 1, px: 4 }}
                    >
                      {isChangingPassword ? t('common.updating') : t('profile.updatePassword')}
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
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                      {t('profile.failedAttempts')}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                    >
                      0
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                      color={user.accountStatus === 'active' ? 'success.main' : 'error.main'}
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

      {/* Toast Notifications */}
      <NotificationSnackbar
        snackbar={snackbar}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default ProfilePage;