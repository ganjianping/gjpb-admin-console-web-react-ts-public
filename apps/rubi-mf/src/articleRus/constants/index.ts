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

export const ARTICLE_TAG_SETTING_KEY = 'articleRu_tags';
export const ARTICLE_LANG_SETTING_KEY = 'lang';
export const ARTICLE_COVER_IMAGE_BASE_URL_KEY = 'articleRu_cover_image_base_url';

export const ARTICLE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
};

