import i18n from '../../../../shared-lib/src/i18n/i18n';

// Audit logs feature translations
const auditLogsTranslations = {
  en: {
    translation: {
      auditLogs: {
        title: 'Audit Logs',
        timestamp: 'Timestamp',
        action: 'Action',
        user: 'User',
        userId: 'User ID',
        resource: 'Resource',
        resourceType: 'Resource Type',
        resourceId: 'Resource ID',
        detailsLabel: 'Details',
        ipAddress: 'IP Address',
        userAgent: 'User Agent',
        statusLabel: 'Status',
        success: 'Success',
        failure: 'Failure',
        searchLogs: 'Search logs...',
        export: 'Export',
        viewDetails: 'View Details',
        smartFilteringTooltip: 'Smart filtering enabled',
        active: 'active',
        noLogsFound: 'No audit logs found',
        columns: {
          dateTime: 'Date/Time',
          request: 'Request',
          responseTime: 'Response Time',
          result: 'Result',
          username: 'Username',
          ipAddress: 'IP Address',
          endpoint: 'Endpoint',
        },
        filters: {
          dateRange: 'Date Range',
          from: 'From',
          to: 'To',
          action: 'Action',
          user: 'User',
          status: 'Status',
          searchByUsername: 'Search by username...',
          endpoint: 'Endpoint',
          httpMethod: 'HTTP Method',
          ipAddress: 'IP Address',
          responseTime: 'Response Time',
        },
        methods: {
          all: 'All Methods',
          get: 'GET',
          post: 'POST',
          put: 'PUT',
          delete: 'DELETE',
        },
        status: {
          all: 'All Results',
          success: 'Success',
          failed: 'Failed',
        },
        details: {
          title: 'Audit Log Details',
          id: 'ID',
          userId: 'User ID',
          username: 'Username',
          httpMethod: 'HTTP Method',
          endpoint: 'Endpoint',
          requestId: 'Request ID',
          result: 'Result',
          statusCode: 'Status Code',
          errorMessage: 'Error Message',
          ipAddress: 'IP Address',
          sessionId: 'Session ID',
          duration: 'Duration',
          timestamp: 'Timestamp',
          userAgent: 'User Agent',
        },
        actions: {
          create: 'Create',
          update: 'Update',
          delete: 'Delete',
          login: 'Login',
          logout: 'Logout',
          view: 'View',
        },
      },
    },
  },
  zh: {
    translation: {
      auditLogs: {
        title: '审计日志',
        timestamp: '时间戳',
        action: '操作',
        user: '用户',
        userId: '用户ID',
        resource: '资源',
        resourceType: '资源类型',
        resourceId: '资源ID',
        detailsLabel: '详情',
        ipAddress: 'IP地址',
        userAgent: '用户代理',
        statusLabel: '状态',
        success: '成功',
        failure: '失败',
        searchLogs: '搜索日志...',
        export: '导出',
        viewDetails: '查看详情',
        smartFilteringTooltip: '智能过滤已启用',
        active: '活跃',
        noLogsFound: '未找到审计日志',
        columns: {
          dateTime: '日期/时间',
          request: '请求',
          responseTime: '响应时间',
          result: '结果',
          username: '用户名',
          ipAddress: 'IP地址',
          endpoint: '端点',
        },
        filters: {
          dateRange: '日期范围',
          from: '从',
          to: '到',
          action: '操作',
          user: '用户',
          status: '状态',
          searchByUsername: '按用户名搜索...',
          endpoint: '端点',
          httpMethod: 'HTTP方法',
          ipAddress: 'IP地址',
          responseTime: '响应时间',
        },
        methods: {
          all: '所有方法',
          get: 'GET',
          post: 'POST',
          put: 'PUT',
          delete: 'DELETE',
        },
        status: {
          all: '所有结果',
          success: '成功',
          failed: '失败',
        },
        details: {
          title: '审计日志详情',
          id: 'ID',
          userId: '用户ID',
          username: '用户名',
          httpMethod: 'HTTP方法',
          endpoint: '端点',
          requestId: '请求ID',
          result: '结果',
          statusCode: '状态码',
          errorMessage: '错误消息',
          ipAddress: 'IP地址',
          sessionId: '会诜ID',
          duration: '持续时间',
          timestamp: '时间戳',
          userAgent: '用户代理',
        },
        actions: {
          create: '创建',
          update: '更新',
          delete: '删除',
          login: '登录',
          logout: '登出',
          view: '查看',
        },
      },
    },
  },
};

// Add audit logs feature resources to the shared i18n instance
const addAuditLogTranslations = () => {
  if (!i18n.isInitialized) {
    console.warn('[AuditLogs i18n] i18n not initialized yet, waiting...');
    i18n.on('initialized', () => {
      console.log('[AuditLogs i18n] i18n initialized, adding translations');
      addResources();
    });
  } else {
    console.log('[AuditLogs i18n] Adding translations to initialized i18n');
    addResources();
  }
};

const addResources = () => {
  Object.entries(auditLogsTranslations).forEach(([lng, namespaces]) => {
    Object.entries(namespaces).forEach(([ns, resources]) => {
      i18n.addResourceBundle(lng, ns, resources, true, true);
      console.log(`[AuditLogs i18n] Added ${lng}/${ns} translations`);
    });
  });
  
  console.log('[AuditLogs i18n] Sample check - auditLogs.title:', i18n.t('auditLogs.title'));
  console.log('[AuditLogs i18n] Sample check - common.showSearch:', i18n.t('common.showSearch'));
  console.log('[AuditLogs i18n] Sample check - common.hideSearch:', i18n.t('common.hideSearch'));
};

addAuditLogTranslations();

export { auditLogsTranslations };
export default i18n;
