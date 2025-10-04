import i18n from '../../../../shared-lib/src/i18n/i18n';

// Role-specific translations
const roleTranslations = {
  en: {
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
      code: 'Code',
      level: 'Level',
      systemRole: 'System Role',
      permissions: 'Permissions',
      userCount: 'Users',
      status: 'Status',
      lastUpdated: 'Last Updated',
      
      // Action buttons
      addRole: 'Add Role',
      export: 'Export',
      showSearch: 'Search',
      hideSearch: 'Hide Search',
      
      // Action menu items
      actions: {
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        createRole: 'Create Role',
        viewRole: 'View Role',
        editRole: 'Edit Role',
        deleteRole: 'Delete Role',
        title: 'Roles',
      },
      
      // Form sections
      basicInformation: 'Basic Information',
      statusSettings: 'Status Settings',
      
      // Status values
      statusValues: {
        active: 'Active',
        inactive: 'Inactive',
      },
      
      // Role form fields
      form: {
        roleName: 'Role Name',
        roleNameHelper: 'Unique name for the role',
        roleCode: 'Role Code',
        level: 'Level',
        sortOrder: 'Sort Order',
        parentRole: 'Parent Role',
        systemRole: 'System Role',
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
      
      // Success and error messages
      messages: {
        createSuccess: 'Role created successfully',
        updateSuccess: 'Role updated successfully',
        deleteSuccess: 'Role deleted successfully',
        createError: 'Failed to create role',
        updateError: 'Failed to update role',
        deleteError: 'Failed to delete role',
        validationError: 'Please correct the errors below',
      },
      
      // Search and filters
      searchRoles: 'Search roles...',
      filterBy: 'Filter by',
      sortBy: 'Sort by',
      systemRoleOnly: 'System Roles Only',
      customRoleOnly: 'Custom Roles Only',
      
      // Empty states
      noRoles: 'No roles found',
      noRolesDescription: 'Get started by creating your first role',
      
      // Confirmation dialog
      confirmDeletion: 'Confirm Deletion',
      actionCannotBeUndone: 'This action cannot be undone',
      
      // Loading states
      loading: {
        roles: 'Loading roles...',
        saving: 'Saving...',
        deleting: 'Deleting...',
      },
      
      // Pagination
      showingResults: 'Showing {{start}}-{{end}} of {{total}} results',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      rowsPerPage: 'Rows per page',
      
      errors: {
        loadFailed: 'Failed to load roles',
        createFailed: 'Failed to create role',
        updateFailed: 'Failed to update role',
        deleteFailed: 'Failed to delete role',
      },
    },
  },
  zh: {
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
      code: '代码',
      level: '级别',
      systemRole: '系统角色',
      permissions: '权限',
      userCount: '用户数',
      status: '状态',
      lastUpdated: '最后更新',
      
      // 操作按钮
      addRole: '添加角色',
      export: '导出',
      showSearch: '搜索',
      hideSearch: '隐藏搜索',
      
      // 操作菜单项
      actions: {
        view: '查看',
        edit: '编辑',
        delete: '删除',
        createRole: '创建角色',
        viewRole: '查看角色',
        editRole: '编辑角色',
        deleteRole: '删除角色',
        title: '角色',
      },
      
      // 表单部分
      basicInformation: '基本信息',
      statusSettings: '状态设置',
      
      // 状态值
      statusValues: {
        active: '激活',
        inactive: '未激活',
      },
      
      // 角色表单字段
      form: {
        roleName: '角色名称',
        roleNameHelper: '角色的唯一名称',
        roleCode: '角色代码',
        level: '级别',
        sortOrder: '排序',
        parentRole: '父角色',
        systemRole: '系统角色',
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
      
      // 成功和错误消息
      messages: {
        createSuccess: '角色创建成功',
        updateSuccess: '角色更新成功',
        deleteSuccess: '角色删除成功',
        createError: '创建角色失败',
        updateError: '更新角色失败',
        deleteError: '删除角色失败',
        validationError: '请修正以下错误',
      },
      
      // 搜索和过滤
      searchRoles: '搜索角色...',
      filterBy: '过滤条件',
      sortBy: '排序方式',
      systemRoleOnly: '仅系统角色',
      customRoleOnly: '仅自定义角色',
      
      // 空状态
      noRoles: '未找到角色',
      noRolesDescription: '通过创建第一个角色开始',
      
      // 确认对话框
      confirmDeletion: '确认删除',
      actionCannotBeUndone: '此操作无法撤销',
      
      // 加载状态
      loading: {
        roles: '正在加载角色...',
        saving: '保存中...',
        deleting: '删除中...',
      },
      
      // 分页
      showingResults: '显示 {{start}}-{{end}} 项，共 {{total}} 项',
      previousPage: '上一页',
      nextPage: '下一页',
      rowsPerPage: '每页行数',
      
      errors: {
        loadFailed: '加载角色失败',
        createFailed: '创建角色失败',
        updateFailed: '更新角色失败',
        deleteFailed: '删除角色失败',
      },
    },
  },
};

// Add role translations to the shared i18n instance
Object.entries(roleTranslations).forEach(([lng, namespaces]) => {
  Object.entries(namespaces).forEach(([ns, resources]) => {
    // Add the resources to the 'translation' namespace instead of 'roles' namespace
    i18n.addResourceBundle(lng, 'translation', { [ns]: resources }, true, true);
  });
});

export default i18n;
export { roleTranslations };
