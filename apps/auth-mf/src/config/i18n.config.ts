import i18n from '../../../shared-lib/src/i18n/i18n';

// Auth-specific translations
const authResources = {
  en: {
    translation: {
      common: {
        language: 'Language',
        theme: 'Theme',
        settings: 'Settings',
      },
      theme: {
        light: 'Light',
        dark: 'Dark',
        colors: {
          blue: 'Blue',
          purple: 'Purple',
          green: 'Green',
          orange: 'Orange',
          red: 'Red',
        },
      },
      auth: {
        unauthorized: 'You are not authorized to access this page',
        sessionExpired: 'Your session has expired, please log in again',
      },
      login: {
        title: 'Admin Console',
        tabs: {
          username: 'Username',
          email: 'Email',
          mobile: 'Mobile',
        },
        form: {
          username: 'Username',
          email: 'Email',
          password: 'Password',
          countryCode: 'Code',
          mobileNumber: 'Mobile Number',
          submit: 'Login',
          forgotPassword: 'Forgot password?',
        },
        errors: {
          invalidCredentials: 'Invalid credentials',
          accountLocked: 'Account is locked',
          generalError: 'Login failed. Please try again.',
        },
        success: 'Login successful',
      },
    }
  },
  zh: {
    translation: {
      common: {
        language: '语言',
        theme: '主题',
        settings: '设置',
      },
      theme: {
        light: '浅色',
        dark: '深色',
        colors: {
          blue: '蓝色',
          purple: '紫色',
          green: '绿色',
          orange: '橙色',
          red: '红色',
        },
      },
      auth: {
        unauthorized: '您无权访问此页面',
        sessionExpired: '会话已过期，请重新登录',
      },
      login: {
        title: '登录管理控制台',
        tabs: {
          username: '用户名',
          email: '电子邮箱',
          mobile: '手机',
        },
        form: {
          username: '用户名',
          email: '电子邮箱',
          password: '密码',
          countryCode: '区号',
          mobileNumber: '手机号码',
          submit: '登录',
          forgotPassword: '忘记密码？',
        },
        errors: {
          invalidCredentials: '无效的凭据',
          accountLocked: '账户已锁定',
          generalError: '登录失败。请重试。',
        },
        success: '登录成功',
      },
    }
  }
};

// Add auth-specific resources to the shared i18n instance
Object.entries(authResources).forEach(([lng, namespaces]) => {
  Object.entries(namespaces).forEach(([ns, resources]) => {
    i18n.addResourceBundle(lng, ns, resources, true, true);
  });
});

export default i18n;