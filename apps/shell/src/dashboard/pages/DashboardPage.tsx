import { Box } from '@mui/material';
import { useEffect } from 'react';

// Firebase Performance
import { useFirebasePerformance } from '../../../../shared-lib/src/firebase/useFirebasePerformance';

// Store
import { useAppSelector, useAppDispatch } from '../../core/hooks/useRedux';
import { selectCurrentUser, updateUserProfile } from '../../authentication/store/authSlice';

// Components
import {
  WelcomeCard,
  BasicInfoCard,
  LoginActivityCard,
  RolesCard,
  UserPreferencesCard,
} from '../components';

const DashboardPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  
  // Firebase Performance tracking for dashboard page
  useFirebasePerformance('dashboard', user?.username);
  
  // Sync user data from localStorage on component mount to reflect profile updates
  useEffect(() => {
    const syncUserData = () => {
      try {
        const storedUserInfo = localStorage.getItem('gjpb_user_info');
        if (storedUserInfo && user) {
          const userData = JSON.parse(storedUserInfo);
          // Check if stored data is different from current Redux state
          if (userData.nickname !== user.nickname || 
              userData.email !== user.email || 
              userData.mobileCountryCode !== user.mobileCountryCode ||
              userData.mobileNumber !== user.mobileNumber) {
            // Update Redux store with latest data from localStorage
            dispatch(updateUserProfile({
              nickname: userData.nickname,
              email: userData.email,
              mobileCountryCode: userData.mobileCountryCode,
              mobileNumber: userData.mobileNumber,
            }));
            console.log('Dashboard: Synced user data from localStorage');
          }
        }
      } catch (error) {
        console.error('Failed to sync user data from localStorage:', error);
      }
    };

    // Sync on mount
    syncUserData();

    // Sync when page becomes visible (user navigates back from profile)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncUserData();
      }
    };

    // Sync when window gains focus
    const handleFocus = () => {
      syncUserData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, dispatch]);

  if (!user) {
    return null;
  }

  const displayName = user.nickname ?? user.username;

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      p: { xs: 1, sm: 1, md: 1 },
    }}>
      {/* Welcome Section */}
      <WelcomeCard displayName={displayName} />

      {/* User Information Section */}
      <Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          mb: 3 
        }}>
          {/* Basic Information Card */}
          <Box sx={{ flex: 1 }}>
            <BasicInfoCard user={user} />
          </Box>

          {/* Login Information Card */}
          <Box sx={{ flex: 1 }}>
            <LoginActivityCard user={user} />
          </Box>

        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3, 
          mb: 3 
        }}>

          {/* Roles Information Card */}
          <Box sx={{ flex: 1 }}>
            <RolesCard roleCodes={user.roleCodes || []} />
          </Box>


          {/* User Preferences Card */}
          <Box sx={{ flex: 1 }}>
            <UserPreferencesCard />
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;