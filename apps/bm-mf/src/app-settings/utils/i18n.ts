import i18n from 'i18next';

// English translations for app settings
const enTranslations = {
  appSettings: {
    title: 'App Settings',
    subtitle: 'Manage application configuration settings',
    create: 'Create Setting',
    edit: 'Edit Setting',
    delete: 'Delete Setting',
    view: 'View Setting',
    search: 'Search Settings',
    clearFilters: 'Clear Filters',
    noSettingsFound: 'No app settings found',
    columns: {
      name: 'Name',
      value: 'Value',
      lang: 'Language',
      isSystem: 'System',
      isPublic: 'Public',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      createdBy: 'Created By',
      updatedBy: 'Updated By',
    },
    form: {
      name: 'Setting Name',
      value: 'Setting Value',
      lang: 'Language',
      isSystem: 'Is System Setting',
      isPublic: 'Is Public Setting',
      namePlaceholder: 'Enter setting name',
      valuePlaceholder: 'Enter setting value',
      langPlaceholder: 'Select language',
    },
    filters: {
      searchByName: 'Search by name...',
      language: 'Language',
      systemSettings: 'System Settings',
      publicSettings: 'Public Settings',
      all: 'All',
      systemOnly: 'System Only',
      nonSystem: 'Non-System',
      publicOnly: 'Public Only',
      private: 'Private',
    },
    actions: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      save: 'Save',
      cancel: 'Cancel',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
    },
    messages: {
      createSuccess: 'App setting created successfully',
      updateSuccess: 'App setting updated successfully',
      deleteSuccess: 'App setting deleted successfully',
      deleteConfirm: 'Are you sure you want to delete this app setting?',
      deleteWarning: 'This action cannot be undone.',
    },
    errors: {
      loadFailed: 'Failed to load app settings',
      createFailed: 'Failed to create app setting',
      updateFailed: 'Failed to update app setting',
      deleteFailed: 'Failed to delete app setting',
      nameRequired: 'Setting name is required',
      valueRequired: 'Setting value is required',
      langRequired: 'Language is required',
    },
    validation: {
      nameMinLength: 'Setting name must be at least 2 characters',
      nameMaxLength: 'Setting name must be less than 100 characters',
      valueMaxLength: 'Setting value must be less than 1000 characters',
    },
  },
};

// Chinese translations for app settings
const zhTranslations = {
  appSettings: {
    title: '应用设置',
    subtitle: '管理应用程序配置设置',
    create: '创建设置',
    edit: '编辑设置',
    delete: '删除设置',
    view: '查看设置',
    search: '搜索设置',
    clearFilters: '清除筛选器',
    noSettingsFound: '未找到应用设置',
    columns: {
      name: '名称',
      value: '值',
      lang: '语言',
      isSystem: '系统',
      isPublic: '公开',
      createdAt: '创建时间',
      updatedAt: '更新时间',
      createdBy: '创建者',
      updatedBy: '更新者',
    },
    form: {
      name: '设置名称',
      value: '设置值',
      lang: '语言',
      isSystem: '是系统设置',
      isPublic: '是公开设置',
      namePlaceholder: '输入设置名称',
      valuePlaceholder: '输入设置值',
      langPlaceholder: '选择语言',
    },
    filters: {
      searchByName: '按名称搜索...',
      language: '语言',
      systemSettings: '系统设置',
      publicSettings: '公开设置',
      all: '全部',
      systemOnly: '仅系统',
      nonSystem: '非系统',
      publicOnly: '仅公开',
      private: '私有',
    },
    actions: {
      view: '查看',
      edit: '编辑',
      delete: '删除',
      create: '创建',
      save: '保存',
      cancel: '取消',
    },
    status: {
      active: '激活',
      inactive: '非激活',
    },
    messages: {
      createSuccess: '应用设置创建成功',
      updateSuccess: '应用设置更新成功',
      deleteSuccess: '应用设置删除成功',
      deleteConfirm: '您确定要删除此应用设置吗？',
      deleteWarning: '此操作不能撤销。',
    },
    errors: {
      loadFailed: '加载应用设置失败',
      createFailed: '创建应用设置失败',
      updateFailed: '更新应用设置失败',
      deleteFailed: '删除应用设置失败',
      nameRequired: '设置名称为必填项',
      valueRequired: '设置值为必填项',
      langRequired: '语言为必填项',
    },
    validation: {
      nameMinLength: '设置名称至少需要2个字符',
      nameMaxLength: '设置名称必须少于100个字符',
      valueMaxLength: '设置值必须少于1000个字符',
    },
  },
};

// Add app settings translations to i18n
i18n.addResourceBundle('en', 'translation', enTranslations, true, true);
i18n.addResourceBundle('zh', 'translation', zhTranslations, true, true);

export default i18n;
