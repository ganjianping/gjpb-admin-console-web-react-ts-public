export const STATUS_MAPS: {
  active: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }>;
} = {
  active: {
    true: { label: 'Active', color: 'success' },
    false: { label: 'Inactive', color: 'default' },
  },
};

export const LANGUAGES = [
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: 'Chinese' },
];

export const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export const MULTIPLE_CHOICE_QUESTION_TAG_SETTING_KEY = 'multiple-choice-question-ru-tag';
export const MULTIPLE_CHOICE_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY = 'difficulty_level';
export const MULTIPLE_CHOICE_QUESTION_LANG_SETTING_KEY = 'lang';

export const MULTIPLE_CHOICE_QUESTION_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
};