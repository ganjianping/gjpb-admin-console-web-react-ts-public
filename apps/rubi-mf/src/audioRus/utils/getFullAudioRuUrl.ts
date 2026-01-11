/**
 * Build a fully qualified audioRu URL.
 * - Returns the input if it is already an absolute URL.
 * - Otherwise prepends the `audio_ru_base_url` setting stored in localStorage (if present) or falls back to the original value.
 */
export function getFullAudioRuUrl(audioRuPath?: string | null): string {
  if (!audioRuPath) {
    return '';
  }

  if (audioRuPath.startsWith('http')) {
    return audioRuPath;
  }
 
  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string }>;
      const baseSetting = appSettings.find((setting) => setting.name === 'audio_ru_base_url');
      if (baseSetting?.value) {
        const normalizedBase = baseSetting.value.endsWith('/')
          ? baseSetting.value.slice(0, -1)
          : baseSetting.value;
        const normalizedPath = audioRuPath.startsWith('/')
          ? audioRuPath.slice(1)
          : audioRuPath;

        return `${normalizedBase}/${normalizedPath}`;
      }
    }
  } catch {
    // Swallow errors and fall back to the original path.
  }

  return audioRuPath;
}

export default getFullAudioRuUrl;
