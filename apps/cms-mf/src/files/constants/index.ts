export const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: 'Chinese' },
];

export const FILE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
};

// Explicit typing so usage sites (createStatusChip) get the expected color union
export const STATUS_MAPS: {
  active: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }>;
} = {
  active: {
    true: { label: 'Active', color: 'success' },
    false: { label: 'Inactive', color: 'default' },
  },
};
