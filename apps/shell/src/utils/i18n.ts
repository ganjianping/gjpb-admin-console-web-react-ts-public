import i18n from '../../../shared-lib/src/utils/i18n';

// Shell-specific translations (dashboard)
const shellResources = {
  en: {
    translation: {
      dashboard: {
        title: '📊 Dashboard Overview',
        welcome: 'Welcome back',
        summary: 'Summary',
        updated: 'Updated',
        recentLoginActivity: {
          title: 'Recent Login',
          viewAll: 'View All',
        },
        stats: {
          totalUsers: 'Total Users',
          activeSessions: 'Active Sessions',
          activeUsers: 'Active Users',
          lockedUsers: 'Locked Users',
          suspendedUsers: 'Suspended Users',
          pendingVerification: 'Pending Verification',
        },
        actions: {
          tokenAuth: 'Token Authentication',
          tokenRevoke: 'Token Revocation',
          tokenValidate: 'Token Validation',
          userCreate: 'User Created',
          userUpdate: 'User Updated',
          userDelete: 'User Deleted',
          userAction: 'User Action',
          userLogin: 'User Login',
          userLogout: 'User Logout',
          passwordReset: 'Password Reset',
          roleManagement: 'Role Management',
          auditAccess: 'Audit Log Access',
          dashboardAccess: 'Dashboard Access',
          apiAccess: 'API Access',
        },
        errors: {
          fetchFailed: 'Failed to fetch dashboard statistics',
          loadFailed: 'Failed to load dashboard statistics',
          tryAgain: 'Please try again later.',
        },
        unknownUser: 'Unknown User',
      },
    }
  },
  zh: {
    translation: {
      dashboard: {
        title: '📊 仪表板总览',
        welcome: '欢迎回来',
        summary: '摘要',
        updated: '更新时间',
        recentLoginActivity: {
          title: '最近登陆',
          viewAll: '查看全部',
        },
        stats: {
          totalUsers: '总用户数',
          activeSessions: '活跃会话',
          activeUsers: '活跃用户',
          lockedUsers: '锁定用户',
          suspendedUsers: '暂停用户',
          pendingVerification: '待验证用户',
        },
        actions: {
          tokenAuth: '令牌认证',
          tokenRevoke: '令牌撤销',
          tokenValidate: '令牌验证',
          userCreate: '用户创建',
          userUpdate: '用户更新',
          userDelete: '用户删除',
          userAction: '用户操作',
          userLogin: '用户登录',
          userLogout: '用户登出',
          passwordReset: '密码重置',
          roleManagement: '角色管理',
          auditAccess: '审计日志访问',
          dashboardAccess: '仪表板访问',
          apiAccess: 'API访问',
        },
        errors: {
          fetchFailed: '获取仪表板统计信息失败',
          loadFailed: '加载仪表板统计信息失败',
          tryAgain: '请稍后重试。',
        },
        unknownUser: '未知用户',
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
