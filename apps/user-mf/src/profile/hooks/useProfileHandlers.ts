import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';
import { profileService } from '../services/profileService';
import type { UpdateProfileRequest, ChangePasswordRequest } from '../services/profileService';
import type { ProfileFormData, PasswordFormData } from '../types/profile.types';
import type { User } from '../../users/services/userService';

interface UseProfileHandlersProps {
  user: User | null;
  profileForm: UseFormReturn<ProfileFormData>;
  passwordForm: UseFormReturn<PasswordFormData>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  setIsUpdatingProfile: (value: boolean) => void;
  setIsChangingPassword: (value: boolean) => void;
}

// Helper function to build error messages with specific error details
const buildErrorMessage = (baseMessage: string, error: any): string => {
  if (error.response?.data?.status?.errors?.error) {
    return error.response.data.status.errors.error;
  }
  
  if (error.response?.data?.status?.message) {
    const statusMessage = error.response.data.status.message;
    if (statusMessage === 'Business error') {
      return baseMessage;
    }
    return `${baseMessage}: ${statusMessage}`;
  }
  
  if (error.message) {
    return `${baseMessage}: ${error.message}`;
  }
  
  return baseMessage;
};

// Helper function to update local storage user info
const updateLocalStorageUserInfo = (updatedData: Partial<User>) => {
  try {
    const currentUserInfo = localStorage.getItem('gjpb_user_info');
    if (currentUserInfo) {
      const userData = JSON.parse(currentUserInfo);
      const updatedUserData = { ...userData, ...updatedData };
      localStorage.setItem('gjpb_user_info', JSON.stringify(updatedUserData));
    }
  } catch {
    // Silently handle localStorage errors - not critical for app functionality
  }
};

export const useProfileHandlers = ({
  user,
  profileForm: _profileForm,
  passwordForm,
  showSuccess,
  showError,
  setIsUpdatingProfile,
  setIsChangingPassword,
}: UseProfileHandlersProps) => {
  const { t } = useTranslation();

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
  const handleProfileUpdate = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      const updateData: UpdateProfileRequest = {
        nickname: data.nickname,
        email: data.email,
        mobileCountryCode: data.mobileCountryCode || undefined,
        mobileNumber: data.mobileNumber || undefined,
      };

      const response = await profileService.updateProfile(updateData);
      
      if (response.status.code === 200) {
        updateLocalStorageUserInfo({
          nickname: data.nickname,
          email: data.email,
          mobileCountryCode: data.mobileCountryCode || '',
          mobileNumber: data.mobileNumber || '',
        });
        
        const updatedFields = getUpdatedFields(data);
        const successMessage = updatedFields.length > 0 
          ? `${t('profile.updateSuccess')}: ${updatedFields.join(', ')}`
          : t('profile.updateSuccess');
          
        showSuccess(successMessage);
      } else {
        let errorMessage = t('profile.updateError');
        if (response.status.errors?.error) {
          errorMessage = response.status.errors.error;
        } else if (response.status.message && response.status.message !== 'Business error') {
          errorMessage = `${t('profile.updateError')}: ${response.status.message}`;
        }
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
  const handlePasswordChange = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      if (data.newPassword !== data.confirmPassword) {
        showError(t('profile.passwordMismatchError'));
        return;
      }

      const passwordData: ChangePasswordRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const response = await profileService.changePassword(passwordData);
      
      if (response.status.code === 200) {
        passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        showSuccess(`${t('profile.passwordChangeSuccess')} ${t('profile.passwordChangeSecurityNote')}`);
      } else {
        let errorMessage = t('profile.passwordChangeError');
        if (response.status.errors?.error) {
          errorMessage = response.status.errors.error;
        } else if (response.status.message && response.status.message !== 'Business error') {
          errorMessage = `${t('profile.passwordChangeError')}: ${response.status.message}`;
        }
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

  return {
    handleProfileUpdate,
    handlePasswordChange,
  };
};
