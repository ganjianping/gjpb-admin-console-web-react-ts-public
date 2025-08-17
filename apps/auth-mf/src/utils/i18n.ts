import i18n from '../../../shared-lib/src/utils/i18n';

// Auth-specific translations
const authResources = {
  en: {
    translation: {
      login: {
        title: 'GJPB Admin Console',
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
        },
        errors: {
          invalidCredentials: 'Invalid credentials',
          accountLocked: 'Account is locked',
          generalError: 'Login failed. Please try again.',
        },
        success: 'Login successful',
      },
      theme: {
        toggle: 'Toggle theme',
        light: 'Light mode',
        dark: 'Dark mode',
        colorTheme: 'Color theme',
        colors: {
          blue: 'Blue',
          purple: 'Purple',
          green: 'Green',
          orange: 'Orange',
          red: 'Red',
        },
      },
    }
  },
  zh: {
    translation: {
      login: {
        title: 'GJPB管理控制台',
        tabs: {
          username: '用户名',
          email: '邮箱',
          mobile: '手机',
        },
        form: {
          username: '用户名',
          email: '邮箱',
          password: '密码',
          countryCode: '区号',
          mobileNumber: '手机号码',
          submit: '登录',
        },
        errors: {
          invalidCredentials: '无效的凭据',
          accountLocked: '账户已锁定',
          generalError: '登录失败。请重试。',
        },
        success: '登录成功',
      },
      theme: {
        toggle: '切换主题',
        light: '浅色模式',
        dark: '深色模式',
        colorTheme: '颜色主题',
        colors: {
          blue: '蓝色',
          purple: '紫色',
          green: '绿色',
          orange: '橙色',
          red: '红色',
        },
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