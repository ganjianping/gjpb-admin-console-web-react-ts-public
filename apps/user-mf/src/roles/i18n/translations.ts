import i18n from '../../../../shared-lib/src/i18n/i18n';

// Roles feature translations
const rolesTranslations = {
  en: {
    translation: {
      common: {
        searchFilters: 'Search Filters',
        clearAll: 'Clear All',
        search: 'Search',
        loading: 'Loading...',
        save: 'Save',
        saving: 'Saving...',
        updating: 'Updating...',
        create: 'Create',
        notAvailable: 'Not Available',
      },
      roles: {
        name: 'Role Name',
        description: 'Description',
        permissions: 'Permissions',
        userCount: 'Users',
        status: 'Status',
        code: 'Role Code',
        level: 'Level',
        systemRole: 'System Role',
        active: 'Active',
        lastUpdated: 'Last Updated',
        pageTitle: 'Roles Management',
        addRole: 'Add Role',
        editRole: 'Edit Role',
        viewRole: 'View Role',
        createRole: 'Create Role',
        deleteRole: 'Delete Role',
        searchRoles: 'Search roles...',
        export: 'Export',
        showSearch: 'Show Search',
        hideSearch: 'Hide Search',
        filterBy: 'Filter By',
        systemRoleOnly: 'System Roles Only',
        customRoleOnly: 'Custom Roles Only',
        deleteConfirmation: 'Are you sure you want to delete role "{{roleName}}"?',
        deleteWarning: 'This role is currently assigned to {{userCount}} user(s). Deleting it will remove the role from all users.',
        actionCannotBeUndone: 'This action cannot be undone.',
        statusValues: {
          active: 'Active',
          inactive: 'Inactive',
        },
        actions: {
          view: 'View',
          edit: 'Edit',
          delete: 'Delete',
        },
        form: {
          viewRoleDetails: 'View role details',
          modifyRoleInfo: 'Modify role information',
          confirmDeletion: 'Confirm deletion',
          addNewRole: 'Add new role',
          roleName: 'Role Name',
          description: 'Description',
          roleCode: 'Role Code',
          level: 'Level',
          systemRole: 'System Role',
          activeStatus: 'Active Status',
          sortOrder: 'Sort Order',
          parentRole: 'Parent Role',
        },
        messages: {
          createSuccess: 'Role created successfully',
          updateSuccess: 'Role updated successfully',
          deleteSuccess: 'Role deleted successfully',
          validationError: 'Please correct the errors below',
        },
      },
    },
  },
  zh: {
    translation: {
      common: {
        searchFilters: '搜索筛选',
        clearAll: '清除全部',
        search: '搜索',
        loading: '加载中...',
        save: '保存',
        saving: '保存中...',
        updating: '更新中...',
        create: '创建',
        notAvailable: '不可用',
      },
      roles: {
        name: '角色名称',
        description: '描述',
        permissions: '权限',
        userCount: '用户数',
        status: '状态',
        code: '角色代码',
        level: '级别',
        systemRole: '系统角色',
        active: '启用',
        lastUpdated: '最后更新',
        pageTitle: '角色管理',
        addRole: '添加角色',
        editRole: '编辑角色',
        viewRole: '查看角色',
        createRole: '创建角色',
        deleteRole: '删除角色',
        searchRoles: '搜索角色...',
        export: '导出',
        showSearch: '显示搜索',
        hideSearch: '隐藏搜索',
        filterBy: '筛选条件',
        systemRoleOnly: '仅系统角色',
        customRoleOnly: '仅自定义角色',
        deleteConfirmation: '确定要删除角色 "{{roleName}}" 吗？',
        deleteWarning: '此角色当前分配给 {{userCount}} 个用户。删除它将从所有用户中移除该角色。',
        actionCannotBeUndone: '此操作无法撤销。',
        statusValues: {
          active: '启用',
          inactive: '禁用',
        },
        actions: {
          view: '查看',
          edit: '编辑',
          delete: '删除',
        },
        form: {
          viewRoleDetails: '查看角色详情',
          modifyRoleInfo: '修改角色信息',
          confirmDeletion: '确认删除',
          addNewRole: '添加新角色',
          roleName: '角色名称',
          description: '描述',
          roleCode: '角色代码',
          level: '级别',
          systemRole: '系统角色',
          activeStatus: '启用状态',
          sortOrder: '排序',
          parentRole: '父角色',
        },
        messages: {
          createSuccess: '角色创建成功',
          updateSuccess: '角色更新成功',
          deleteSuccess: '角色删除成功',
          validationError: '请纠正以下错误',
        },
      },
    },
  },
};

// Add roles feature resources to the shared i18n instance
const addRoleTranslations = () => {
  if (!i18n.isInitialized) {
    console.warn('[Roles i18n] i18n not initialized yet, waiting...');
    i18n.on('initialized', () => {
      console.log('[Roles i18n] i18n initialized, adding translations');
      addResources();
    });
  } else {
    console.log('[Roles i18n] Adding translations to initialized i18n');
    addResources();
  }
};

const addResources = () => {
  Object.entries(rolesTranslations).forEach(([lng, namespaces]) => {
    Object.entries(namespaces).forEach(([ns, resources]) => {
      i18n.addResourceBundle(lng, ns, resources, true, true);
      console.log(`[Roles i18n] Added ${lng}/${ns} translations`);
    });
  });
  
  console.log('[Roles i18n] Sample check - roles.name:', i18n.t('roles.name'));
};

addRoleTranslations();

export { rolesTranslations };
export default i18n;
