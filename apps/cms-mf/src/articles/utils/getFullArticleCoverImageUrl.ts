import { ARTICLE_COVER_IMAGE_BASE_URL_KEY } from '../constants';

/**
 * Build a fully qualified article cover image URL.
 * Mirrors the behavior of the audio helper while using the article-specific base URL setting.
 */
export const getFullArticleCoverImageUrl = (imagePath?: string | null): string => {
  if (!imagePath) {
    return '';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string }>;
  const baseSetting = appSettings.find((setting) => setting.name === ARTICLE_COVER_IMAGE_BASE_URL_KEY);
      if (baseSetting?.value) {
        const normalizedBase = baseSetting.value.endsWith('/')
          ? baseSetting.value.slice(0, -1)
          : baseSetting.value;
        const normalizedPath = imagePath.startsWith('/')
          ? imagePath.slice(1)
          : imagePath;

        return `${normalizedBase}/${normalizedPath}`;
      }
    }
  } catch {
    // Swallow errors and return original path.
  }

  return imagePath;
};

export default getFullArticleCoverImageUrl;
