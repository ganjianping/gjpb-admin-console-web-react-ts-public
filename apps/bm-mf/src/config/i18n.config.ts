import i18n from '../../../shared-lib/src/features/i18n/i18n';

// BM-mf specific translations (appSettings)
const bmMfResources = {
  en: {
    translation: {
      appSettings: {
        title: 'App Settings',
        description: 'Manage application settings and configurations',
        list: {
          title: 'App Settings',
          new: 'New Setting',
          edit: 'Edit Setting',
          delete: 'Delete Setting',
          search: 'Search settings...',
          noData: 'No settings found',
          loading: 'Loading settings...',
          error: 'Failed to load settings',
        },
        form: {
          key: 'Key',
          value: 'Value',
          description: 'Description',
          type: 'Type',
          category: 'Category',
          isActive: 'Active',
          save: 'Save',
          cancel: 'Cancel',
          required: 'This field is required',
        },
        actions: {
          create: 'Create Setting',
          update: 'Update Setting',
          delete: 'Delete Setting',
          refresh: 'Refresh',
        },
        messages: {
          createSuccess: 'Setting created successfully',
          updateSuccess: 'Setting updated successfully',
          deleteSuccess: 'Setting deleted successfully',
          createError: 'Failed to create setting',
          updateError: 'Failed to update setting',
          deleteError: 'Failed to delete setting',
        },
      },
    }
  },
  zh: {
    translation: {
      appSettings: {
        title: '应用设置',
        description: '管理应用程序设置和配置',
        list: {
          title: '应用设置',
          new: '新建设置',
          edit: '编辑设置',
          delete: '删除设置',
          search: '搜索设置...',
          noData: '未找到设置',
          loading: '加载设置中...',
          error: '加载设置失败',
        },
        form: {
          key: '键',
          value: '值',
          description: '描述',
          type: '类型',
          category: '类别',
          isActive: '启用',
          save: '保存',
          cancel: '取消',
          required: '此字段为必填项',
        },
        actions: {
          create: '创建设置',
          update: '更新设置',
          delete: '删除设置',
          refresh: '刷新',
        },
        messages: {
          createSuccess: '设置创建成功',
          updateSuccess: '设置更新成功',
          deleteSuccess: '设置删除成功',
          createError: '创建设置失败',
          updateError: '更新设置失败',
          deleteError: '删除设置失败',
        },
      },
    }
  }
};

// Add bm-mf specific resources to the shared i18n instance
Object.entries(bmMfResources).forEach(([lng, namespaces]) => {
  Object.entries(namespaces).forEach(([ns, resources]) => {
    i18n.addResourceBundle(lng, ns, resources, true, true);
  });
});

export default i18n;
