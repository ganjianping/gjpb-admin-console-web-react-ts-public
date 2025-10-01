import i18n from '../../../../shared-lib/src/utils/i18n';
import '../../shared/utils/i18n'; // Import shared user-mf translations

// User-specific translations
const userTranslations = {
  en: {
    users: {
      // Page title and navigation
      title: 'Users',
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
        deleteUser: 'Delete User',
        title: 'Users',
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
      
      // Search placeholders
      placeholders: {
        searchByUsername: 'Search by username',
        searchByEmail: 'Search by email',
        searchByMobile: 'Search by mobile number',
      },
      
      // Status filter options
      statusOptions: {
        all: 'All Status',
        active: 'Active',
        locked: 'Locked',
        suspended: 'Suspended',
        pendingVerification: 'Pending Verification',
      },
      
      // Role filter options
      roleOptions: {
        all: 'All Roles',
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
      deleteWarning: 'This action will permanently delete the user account and all associated data.',
      noUsersFound: 'No users found',
      noEmail: 'No email provided',
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
    profile: {
      title: 'Profile',
      tabs: {
        personal: 'Personal Information',
        security: 'Security',
      },
      form: {
        nickname: 'Display Name',
        email: 'Email Address',
        countryCode: 'Country Code',
        mobileNumber: 'Mobile Number',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
      },
      changePassword: 'Change Password',
      updatePassword: 'Update Password',
      noEmailProvided: 'No email provided',
      defaultRole: 'User',
      profileUpdateSuccess: 'Profile updated successfully',
      profileUpdateError: 'Failed to update profile',
      passwordChangeSuccess: 'Password changed successfully',
      passwordChangeError: 'Failed to change password',
    },
  },
  zh: {
    users: {
      // 页面标题和导航
      title: '用户',
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
        deleteUser: '删除用户',
        title: '用户',
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
        countryCodeHelper: '手机国家代码（例如：65代表新加坡，1代表美国）',
        
        mobileNumber: '手机号码',
        mobileNumberHelper: '不包含国家代码的手机号码',
        
        accountStatus: '账户状态',
        accountStatusHelper: '用户账户的当前状态',
        
        userRoles: '用户角色',
        userRolesHelper: '分配角色以定义用户权限',
        
        activeStatus: '激活状态',
        activeStatusHelper: '用户账户是否激活',
        
        // 对话框副标题
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
      
      // 搜索占位符
      placeholders: {
        searchByUsername: '按用户名搜索',
        searchByEmail: '按邮箱搜索',
        searchByMobile: '按手机号搜索',
      },
      
      // 状态筛选选项
      statusOptions: {
        all: '所有状态',
        active: '激活',
        locked: '锁定',
        suspended: '暂停',
        pendingVerification: '待验证',
      },
      
      // 角色筛选选项
      roleOptions: {
        all: '所有角色',
      },
      
      // 标签页标签
      tabs: {
        all: '所有用户',
        active: '激活',
        locked: '锁定',
        pending: '待处理',
        suspended: '暂停',
      },
      
      // 消息
      deleteConfirmation: '您确定要删除用户"{{username}}"吗？此操作无法撤销。',
      deleteWarning: '此操作将永久删除用户账户和所有相关数据。',
      noUsersFound: '未找到用户',
      noEmail: '未提供邮箱',
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
        contactMethodProvided: '请提供邮箱或手机号码',
        usernameRequired: '用户名是必填项',
        passwordRequired: '密码是必填项',
        emailInvalid: '请输入有效的邮箱地址',
        mobileNumberInvalid: '请输入有效的手机号码',
        usernameExists: '用户名已存在',
        emailExists: '邮箱已存在',
        mobileExists: '手机号码已存在',
      },
      
      // 加载状态
      loading: {
        users: '正在加载用户...',
        saving: '保存中...',
        deleting: '删除中...',
      },
      
      // 确认对话框
      confirmDeletion: '确认删除',
      actionCannotBeUndone: '此操作无法撤销',
      
      // 空状态
      noUsers: '未找到用户',
      noUsersDescription: '通过创建第一个用户开始',
      
      // 过滤和搜索
      filterBy: '过滤条件',
      sortBy: '排序方式',
      
      // 分页
      showingResults: '显示 {{start}}-{{end}} 项，共 {{total}} 项',
      previousPage: '上一页',
      nextPage: '下一页',
      rowsPerPage: '每页行数',
    },
    profile: {
      title: '个人资料',
      tabs: {
        personal: '个人信息',
        security: '安全设置',
      },
      form: {
        nickname: '显示名称',
        email: '邮箱地址',
        countryCode: '国家代码',
        mobileNumber: '手机号码',
        currentPassword: '当前密码',
        newPassword: '新密码',
        confirmPassword: '确认密码',
      },
      changePassword: '修改密码',
      updatePassword: '更新密码',
      noEmailProvided: '未提供邮箱',
      defaultRole: '用户',
      profileUpdateSuccess: '个人资料更新成功',
      profileUpdateError: '个人资料更新失败',
      passwordChangeSuccess: '密码修改成功',
      passwordChangeError: '密码修改失败',
    },
  },
};

// Add user translations to the shared i18n instance
Object.entries(userTranslations).forEach(([lng, namespaces]) => {
  Object.entries(namespaces).forEach(([ns, resources]) => {
    // Add the resources to the 'translation' namespace instead of 'users' namespace
    i18n.addResourceBundle(lng, 'translation', { [ns]: resources }, true, true);
  });
});

export default i18n;
export { userTranslations };
