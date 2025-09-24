import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { APP_CONFIG } from './config';

// English translations
const enResources = {
  app: {
    title: 'Admin Console',
  },
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    actions: 'Actions',
    clearAll: 'Clear All',
    searchFilters: 'Search Filters',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
    view: 'View',
    goBack: 'Go Back',
    goHome: 'Go Home',
    viewAll: 'View All',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    userMenu: 'User Menu',
    collapseSidebar: 'Collapse Sidebar',
    expandSidebar: 'Expand Sidebar',
    notAvailable: 'Not Available',
    apply: 'Apply',
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    selectDateRange: 'Select Date Range',
    dateRange: 'Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    createdBy: 'Created By',
    updatedBy: 'Updated By',
  },
  errors: {
    notFound: 'Page not found',
    serverError: 'Server error occurred',
    networkError: 'Network error. Please check your connection.',
    pageNotFoundMessage: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    unauthorized: 'Unauthorized Access',
    unauthorizedTitle: 'You do not have permission to access this page',
    unauthorizedMessage: 'If you believe you should have access to this page, please contact your administrator.',
  },
  theme: {
    toggle: 'Toggle theme',
    light: 'Light mode',
    dark: 'Dark mode',
    colorTheme: 'Color theme',
    colors: {
      blue: 'Blue',
      purple: 'Purple',
      green: 'Green',
      orange: 'Orange',
      red: 'Red',
    },
  },
};

// Chinese translations
const zhResources = {
  app: {
    title: '管理控制台',
  },
  common: {
    loading: '加载中...',
    error: '发生错误',
    retry: '重试',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    all: '全部',
    actions: '操作',
    clearAll: '清除全部',
    searchFilters: '搜索筛选',
    yes: '是',
    no: '否',
    close: '关闭',
    view: '查看',
    goBack: '返回',
    goHome: '回到首页',
    viewAll: '查看全部',
    lightMode: '亮色模式',
    darkMode: '暗色模式',
    language: '语言',
    notifications: '通知',
    userMenu: '用户菜单',
    collapseSidebar: '收起侧边栏',
    expandSidebar: '展开侧边栏',
    notAvailable: '不可用',
    apply: '应用',
    today: '今天',
    yesterday: '昨天',
    last7Days: '最近7天',
    last30Days: '最近30天',
    thisMonth: '本月',
    lastMonth: '上月',
    selectDateRange: '选择日期范围',
    dateRange: '日期范围',
    startDate: '开始日期',
    endDate: '结束日期',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    createdBy: '创建者',
    updatedBy: '更新者',
  },
  errors: {
    notFound: '页面不存在',
    serverError: '服务器错误',
    networkError: '网络错误，请检查您的连接。',
    pageNotFoundMessage: '您要查找的页面可能已被删除、更名或暂时不可用。',
    unauthorized: '无访问权限',
    unauthorizedTitle: '您无权访问此页面',
    unauthorizedMessage: '如果您认为自己应该有权访问此页面，请联系管理员。',
  },
  theme: {
    toggle: '切换主题',
    light: '浅色模式',
    dark: '深色模式',
    colorTheme: '颜色主题',
    colors: {
      blue: '蓝色',
      purple: '紫色',
      green: '绿色',
      orange: '橙色',
      red: '红色',
    },
  },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enResources,
      },
      zh: {
        translation: zhResources,
      },
    },
    lng: APP_CONFIG.DEFAULT_LANGUAGE,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'gjpb_language',
    },
    debug: import.meta.env.DEV, // Enable debug logs in development
    keySeparator: '.',
    nsSeparator: ':',
    returnEmptyString: false,
    returnNull: false,
  }).catch(err => console.error('i18n initialization error:', err));

// Check if i18n has been initialized correctly
if (!i18n.isInitialized) {
  console.warn('i18n has not been properly initialized!');
}

export default i18n;