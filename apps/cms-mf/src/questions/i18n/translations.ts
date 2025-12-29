import i18n from '../../../../shared-lib/src/i18n/i18n';

const enTranslations = {
  questions: {
    title: 'Questions',
    subtitle: 'Manage questions and answers',
    pageTitle: 'Question Management',
    create: 'Create Question',
    edit: 'Edit Question',
    delete: 'Delete Question',
    view: 'View Question',
    fields: {
      question: 'Question',
      answer: 'Answer',
      tags: 'Tags',
      language: 'Language',
      displayOrder: 'Order',
      status: 'Status',
      isActive: 'Active',
      updatedAt: 'Updated At',
    },
    placeholders: {
      searchQuestion: 'Search by question',
      searchTags: 'Search by tags',
    },
    actions: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
    },
    messages: {
      deleteConfirm: 'Are you sure you want to delete the question',
    },
    helpers: {
      tags: 'Comma separated tags',
    },
  },
};

const zhTranslations = {
  questions: {
    title: '问题',
    subtitle: '管理问题和答案',
    pageTitle: '问题管理',
    create: '创建问题',
    edit: '编辑问题',
    delete: '删除问题',
    view: '查看问题',
    fields: {
      question: '问题',
      answer: '答案',
      tags: '标签',
      language: '语言',
      displayOrder: '排序',
      status: '状态',
      isActive: '激活',
      updatedAt: '更新时间',
    },
    placeholders: {
      searchQuestion: '搜索问题',
      searchTags: '搜索标签',
    },
    actions: {
      view: '查看',
      edit: '编辑',
      delete: '删除',
    },
    messages: {
      deleteConfirm: '您确定要删除问题',
    },
    helpers: {
      tags: '逗号分隔的标签',
    },
  },
};

i18n.addResourceBundle('en', 'translation', enTranslations, true, true);
i18n.addResourceBundle('zh', 'translation', zhTranslations, true, true);

export default i18n;
