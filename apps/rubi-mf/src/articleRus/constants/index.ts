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

export const TERM_OPTIONS = [
  { value: 1, label: 'Term 1' },
  { value: 2, label: 'Term 2' },
  { value: 3, label: 'Term 3' },
  { value: 4, label: 'Term 4' },
];

export const WEEK_OPTIONS = [
  { value: 1, label: 'Week 1' },
  { value: 2, label: 'Week 2' },
  { value: 3, label: 'Week 3' },
  { value: 4, label: 'Week 4' },
  { value: 5, label: 'Week 5' },
  { value: 6, label: 'Week 6' },
  { value: 7, label: 'Week 7' },
  { value: 8, label: 'Week 8' },
  { value: 9, label: 'Week 9' },
  { value: 10, label: 'Week 10' },
  { value: 11, label: 'Week 11' },
  { value: 12, label: 'Week 12' },
  { value: 13, label: 'Week 13' },
  { value: 14, label: 'Week 14' },
];

export const ARTICLE_TAG_SETTING_KEY = 'article_ru_tags';
export const ARTICLE_LANG_SETTING_KEY = 'lang';
export const ARTICLE_COVER_IMAGE_BASE_URL_KEY = 'articleRu_cover_image_base_url';

export const ARTICLE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
};

