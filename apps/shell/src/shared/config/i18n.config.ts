import i18n from '../../../../shared-lib/src/features/i18n/i18n';

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
      settings: {
        title: 'System Settings',
        description: 'System environment variables and global configuration settings',
        envVariables: {
          title: 'Environment Variables',
          subtitle: 'Vite runtime environment variables',
        },
        globalConfig: {
          title: 'Global Configuration',
          subtitle: 'APP_CONFIG application configuration',
        },
        buildInfo: {
          title: 'Build Information',
          subtitle: 'Runtime environment and build details',
          environment: 'Environment',
          development: 'Development',
          production: 'Production',
          version: 'Version',
          yes: 'Yes',
          no: 'No',
        },
        table: {
          variable: 'Variable',
          value: 'Value',
        },
      },
      auditLogs: {
        title: 'Audit Logs',
      },
      appSettings: {
        title: 'App Settings',
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
      settings: {
        title: '系统设置',
        description: '系统环境变量和全局配置设置',
        envVariables: {
          title: '环境变量',
          subtitle: 'Vite运行时环境变量',
        },
        globalConfig: {
          title: '全局配置',
          subtitle: 'APP_CONFIG应用程序配置',
        },
        buildInfo: {
          title: '构建信息',
          subtitle: '运行时环境和构建详细信息',
          environment: '环境',
          development: '开发环境',
          production: '生产环境',
          version: '版本',
          yes: '是',
          no: '否',
        },
        table: {
          variable: '变量',
          value: '值',
        },
      },
      auditLogs: {
        title: '审计日志',
      },
      appSettings: {
        title: '应用设置',
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