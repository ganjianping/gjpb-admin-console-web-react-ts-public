// Returns the full logo URL, prepending logo_base_url from localStorage if needed
export function getFullLogoUrl(logoUrl: string): string {
  if (!logoUrl) return '';
  if (logoUrl.startsWith('http')) return logoUrl;
  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (settings) {
      const appSettings = JSON.parse(settings);
      const logoBaseUrlSetting = appSettings.find(
        (setting: any) => setting.name === 'logo_base_url'
      );
      if (logoBaseUrlSetting && logoBaseUrlSetting.value) {
        return logoBaseUrlSetting.value + '/' + logoUrl;
      }
    }
  } catch (err) {
    // fallback: use original logoUrl
  }
  return logoUrl;
}
