import i18n from '../../../shared-lib/src/utils/i18n';

// User management specific translations
const userMfResources = {
  en: {
    translation: {
      users: {
        // Page title and navigation
        pageTitle: 'User Management',
        
        // Dialog titles
        viewUser: 'View User',
        editUser: 'Edit User',
        createUser: 'Create User',
        deleteUser: 'Delete User',
        
        // Table column headers
        username: 'Username',
        nickname: 'Display Name',
        email: 'Email',
        status: 'Status',
        roles: 'Roles',
        lastLogin: 'Last Login',
        active: 'Active',
        mobile: 'Mobile',
        
        // Action buttons
        addUser: 'Add User',
        export: 'Export',
        import: 'Import',
        
        // Action menu items
        actions: {
          view: 'View',
          edit: 'Edit',
          delete: 'Delete',
        },
        
        // Form sections
        basicInformation: 'Basic Information',
        contactInformation: 'Contact Information',
        accountSettings: 'Account Settings',
        
        // Form fields
        form: {
          username: 'Username',
          usernameRequired: 'Username is required',
          usernameHelper: 'Unique identifier for the user',
          
          password: 'Password',
          passwordRequired: 'Password is required',
          passwordHelper: 'Min. 8 characters',
          
          displayName: 'Display Name',
          displayNameHelper: 'Optional display name',
          
          emailAddress: 'Email Address',
          emailHelper: 'For notifications and recovery',
          
          countryCode: 'Country Code',
          countryCodeHelper: 'Mobile country code (e.g., 65 for Singapore, 1 for US)',
          
          mobileNumber: 'Mobile Number',
          mobileNumberHelper: 'Mobile phone number without country code',
          
          accountStatus: 'Account Status',
          accountStatusHelper: 'Current status of the user account',
          
          userRoles: 'User Roles',
          userRolesHelper: 'Assign roles to define user permissions',
          
          activeStatus: 'Active Status',
          activeStatusHelper: 'Whether the user account is active',
        },
        
        // Status values
        statusValues: {
          active: 'Active',
          locked: 'Locked',
          suspended: 'Suspended',
          pending_verification: 'Pending Verification',
        },
        
        // Tab labels
        tabs: {
          all: 'All Users',
          active: 'Active',
          locked: 'Locked',
          pending: 'Pending',
          suspended: 'Suspended',
        },
        
        // Messages
        deleteConfirmation: 'Are you sure you want to delete user "{{username}}"? This action cannot be undone.',
        userCreatedSuccess: 'User created successfully',
        userUpdatedSuccess: 'User updated successfully',
        userDeletedSuccess: 'User deleted successfully',
        
        // Error messages
        errors: {
          loadFailed: 'Failed to load users',
          createFailed: 'Failed to create user',
          updateFailed: 'Failed to update user',
          deleteFailed: 'Failed to delete user',
          validationError: 'Validation error',
        },
        
        // Loading states
        loading: {
          users: 'Loading users...',
          saving: 'Saving...',
          deleting: 'Deleting...',
        },
        
        // Confirmation dialog
        confirmDeletion: 'Confirm Deletion',
        actionCannotBeUndone: 'This action cannot be undone',
        
        // Empty states
        noUsers: 'No users found',
        noUsersDescription: 'Get started by creating your first user',
        
        // Filters and search
        searchPlaceholder: 'Search users...',
        filterBy: 'Filter by',
        sortBy: 'Sort by',
        
        // Pagination
        showingResults: 'Showing {{start}}-{{end}} of {{total}} results',
        previousPage: 'Previous page',
        nextPage: 'Next page',
        rowsPerPage: 'Rows per page',
      },
      
      roles: {
        // Page title and navigation
        title: 'Roles',
        pageTitle: 'Role Management',
        
        // Dialog titles
        viewRole: 'View Role',
        editRole: 'Edit Role',
        createRole: 'Create Role',
        deleteRole: 'Delete Role',
        
        // Table column headers
        name: 'Role Name',
        description: 'Description', 
        permissions: 'Permissions',
        userCount: 'Users',
        status: 'Status',
        lastUpdated: 'Last Updated',
        
        // Action buttons
        addRole: 'Add Role',
        export: 'Export',
        
        // Action menu items
        actions: {
          view: 'View',
          edit: 'Edit',
          delete: 'Delete',
        },
        
        // Role form fields
        form: {
          roleName: 'Role Name',
          roleNameHelper: 'Unique name for the role',
          roleCode: 'Role Code',
          description: 'Description',
          descriptionHelper: 'Describe the purpose and scope of this role',
          permissions: 'Permissions',
          permissionsHelper: 'Select the permissions for this role',
          active: 'Active',
          activeStatus: 'Active Status',
          activeStatusHelper: 'Whether this role is available for assignment',
        },
        
        // Role messages
        roleCreatedSuccess: 'Role created successfully',
        roleUpdatedSuccess: 'Role updated successfully',
        roleDeletedSuccess: 'Role deleted successfully',
        deleteConfirmation: 'Are you sure you want to delete role "{{roleName}}"?',
        deleteWarning: 'Warning: This role is assigned to {{userCount}} user(s). Deleting it will remove their permissions.',
        
        // Search and filters
        searchRoles: 'Search roles...',
        
        errors: {
          loadFailed: 'Failed to load roles',
          createFailed: 'Failed to create role',
          updateFailed: 'Failed to update role',
          deleteFailed: 'Failed to delete role',
        },
      },
    }
  },
  zh: {
    translation: {
      users: {
        // 页面标题和导航
        pageTitle: '用户管理',
        
        // 对话框标题
        viewUser: '查看用户',
        editUser: '编辑用户',
        createUser: '创建用户',
        deleteUser: '删除用户',
        
        // 表格列标题
        username: '用户名',
        nickname: '显示名称',
        email: '邮箱',
        status: '状态',
        roles: '角色',
        lastLogin: '最后登录',
        active: '激活',
        mobile: '手机',
        
        // 操作按钮
        addUser: '添加用户',
        export: '导出',
        import: '导入',
        
        // 操作菜单项
        actions: {
          view: '查看',
          edit: '编辑',
          delete: '删除',
        },
        
        // 表单部分
        basicInformation: '基本信息',
        contactInformation: '联系信息',
        accountSettings: '账户设置',
        
        // 表单字段
        form: {
          username: '用户名',
          usernameRequired: '用户名是必填项',
          usernameHelper: '用户的唯一标识符',
          
          password: '密码',
          passwordRequired: '密码是必填项',
          passwordHelper: '最少8个字符',
          
          displayName: '显示名称',
          displayNameHelper: '可选的显示名称',
          
          emailAddress: '邮箱地址',
          emailHelper: '用于通知和恢复',
          
          countryCode: '国家代码',
          countryCodeHelper: '手机国家代码（例如：中国86，新加坡65，美国1）',
          
          mobileNumber: '手机号码',
          mobileNumberHelper: '不包含国家代码的手机号码',
          
          accountStatus: '账户状态',
          accountStatusHelper: '用户账户的当前状态',
          
          userRoles: '用户角色',
          userRolesHelper: '分配角色以定义用户权限',
          
          activeStatus: '激活状态',
          activeStatusHelper: '用户账户是否处于激活状态',
        },
        
        // 状态值
        statusValues: {
          active: '激活',
          locked: '锁定',
          suspended: '暂停',
          pending_verification: '待验证',
        },
        
        // 标签页标签
        tabs: {
          all: '所有用户',
          active: '激活',
          locked: '锁定',
          pending: '待验证',
          suspended: '暂停',
        },
        
        // 消息
        deleteConfirmation: '您确定要删除用户"{{username}}"吗？此操作无法撤销。',
        userCreatedSuccess: '用户创建成功',
        userUpdatedSuccess: '用户更新成功',
        userDeletedSuccess: '用户删除成功',
        
        // 错误消息
        errors: {
          loadFailed: '加载用户失败',
          createFailed: '创建用户失败',
          updateFailed: '更新用户失败',
          deleteFailed: '删除用户失败',
          validationError: '验证错误',
        },
        
        // 加载状态
        loading: {
          users: '正在加载用户...',
          saving: '正在保存...',
          deleting: '正在删除...',
        },
        
        // 确认对话框
        confirmDeletion: '确认删除',
        actionCannotBeUndone: '此操作无法撤销',
        
        // 空状态
        noUsers: '未找到用户',
        noUsersDescription: '通过创建您的第一个用户开始',
        
        // 过滤器和搜索
        searchPlaceholder: '搜索用户...',
        filterBy: '筛选条件',
        sortBy: '排序方式',
        
        // 分页
        showingResults: '显示第{{start}}-{{end}}项，共{{total}}项结果',
        previousPage: '上一页',
        nextPage: '下一页',
        rowsPerPage: '每页行数',
      },
      
      roles: {
        // 页面标题和导航
        title: '角色',
        pageTitle: '角色管理',
        
        // 对话框标题
        viewRole: '查看角色',
        editRole: '编辑角色',
        createRole: '创建角色',
        deleteRole: '删除角色',
        
        // 表格列标题
        name: '角色名称',
        description: '描述',
        permissions: '权限',
        userCount: '用户数',
        status: '状态',
        lastUpdated: '最后更新',
        
        // 操作按钮
        addRole: '添加角色',
        export: '导出',
        
        // 操作菜单项
        actions: {
          view: '查看',
          edit: '编辑',
          delete: '删除',
        },
        
        // 角色表单字段
        form: {
          roleName: '角色名称',
          roleNameHelper: '角色的唯一名称',
          roleCode: '角色代码',
          description: '描述',
          descriptionHelper: '描述此角色的目的和范围',
          permissions: '权限',
          permissionsHelper: '选择此角色的权限',
          active: '激活',
          activeStatus: '激活状态',
          activeStatusHelper: '此角色是否可用于分配',
        },
        
        // 角色消息
        roleCreatedSuccess: '角色创建成功',
        roleUpdatedSuccess: '角色更新成功',
        roleDeletedSuccess: '角色删除成功',
        deleteConfirmation: '您确定要删除角色"{{roleName}}"吗？',
        deleteWarning: '警告：此角色已分配给{{userCount}}个用户。删除它将移除他们的权限。',
        
        // 搜索和过滤
        searchRoles: '搜索角色...',
        
        errors: {
          loadFailed: '加载角色失败',
          createFailed: '创建角色失败',
          updateFailed: '更新角色失败',
          deleteFailed: '删除角色失败',
        },
      },
    }
  }
};

// Add user-mf specific resources to the shared i18n instance
Object.entries(userMfResources).forEach(([lng, namespaces]) => {
  Object.entries(namespaces).forEach(([ns, resources]) => {
    i18n.addResourceBundle(lng, ns, resources, true, true);
  });
});

export default i18n;
