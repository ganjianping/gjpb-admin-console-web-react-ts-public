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

// Add app settings translations to i18n
i18n.addResourceBundle('en', 'translation', enTranslations, true, true);

export default i18n;
