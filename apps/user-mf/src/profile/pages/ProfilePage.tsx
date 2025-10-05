import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Tabs, Tab } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import shared components and services
import { useNotification } from '../../../../shared-lib/src/data-management';

// Import types and services
import type { User as UserType } from '../../users/services/userService';

// Import notification component
import { NotificationSnackbar } from '../../users/components/NotificationSnackbar';

// Import profile components
import { 
  ProfilePageSkeleton,
  ProfileHeader,
  PersonalInfoForm,
  SecurityForm,
} from '../components';

// Import hooks and types
import { useProfileHandlers } from '../hooks/useProfileHandlers';
import { profileSchema, passwordSchema } from '../types/profile.types';
import type { ProfileFormData, PasswordFormData } from '../types/profile.types';

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

// ProfilePage component
interface ProfilePageProps {
  user?: UserType | null;
}

const ProfilePage = ({ user: propUser }: ProfilePageProps = {}) => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { showSuccess, showError, snackbar, hideNotification } = useNotification();
  
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

  // Use profile handlers hook
  const { handleProfileUpdate, handlePasswordChange } = useProfileHandlers({
    user: user || null,
    profileForm,
    passwordForm,
    showSuccess,
    showError,
    setIsUpdatingProfile,
    setIsChangingPassword,
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

  // If user data is not available, show skeleton
  if (!user) {
    return <ProfilePageSkeleton />;
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Profile Header */}
      <ProfileHeader user={user} />
      
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
          </Tabs>
        </Box>
        
        <CardContent>
          {/* Personal Info Tab */}
          <TabPanel value={tabIndex} index={0}>
            <PersonalInfoForm 
              form={profileForm}
              isUpdating={isUpdatingProfile}
              onSubmit={handleProfileUpdate}
            />
          </TabPanel>
          
          {/* Security Tab */}
          <TabPanel value={tabIndex} index={1}>
            <SecurityForm 
              form={passwordForm}
              isChanging={isChangingPassword}
              onSubmit={handlePasswordChange}
            />
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
