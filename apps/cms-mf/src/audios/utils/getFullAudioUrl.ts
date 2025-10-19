/**
 * Build a fully qualified audio URL.
 * - Returns the input if it is already an absolute URL.
 * - Otherwise prepends the `audio_base_url` setting stored in localStorage (if present) or falls back to the original value.
 */
export function getFullAudioUrl(audioPath?: string | null): string {
  if (!audioPath) {
    return '';
  }

  if (audioPath.startsWith('http')) {
    return audioPath;
  }
 
  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string }>;
      const baseSetting = appSettings.find((setting) => setting.name === 'audio_base_url');
      if (baseSetting?.value) {
        const normalizedBase = baseSetting.value.endsWith('/')
          ? baseSetting.value.slice(0, -1)
          : baseSetting.value;
        const normalizedPath = audioPath.startsWith('/')
          ? audioPath.slice(1)
          : audioPath;

        return `${normalizedBase}/${normalizedPath}`;
      }
    }
  } catch {
    // Swallow errors and fall back to the original path.
  }

  return audioPath;
}

export default getFullAudioUrl;
