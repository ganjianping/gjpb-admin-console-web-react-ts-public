import i18n from '../../../../shared-lib/src/i18n/i18n';

console.log('🔵 [Profile i18n] translations.ts file loaded at:', new Date().toISOString());

// Profile feature translations - v1.0.1 (Updated: 2025-10-04)
const profileTranslations = {
  en: {
    translation: {
      profile: {
        title: 'Profile',
        personalInfo: 'Personal Information',
        username: 'Username',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
        phoneNumber: 'Phone Number',
        role: 'Role',
        defaultRole: 'User',
        department: 'Department',
        lastLogin: 'Last Login',
        accountStatus: 'Account Status',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        updateProfile: 'Update Profile',
        updatePassword: 'Update Password',
        noEmailProvided: 'No email provided',
        updateSuccess: 'Profile updated successfully',
        updateError: 'Failed to update profile',
        passwordChangeSuccess: 'Password changed successfully',
        passwordChangeError: 'Failed to change password',
        passwordChangeSecurityNote: 'For security, please login again with your new password.',
        passwordMismatchError: 'Passwords do not match',
        tabs: {
          personal: 'Personal Information',
          security: 'Security',
        },
        form: {
          nickname: 'Nickname',
          email: 'Email',
          countryCode: 'Country Code',
          mobileNumber: 'Mobile Number',
          currentPassword: 'Current Password',
          newPassword: 'New Password',
          confirmPassword: 'Confirm Password',
        },
      },
    },
  },
  zh: {
    translation: {
      profile: {
        title: '个人资料',
        personalInfo: '个人信息',
        username: '用户名',
        email: '邮箱',
        firstName: '名',
        lastName: '姓',
        phoneNumber: '电话号码',
        role: '角色',
        defaultRole: '用户',
        department: '部门',
        lastLogin: '上次登录',
        accountStatus: '账户状态',
        changePassword: '更改密码',
        currentPassword: '当前密码',
        newPassword: '新密码',
        confirmPassword: '确认密码',
        updateProfile: '更新资料',
        updatePassword: '更新密码',
        noEmailProvided: '未提供邮箱',
        updateSuccess: '资料更新成功',
        updateError: '资料更新失败',
        passwordChangeSuccess: '密码修改成功',
        passwordChangeError: '密码修改失败',
        passwordChangeSecurityNote: '为了安全，请使用新密码重新登录。',
        passwordMismatchError: '密码不匹配',
        tabs: {
          personal: '个人信息',
          security: '安全',
        },
        form: {
          nickname: '昵称',
          email: '邮箱',
          countryCode: '国家代码',
          mobileNumber: '手机号码',
          currentPassword: '当前密码',
          newPassword: '新密码',
          confirmPassword: '确认密码',
        },
      },
    },
  },
};

// Add profile feature resources to the shared i18n instance
const addProfileTranslations = () => {
  console.log('🟢 [Profile i18n] addProfileTranslations called, i18n.isInitialized:', i18n.isInitialized);
  
  if (!i18n.isInitialized) {
    console.warn('🟡 [Profile i18n] i18n not initialized yet, waiting...');
    i18n.on('initialized', () => {
      console.log('🟢 [Profile i18n] i18n initialized event received, adding translations');
      addResources();
    });
  } else {
    console.log('🟢 [Profile i18n] i18n already initialized, adding translations immediately');
    addResources();
  }
};

const addResources = () => {
  console.log('🔵 [Profile i18n] addResources called, about to add translations...');
  
  Object.entries(profileTranslations).forEach(([lng, namespaces]) => {
    Object.entries(namespaces).forEach(([ns, resources]) => {
      i18n.addResourceBundle(lng, ns, resources, true, true);
      console.log(`✅ [Profile i18n] Added ${lng}/${ns} translations`);
    });
  });
  
  console.log('🎉 [Profile i18n] All translations added successfully');
  
  // Debug: Check if translations are available
  if (i18n.hasResourceBundle('en', 'translation')) {
    const enResources = i18n.getResourceBundle('en', 'translation');
    console.log('🔍 [Profile i18n] Verification - profile.tabs.personal:', enResources?.profile?.tabs?.personal);
    console.log('🔍 [Profile i18n] Verification - profile.form.nickname:', enResources?.profile?.form?.nickname);
    console.log('🔍 [Profile i18n] Verification - profile.updatePassword:', enResources?.profile?.updatePassword);
  } else {
    console.error('❌ [Profile i18n] ERROR: No resource bundle found for en/translation');
  }
};

// Initialize translations when this module is imported
console.log('🚀 [Profile i18n] Calling addProfileTranslations now...');
addProfileTranslations();
console.log('✨ [Profile i18n] addProfileTranslations call completed');

export { profileTranslations };
export default i18n;
