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

export const PART_OF_SPEECH_OPTIONS = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
  { value: 'preposition', label: 'Preposition' },
  { value: 'pronoun', label: 'Pronoun' },
  { value: 'conjunction', label: 'Conjunction' },
  { value: 'interjection', label: 'Interjection' },
];

export const VOCABULARY_TAG_SETTING_KEY = 'vocabulary_tags';
export const VOCABULARY_PART_OF_SPEECH_SETTING_KEY = 'part_of_speech';
export const VOCABULARY_LANG_SETTING_KEY = 'lang';
export const VOCABULARY_WORD_IMAGE_BASE_URL_KEY = 'vocabulary_word_image_base_url';
export const VOCABULARY_PHONETIC_AUDIO_BASE_URL_KEY = 'vocabulary_phonetic_audio_base_url';

export const VOCABULARY_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
};
