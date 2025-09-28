import i18n from '../../../shared-lib/src/utils/i18n';

// Shell-specific translations (dashboard) - cleaned up to contain only used translations
const shellResources = {
  en: {
    translation: {
      dashboard: {
        welcome: 'Welcome back',
        userInfo: {
          title: 'User Information',
          email: 'Email',
          mobile: 'Mobile',
          accountStatus: 'Account Status',
          loginActivity: 'Login Activity',
          lastLogin: 'Last Login',
          lastLoginIp: 'Last Login IP',
          failedAttempts: 'Failed Login Attempts',
          lastFailedLogin: 'Last Failed Login',
          roles: 'User Roles',
          never: 'Never',
          notAvailable: 'Not available',
        },
      },
      navigation: {
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        users: 'Users',
        roles: 'Roles',
      },
      common: {
        goBack: 'Go Back',
        goHome: 'Go Home',
        userMenu: 'User Menu',
        collapseSidebar: 'Collapse Sidebar',
        expandSidebar: 'Expand Sidebar',
      },
      errors: {
        notFound: 'Page Not Found',
        pageNotFoundMessage: 'The page you are looking for does not exist.',
        unauthorized: '401',
        unauthorizedTitle: 'Unauthorized Access',
        unauthorizedMessage: 'You do not have permission to access this page.',
      },
    }
  },
  zh: {
    translation: {
      dashboard: {
        welcome: '欢迎回来',
        userInfo: {
          title: '用户信息',
          email: '电子邮件',
          mobile: '手机号码',
          accountStatus: '账户状态',
          loginActivity: '登录活动',
          lastLogin: '最近登录',
          lastLoginIp: '最近登录IP',
          failedAttempts: '登录失败次数',
          lastFailedLogin: '最近登录失败',
          roles: '用户角色',
          never: '从未',
          notAvailable: '不可用',
        },
      },
      navigation: {
        dashboard: '仪表板',
        profile: '个人资料',
        settings: '设置',
        logout: '退出登录',
        users: '用户管理',
        roles: '角色管理',
      },
      common: {
        goBack: '返回',
        goHome: '回到首页',
        userMenu: '用户菜单',
        collapseSidebar: '收起侧边栏',
        expandSidebar: '展开侧边栏',
      },
      errors: {
        notFound: '页面未找到',
        pageNotFoundMessage: '您要查找的页面不存在。',
        unauthorized: '401',
        unauthorizedTitle: '未授权访问',
        unauthorizedMessage: '您没有权限访问此页面。',
      },
    }
  }
};

// Add shell-specific resources to the shared i18n instance
Object.entries(shellResources).forEach(([lng, namespaces]) => {
  Object.entries(namespaces).forEach(([ns, resources]) => {
    i18n.addResourceBundle(lng, ns, resources, true, true);
  });
});

export default i18n;