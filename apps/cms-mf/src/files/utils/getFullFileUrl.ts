/**
 * Build a fully qualified file URL.
 * - Returns the input if it is already an absolute URL.
 * - Otherwise prepends the `file_base_url` setting stored in localStorage.
 */
export function getFullFileUrl(imagePath?: string | null): string {
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
      const baseSetting = appSettings.find((setting) => setting.name === 'file_base_url');

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
    // Swallow errors and fall back to the original path.
  }

  return imagePath;
}

export default getFullFileUrl;
