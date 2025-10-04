import i18n from '../../../../shared-lib/src/features/i18n/i18n';

// Shared translations for common elements
const sharedResources = {
  en: {
    translation: {
      
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
        searching: 'Searching...',
        searchFilters: 'Search Filters',
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
        searching: '搜索中...',
        searchFilters: '搜索筛选',
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

// Add shared resources to the shared i18n instance
Object.entries(sharedResources).forEach(([lng, namespaces]) => {
  Object.entries(namespaces).forEach(([ns, resources]) => {
    i18n.addResourceBundle(lng, ns, resources, true, true);
  });
});

export default i18n;
