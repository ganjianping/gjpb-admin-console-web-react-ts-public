export const STATUS_MAPS: {
  active: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }>;
} = {
  active: {
    true: { label: 'Active', color: 'success' },
    false: { label: 'Inactive', color: 'default' },
  },
};

export const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: 'Chinese' },
];

export const DIFFICULTY_LEVEL_OPTIONS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

export const EXPRESSION_RU_TAG_SETTING_KEY = 'expression_ru_tags';
export const EXPRESSION_LANG_SETTING_KEY = 'lang';
export const EXPRESSION_DIFFICULTY_LEVEL_SETTING_KEY = 'difficulty_level';

export const EXPRESSION_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
};
