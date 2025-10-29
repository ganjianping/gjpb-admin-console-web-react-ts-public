import { apiClient } from "../../../../shared-lib/src/api/api-client";

export interface AppSetting {
  name: string;
  value: string;
  lang: string;
}

export interface AppSettingsResponse {
  status: {
    code: number;
    message: string;
    errors: null | Record<string, string[]>;
  };
  data: AppSetting[];
  meta: {
    serverDateTime: string;
    requestId: string;
    sessionId: string;
  };
}

class AppSettingsService {
  /**
   * Fetch public app settings
   */
  public async fetchAppSettings(): Promise<AppSetting[]> {
    try {
      const response = await apiClient.get<AppSetting[]>(
        "/v1/public/app-settings",
      );

      if (response.status.code === 200 && response.data) {
        // Store in localStorage
        localStorage.setItem(
          "gjpb_app_settings",
          JSON.stringify(response.data),
        );
        return response.data;
      } else {
        throw new Error("Failed to fetch app settings");
      }
    } catch (error) {
      console.error("[AppSettingsService] Fetch error:", error);
      throw error;
    }
  }

  /**
   * Get app settings from localStorage
   */
  public getAppSettings(): AppSetting[] | null {
    try {
      const settings = localStorage.getItem("gjpb_app_settings");
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error("[AppSettingsService] Get settings error:", error);
      return null;
    }
  }

  /**
   * Get app settings filtered by language
   */
  public getAppSettingsByLanguage(language: string): Record<string, string> {
    const settings = this.getAppSettings();
    if (!settings) return {};

    const normalizedLang = language.toUpperCase().startsWith("ZH")
      ? "ZH"
      : "EN";

    return settings
      .filter((setting) => setting.lang === normalizedLang)
      .reduce(
        (acc, setting) => {
          acc[setting.name] = setting.value;
          return acc;
        },
        {} as Record<string, string>,
      );
  }
}

export const appSettingsService = new AppSettingsService();
export default appSettingsService;
