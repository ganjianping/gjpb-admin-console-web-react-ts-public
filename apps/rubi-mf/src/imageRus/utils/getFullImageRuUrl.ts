/**
 * Build a fully qualified imageRu URL.
 * - Returns the input if it is already an absolute URL.
 * - Otherwise prepends the `imageRu_base_url` setting stored in localStorage.
 */
export function getFullImageRuUrl(imageRuPath?: string | null): string {
  if (!imageRuPath) {
    return '';
  }

  if (imageRuPath.startsWith('http')) {
    return imageRuPath;
  }

  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string }>;
      const baseSetting = appSettings.find((setting) => setting.name === 'imageRu_base_url');

      if (baseSetting?.value) {
        const normalizedBase = baseSetting.value.endsWith('/')
          ? baseSetting.value.slice(0, -1)
          : baseSetting.value;
        const normalizedPath = imageRuPath.startsWith('/')
          ? imageRuPath.slice(1)
          : imageRuPath;

        return `${normalizedBase}/${normalizedPath}`;
      }
    }
  } catch {
    // Swallow errors and fall back to the original path.
  }

  return imageRuPath;
}

export default getFullImageRuUrl;
