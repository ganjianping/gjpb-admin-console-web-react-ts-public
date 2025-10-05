import type {
  LoginCredentials,
  AuthResponse,
} from "../../../../shared-lib/src/api/auth-service";
import { APP_CONFIG, APP_ENV } from "../../../../shared-lib/src/core/config";
import { apiClient } from "../../../../shared-lib/src/api/api-client";
import { setCookie } from "../../../../shared-lib/src/core/cookie";
import { mockApiService } from "../../../../shared-lib/src/api/mock-api-service";
import { clearAllCaches } from "../../../../shared-lib/src/core/cache-manager";
import { appSettingsService } from "./app-settings-service";

// Check if we should use mock API
const useMockAPI =
  APP_ENV.MODE === "mock" ||
  (APP_ENV.DEV && import.meta.env.VITE_USE_MOCK === "true");

class AuthenticationService {
  /**
   * Authenticate user with credentials
   */
  public async authenticate(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    try {
      let authResponse: AuthResponse;

      // Clear all caches on login (fresh start)
      clearAllCaches();

      // Use mock API in development mode
      if (useMockAPI) {
        authResponse = await mockApiService.login(credentials);
      } else {
        console.log(
          "[AuthService] Making login request to:",
          APP_CONFIG.AUTH.LOGIN_URL,
        );
        const response = await apiClient.post<AuthResponse>(
          APP_CONFIG.AUTH.LOGIN_URL,
          credentials,
        );

        if (response.status.code === 200 && response.data) {
          authResponse = response.data;
        } else {
          throw new Error("Login failed");
        }
      }

      // Store tokens in HTTP-only cookies
      const { accessToken, refreshToken, tokenType, expiresIn } = authResponse;

      // Store tokens with explicit SameSite protection
      setCookie(
        APP_CONFIG.TOKEN.ACCESS_TOKEN_KEY,
        accessToken,
        expiresIn,
        "/",
        import.meta.env.PROD,
        "Lax",
      );
      setCookie(
        APP_CONFIG.TOKEN.REFRESH_TOKEN_KEY,
        refreshToken,
        undefined,
        "/",
        import.meta.env.PROD,
        "Lax",
      );
      setCookie(
        APP_CONFIG.TOKEN.TOKEN_TYPE_KEY,
        tokenType,
        undefined,
        "/",
        import.meta.env.PROD,
        "Lax",
      );

      // Store user info in localStorage for convenience (all fields from backend response)
      localStorage.setItem(
        "gjpb_user_info",
        JSON.stringify({
          username: authResponse.username,
          email: authResponse.email,
          mobileCountryCode: authResponse.mobileCountryCode,
          mobileNumber: authResponse.mobileNumber,
          nickname: authResponse.nickname,
          accountStatus: authResponse.accountStatus,
          lastLoginAt: authResponse.lastLoginAt,
          lastLoginIp: authResponse.lastLoginIp,
          lastFailedLoginAt: authResponse.lastFailedLoginAt,
          failedLoginAttempts: authResponse.failedLoginAttempts,
          roleCodes: authResponse.roleCodes,
        }),
      );

      // Fetch and store app settings in the background (non-blocking)
      // Note: This call is intentionally not awaited to avoid blocking the login flow
      appSettingsService.fetchAppSettings().catch((error) => {
        console.error("[AuthService] Failed to fetch app settings:", error);
        // Don't fail the login if app settings fetch fails
      });

      // Return immediately without waiting for app settings
      return authResponse;
    } catch (error) {
      console.error("[LoginService] Login error:", error);
      throw error;
    }
  }
}

export const authenticationService = new AuthenticationService();
export default authenticationService;
