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
        updatedAt: 'Updated',
        
        // Action buttons
        addUser: 'Add User',
        export: 'Export',
        import: 'Import',
        showSearch: 'Search',
        hideSearch: 'Hide Search',
        
        // Action menu items
        actions: {
          view: 'View',
          edit: 'Edit',
          delete: 'Delete',
          createUser: 'Create User',
          viewUser: 'View User',
          editUser: 'Edit User',
        },
        
        // Form field labels
        fields: {
          username: 'Username',
          password: 'Password',
          newPassword: 'New Password',
          newPasswordHint: 'Leave blank to keep current password',
          nickname: 'Display Name',
          email: 'Email',
          mobileCountryCode: 'Country Code',
          mobileNumber: 'Mobile Number',
          accountStatus: 'Account Status',
          active: 'Active Status',
          roles: 'Roles',
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
          
          nickName: 'Nick Name',
          
          id: 'User ID',
          lastLoginAt: 'Last Login Time',
          lastLoginIp: 'Last Login IP',
          passwordChangeAt: 'Password Changed At',
          createdAt: 'Created At',
          updatedAt: 'Updated At',
          
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
          
          // Dialog subtitles
          viewUserDetails: 'View user details',
          modifyUserInfo: 'Modify user information',
          addNewUser: 'Add new user to system',
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
        noUsersFound: 'No users found',
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
          contactMethodProvided: 'Please provide either email or mobile number',
          usernameRequired: 'Username is required',
          passwordRequired: 'Password is required',
          emailInvalid: 'Please enter a valid email address',
          mobileNumberInvalid: 'Please enter a valid mobile number',
          usernameExists: 'Username already exists',
          emailExists: 'Email already exists',
          mobileExists: 'Mobile number already exists',
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
        
        // Form sections
        basicInformation: 'Basic Information',
        statusSettings: 'Status Settings',
        
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
          
          // Dialog subtitles
          viewRoleDetails: 'View role details and permissions',
          modifyRoleInfo: 'Modify role information and permissions',
          addNewRole: 'Add new role to system',
          confirmDeletion: 'Remove role from system',
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
      
      // Common translations
      common: {
        active: 'Active',
        inactive: 'Inactive',
        yes: 'Yes',
        no: 'No',
        all: 'All',
        status: 'Status',
        actions: 'Actions',
        search: 'Search',
        clear: 'Clear',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        create: 'Create',
        update: 'Update',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
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
        updatedAt: '更新时间',
        
        // 操作按钮
        addUser: '添加用户',
        export: '导出',
        import: '导入',
        showSearch: '搜索',
        hideSearch: '隐藏搜索',
        
        // 操作菜单项
        actions: {
          view: '查看',
          edit: '编辑',
          delete: '删除',
          createUser: '创建用户',
          viewUser: '查看用户',
          editUser: '编辑用户',
        },
        
        // 表单字段标签
        fields: {
          username: '用户名',
          password: '密码',
          newPassword: '新密码',
          newPasswordHint: '留空以保持当前密码',
          nickname: '显示名称',
          email: '邮箱',
          mobileCountryCode: '国家代码',
          mobileNumber: '手机号码',
          accountStatus: '账户状态',
          active: '激活状态',
          roles: '角色',
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
          
          nickName: '昵称',
          
          id: '用户ID',
          lastLoginAt: '最后登录时间',
          lastLoginIp: '最后登录IP',
          passwordChangeAt: '密码修改时间',
          createdAt: '创建时间',
          updatedAt: '更新时间',
          
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
          
          // Dialog subtitles
          viewUserDetails: '查看用户详情',
          modifyUserInfo: '修改用户信息',
          addNewUser: '添加新用户到系统',
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
        noUsersFound: '未找到用户',
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
          contactMethodProvided: '请提供邮箱或手机号',
          usernameRequired: '用户名为必填项',
          passwordRequired: '密码为必填项',
          emailInvalid: '请输入有效的邮箱地址',
          mobileNumberInvalid: '请输入有效的手机号',
          usernameExists: '用户名已存在',
          emailExists: '邮箱已存在',
          mobileExists: '手机号已存在',
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
        
        // 表单部分
        basicInformation: '基本信息',
        statusSettings: '状态设置',
        
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
          
          // 对话框副标题
          viewRoleDetails: '查看角色详情和权限',
          modifyRoleInfo: '修改角色信息和权限',
          addNewRole: '添加新角色到系统',
          confirmDeletion: '从系统中移除角色',
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
      
      // 通用翻译
      common: {
        active: '激活',
        inactive: '未激活',
        yes: '是',
        no: '否',
        all: '全部',
        status: '状态',
        actions: '操作',
        search: '搜索',
        clear: '清空',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        edit: '编辑',
        delete: '删除',
        view: '查看',
        create: '创建',
        update: '更新',
        loading: '加载中...',
        success: '成功',
        error: '错误',
        warning: '警告',
        info: '信息',
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
