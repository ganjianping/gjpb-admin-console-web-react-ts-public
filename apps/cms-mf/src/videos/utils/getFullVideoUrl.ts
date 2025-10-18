import { Alert } from "@mui/material";

/**
 * Build a fully qualified video URL.
 * - Returns the input if it is already an absolute URL.
 * - Otherwise prepends the `video_base_url` setting stored in localStorage.
 */
export function getFullVideoUrl(videoPath?: string | null): string {
  if (!videoPath) {
    return '';
  }

  if (videoPath.startsWith('http')) {
    return videoPath;
  }
 
  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string }>;
      const baseSetting = appSettings.find((setting) => setting.name === 'video_base_url');
      if (baseSetting?.value) {
        const normalizedBase = baseSetting.value.endsWith('/')
          ? baseSetting.value.slice(0, -1)
          : baseSetting.value;
        const normalizedPath = videoPath.startsWith('/')
          ? videoPath.slice(1)
          : videoPath;

        return `${normalizedBase}/${normalizedPath}`;
      }
    }
  } catch {
    // Swallow errors and fall back to the original path.
  }

  return videoPath;
}

export default getFullVideoUrl;
