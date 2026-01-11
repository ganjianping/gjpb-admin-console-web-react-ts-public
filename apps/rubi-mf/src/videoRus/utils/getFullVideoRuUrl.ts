// no UI imports required here

/**
 * Build a fully qualified videoRu URL.
 * - Returns the input if it is already an absolute URL.
 * - Otherwise prepends the `videoRu_base_url` setting stored in localStorage.
 */
export function getFullVideoRuUrl(videoRuPath?: string | null): string {
  if (!videoRuPath) {
    return '';
  }

  if (videoRuPath.startsWith('http')) {
    return videoRuPath;
  }
 
  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string }>;
      const baseSetting = appSettings.find((setting) => setting.name === 'videoRu_base_url');
      if (baseSetting?.value) {
        const normalizedBase = baseSetting.value.endsWith('/')
          ? baseSetting.value.slice(0, -1)
          : baseSetting.value;
        const normalizedPath = videoRuPath.startsWith('/')
          ? videoRuPath.slice(1)
          : videoRuPath;

        return `${normalizedBase}/${normalizedPath}`;
      }
    }
  } catch {
    // Swallow errors and fall back to the original path.
  }

  return videoRuPath;
}

export default getFullVideoRuUrl;
