import i18n from '../../../../shared-lib/src/i18n/i18n';

// Users feature translations
const usersTranslations = {
  en: {
    translation: {
      common: {
        searchFilters: 'Search Filters',
        clearAll: 'Clear All',
        search: 'Search',
        searching: 'Searching...',
        loading: 'Loading...',
        save: 'Save',
        saving: 'Saving...',
        updating: 'Updating...',
        create: 'Create',
        notAvailable: 'Not Available',
        active: 'Active',
        inactive: 'Inactive',
      },
      users: {
        pageTitle: 'User Management',
        username: 'Username',
        nickname: 'Nickname',
        fullName: 'Full Name',
        email: 'Email',
        mobile: 'Mobile',
        password: 'Password',
        mobileCountryCode: 'Country Code',
        mobileNumber: 'Mobile Number',
        status: 'Status',
        roles: 'Roles',
        lastLogin: 'Last Login',
        updatedAt: 'Updated At',
        active: 'Active',
        addUser: 'Add User',
        createUser: 'Create User',
        editUser: 'Edit User',
        viewUser: 'View User',
        deleteUser: 'Delete User',
        searchUsers: 'Search users...',
        showSearch: 'Show Search',
        hideSearch: 'Hide Search',
        export: 'Export',
        import: 'Import',
        noUsersFound: 'No users found',
        deleteConfirmation: 'Are you sure you want to delete user "{{username}}"?',
        deleteWarning: 'This action cannot be undone. All user data will be permanently removed.',
        noEmail: 'No email provided',
        tabs: {
          all: 'All Users',
          active: 'Active',
          locked: 'Locked',
          suspended: 'Suspended',
          pending: 'Pending',
        },
        actions: {
          view: 'View',
          edit: 'Edit',
          delete: 'Delete',
          createUser: 'Create User',
          viewUser: 'View User',
          editUser: 'Edit User',
          deleteUser: 'Delete User',
        },
        placeholders: {
          searchByUsername: 'Search by username...',
          searchByEmail: 'Search by email...',
          searchByMobile: 'Search by mobile...',
        },
        statusOptions: {
          all: 'All Status',
          active: 'Active',
          locked: 'Locked',
          suspended: 'Suspended',
          pendingVerification: 'Pending Verification',
        },
        roleOptions: {
          all: 'All Roles',
        },
        fields: {
          username: 'Username',
          nickname: 'Nickname',
          email: 'Email',
          password: 'Password',
          newPassword: 'New Password',
          newPasswordHint: 'Leave blank to keep current password',
          mobileCountryCode: 'Country Code',
          mobileNumber: 'Mobile Number',
          accountStatus: 'Account Status',
          roles: 'Roles',
          active: 'Active',
        },
        form: {
          lastLoginAt: 'Last Login',
          lastLoginIp: 'Last Login IP',
          passwordChangeAt: 'Password Changed At',
          createdAt: 'Created At',
          updatedAt: 'Updated At',
        },
        errors: {
          loadFailed: 'Failed to load users',
          createFailed: 'Failed to create user',
          updateFailed: 'Failed to update user',
          deleteFailed: 'Failed to delete user',
          contactMethodProvided: 'Please provide either email or mobile number',
        },
        userCreatedSuccess: 'User created successfully',
        userUpdatedSuccess: 'User updated successfully',
        userDeletedSuccess: 'User deleted successfully',
      },
    },
  },
  zh: {
    translation: {
      common: {
        searchFilters: '搜索筛选',
        clearAll: '清除全部',
        search: '搜索',
        searching: '搜索中...',
        loading: '加载中...',
        save: '保存',
        saving: '保存中...',
        updating: '更新中...',
        create: '创建',
        notAvailable: '不可用',
        active: '启用',
        inactive: '禁用',
      },
      users: {
        pageTitle: '用户管理',
        username: '用户名',
        nickname: '昵称',
        fullName: '全名',
        email: '邮箱',
        mobile: '手机',
        password: '密码',
        mobileCountryCode: '国家代码',
        mobileNumber: '手机号码',
        status: '状态',
        roles: '角色',
        lastLogin: '最后登录',
        updatedAt: '更新时间',
        active: '启用',
        addUser: '添加用户',
        createUser: '创建用户',
        editUser: '编辑用户',
        viewUser: '查看用户',
        deleteUser: '删除用户',
        searchUsers: '搜索用户...',
        showSearch: '显示搜索',
        hideSearch: '隐藏搜索',
        export: '导出',
        import: '导入',
        noUsersFound: '未找到用户',
        deleteConfirmation: '确定要删除用户 "{{username}}" 吗？',
        deleteWarning: '此操作无法撤销。所有用户数据将被永久删除。',
        noEmail: '未提供邮箱',
        tabs: {
          all: '所有用户',
          active: '活跃',
          locked: '锁定',
          suspended: '挂起',
          pending: '待审核',
        },
        actions: {
          view: '查看',
          edit: '编辑',
          delete: '删除',
          createUser: '创建用户',
          viewUser: '查看用户',
          editUser: '编辑用户',
          deleteUser: '删除用户',
        },
        placeholders: {
          searchByUsername: '按用户名搜索...',
          searchByEmail: '按邮箱搜索...',
          searchByMobile: '按手机号搜索...',
        },
        statusOptions: {
          all: '全部状态',
          active: '启用',
          locked: '锁定',
          suspended: '挂起',
          pendingVerification: '待验证',
        },
        roleOptions: {
          all: '全部角色',
        },
        fields: {
          username: '用户名',
          nickname: '昵称',
          email: '邮箱',
          password: '密码',
          newPassword: '新密码',
          newPasswordHint: '留空以保留当前密码',
          mobileCountryCode: '国家代码',
          mobileNumber: '手机号码',
          accountStatus: '账户状态',
          roles: '角色',
          active: '启用',
        },
        form: {
          lastLoginAt: '最后登录',
          lastLoginIp: '最后登录IP',
          passwordChangeAt: '密码修改时间',
          createdAt: '创建时间',
          updatedAt: '更新时间',
        },
        errors: {
          loadFailed: '加载用户失败',
          createFailed: '创建用户失败',
          updateFailed: '更新用户失败',
          deleteFailed: '删除用户失败',
          contactMethodProvided: '请提供邮箱或手机号码',
        },
        userCreatedSuccess: '用户创建成功',
        userUpdatedSuccess: '用户更新成功',
        userDeletedSuccess: '用户删除成功',
      },
    },
  },
};

// Add users feature resources to the shared i18n instance
const addUserTranslations = () => {
  if (!i18n.isInitialized) {
    console.warn('[Users i18n] i18n not initialized yet, waiting...');
    // If not initialized, wait for initialization
    i18n.on('initialized', () => {
      console.log('[Users i18n] i18n initialized, adding translations');
      addResources();
    });
  } else {
    console.log('[Users i18n] Adding translations to initialized i18n');
    addResources();
  }
};

const addResources = () => {
  Object.entries(usersTranslations).forEach(([lng, namespaces]) => {
    Object.entries(namespaces).forEach(([ns, resources]) => {
      // Use deep: true to merge with existing resources
      i18n.addResourceBundle(lng, ns, resources, true, true);
      console.log(`[Users i18n] Added ${lng}/${ns} translations`);
    });
  });
  
  // Log a sample to verify
  console.log('[Users i18n] Sample check - users.pageTitle:', i18n.t('users.pageTitle'));
};

// Execute the addition
addUserTranslations();

export { usersTranslations };
export default i18n;
