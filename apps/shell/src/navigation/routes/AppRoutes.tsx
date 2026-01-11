import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Pages
// Dynamic imports for better code splitting
const LoginPageProvider = lazy(() =>
  import("../../../../auth-mf/src/public-api").then((module) => ({
    default: module.LoginPageProvider,
  })),
);
const UsersPage = lazy(() =>
  import("../../../../user-mf/src/public-api").then((module) => ({
    default: module.UsersPage,
  })),
);
const RolesPage = lazy(() =>
  import("../../../../user-mf/src/public-api").then((module) => ({
    default: module.RolesPage,
  })),
);
const AuditLogPage = lazy(() =>
  import("../../../../user-mf/src/public-api").then((module) => ({
    default: module.AuditLogPage,
  })),
);
const ProfilePage = lazy(() =>
  import("../../../../user-mf/src/public-api").then((module) => ({
    default: module.ProfilePage,
  })),
);
const AppSettingsPage = lazy(() =>
  import("../../../../bm-mf/src/public-api").then((module) => ({
    default: module.AppSettingsPage,
  })),
);
const WebsitesPage = lazy(() =>
  import("../../../../cms-mf/src/public-api").then((module) => ({
    default: module.WebsitesPage,
  })),
);
const LogosPage = lazy(() =>
  import("../../../../cms-mf/src/logos/pages/LogosPage").then((module) => ({
    default: module.default,
  })),
);
const FilesPage = lazy(() =>
  import("../../../../cms-mf/src/files/pages/FilesPage").then((module) => ({
    default: module.default,
  })),
);
const ImagesPage = lazy(() =>
  import("../../../../cms-mf/src/images/pages/ImagesPage").then((module) => ({
    default: module.default,
  })),
);
const VideosPage = lazy(() =>
  import("../../../../cms-mf/src/videos/pages/VideosPage").then((module) => ({
    default: module.default,
  })),
);
const ArticlesPage = lazy(() =>
  import("../../../../cms-mf/src/articles/pages/ArticlesPage").then((module) => ({
    default: module.default,
  })),
);
const AudiosPage = lazy(() =>
  import("../../../../cms-mf/src/audios/pages/AudiosPage").then((module) => ({
    default: module.default,
  })),
);
const QuestionsPage = lazy(() =>
  import("../../../../cms-mf/src/questions/pages/QuestionsPage").then((module) => ({
    default: module.default,
  })),
);
const VocabularyRusPage = lazy(() =>
  import("../../../../rubi-mf/src/public-api").then((module) => ({
    default: module.VocabularyRusPage,
  })),
);
const MultipleChoiceQuestionRusPage = lazy(() =>
  import("../../../../rubi-mf/src/public-api").then((module) => ({
    default: module.MultipleChoiceQuestionRusPage,
  })),
);
const FreeTextQuestionRusPage = lazy(() =>
  import("../../../../rubi-mf/src/public-api").then((module) => ({
    default: module.FreeTextQuestionRusPage,
  })),
);
const FillBlankQuestionRusPage = lazy(() =>
  import("../../../../rubi-mf/src/public-api").then((module) => ({
    default: module.FillBlankQuestionRusPage,
  })),
);
const TrueFalseQuestionRusPage = lazy(() =>
  import("../../../../rubi-mf/src/public-api").then((module) => ({
    default: module.TrueFalseQuestionRusPage,
  })),
);

// Import dashboard (this also loads dashboard translations)
import "../../dashboard";
import DashboardPage from "../../dashboard/pages/DashboardPage";

import SettingsPage from "../../settings/pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../../authentication/pages/UnauthorizedPage";

// Components
import ProtectedRoute from "../../authentication/components/ProtectedRoute";
import RefreshWarningProvider from "../../refresh-warning";
import AppLoading from "../../core/components/AppLoading";

// Redux
import { useAppDispatch, useAppSelector } from "../../core/hooks/useRedux";
import {
  initializeAuth,
  handleLoginSuccess,
  handleLoginFailure,
  selectCurrentUser,
} from "../../authentication/store/authSlice";
import {
  setPageTitle,
  selectPageTitle,
  setThemeMode,
  setColorTheme,
} from "../../core/store/uiSlice";
import type { UserInfo } from "../../../../shared-lib/src/api/auth-service";

// Config
import { APP_CONFIG } from "../../../../shared-lib/src/core/config";

// Profile page wrapper that passes current user as prop
const ProfilePageWrapper = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(setPageTitle(t("navigation.profile")));
  }, [dispatch, t]);

  // Map UserInfo to User type expected by ProfilePage
  const mapUserInfoToUser = (userInfo: UserInfo | null) => {
    if (!userInfo) return null;

    return {
      id: "", // ProfilePage doesn't really need ID for display
      username: userInfo.username,
      nickname: userInfo.nickname,
      email: userInfo.email,
      mobileCountryCode: userInfo.mobileCountryCode,
      mobileNumber: userInfo.mobileNumber,
      accountStatus: userInfo.accountStatus.toLowerCase() as
        | "active"
        | "locked"
        | "suspend"
        | "pending_verification",
      active: userInfo.accountStatus.toLowerCase() === "active",
      lastLoginAt: userInfo.lastLoginAt,
      lastLoginIp: userInfo.lastLoginIp,
      passwordChangedAt: "", // Not available in UserInfo
      createdAt: "", // Not available in UserInfo
      updatedAt: "", // Not available in UserInfo
      roles: userInfo.roleCodes.map((code) => ({
        id: "",
        name: code,
        code: code,
        description: "",
        status: "active" as const,
        sortOrder: 0,
        level: 0,
        parentRoleId: null,
        systemRole: false,
        active: true,
        createdAt: "",
        updatedAt: "",
        createdBy: null,
        updatedBy: null,
      })),
    };
  };

  const mappedUser = mapUserInfoToUser(currentUser);

  return (
    <Suspense fallback={<AppLoading />}>
      <ProfilePage user={mappedUser} />
    </Suspense>
  );
};

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const currentPageTitle = useAppSelector(selectPageTitle);

  // Initialize authentication state on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Set up auth communication handlers for auth-mf
  useEffect(() => {
    // Handle login success from auth-mf
    window.onAuthLoginSuccess = (authResponse) => {
      console.log("[Shell] Received login success from auth-mf");
      dispatch(handleLoginSuccess(authResponse));
    };

    // Handle login failure from auth-mf
    window.onAuthLoginFailure = (error) => {
      console.log("[Shell] Received login failure from auth-mf:", error);
      dispatch(handleLoginFailure(error));
    };

    // Handle logout request from auth-mf (if needed in the future)
    (window as any).onAuthLogoutRequest = () => {
      console.log("[Shell] Received logout request from auth-mf");
      // Handle logout if needed
    };

    // Handle theme mode change requests from auth-mf
    window.onThemeModeChange = (mode) => {
      console.log(
        "[Shell] Received theme mode change request from auth-mf:",
        mode,
      );
      dispatch(setThemeMode(mode));
    };

    // Handle color theme change requests from auth-mf
    window.onColorThemeChange = (colorTheme) => {
      console.log(
        "[Shell] Received color theme change request from auth-mf:",
        colorTheme,
      );
      dispatch(setColorTheme(colorTheme));
    };

    // Cleanup on unmount
    return () => {
      delete window.onAuthLoginSuccess;
      delete window.onAuthLoginFailure;
      delete (window as any).onAuthLogoutRequest;
      delete window.onThemeModeChange;
      delete window.onColorThemeChange;
    };
  }, [dispatch]);

  // Initialize page title with i18n after translations are loaded
  useEffect(() => {
    // Only set initial page title if it's still the fallback value and i18n is ready
    if (
      currentPageTitle === APP_CONFIG.DEFAULT_PAGE_TITLE &&
      i18n.isInitialized
    ) {
      const translatedTitle = t(APP_CONFIG.DEFAULT_PAGE_TITLE_KEY, {
        defaultValue: APP_CONFIG.DEFAULT_PAGE_TITLE,
      });
      dispatch(setPageTitle(translatedTitle));
    }
  }, [dispatch, t, i18n.isInitialized, currentPageTitle]);

  return (
    <>
      {/* Refresh warning provider for authenticated users */}
      <RefreshWarningProvider />

      <Routes>
        {/* Public routes */}
        <Route
          path="/auth/login"
          element={
            <Suspense fallback={<AppLoading />}>
              <LoginPageProvider />
            </Suspense>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePageWrapper />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Users Management */}
          <Route
            path="users"
            element={
              <Suspense fallback={<AppLoading />}>
                <UsersPage />
              </Suspense>
            }
          />
          <Route
            path="roles"
            element={
              <Suspense fallback={<AppLoading />}>
                <RolesPage />
              </Suspense>
            }
          />

          {/* Audit Logs */}
          <Route
            path="audit-logs"
            element={
              <Suspense fallback={<AppLoading />}>
                <AuditLogPage />
              </Suspense>
            }
          />

          {/* Websites */}
          <Route
            path="websites"
            element={
              <Suspense fallback={<AppLoading />}>
                <WebsitesPage />
              </Suspense>
            }
          />

          {/* Logos */}
          <Route
            path="logos"
            element={
              <Suspense fallback={<AppLoading />}>
                <LogosPage />
              </Suspense>
            }
          />
          {/* Files */}
          <Route
            path="files"
            element={
              <Suspense fallback={<AppLoading />}>
                <FilesPage />
              </Suspense>
            }
          />
          {/* Images */}
          <Route
            path="images"
            element={
              <Suspense fallback={<AppLoading />}>
                <ImagesPage />
              </Suspense>
            }
          />
          {/* Videos */}
          <Route
            path="videos"
            element={
              <Suspense fallback={<AppLoading />}>
                <VideosPage />
              </Suspense>
            }
          />

          {/* Articles */}
          <Route
            path="articles"
            element={
              <Suspense fallback={<AppLoading />}>
                <ArticlesPage />
              </Suspense>
            }
          />

          {/* Audios */}
          <Route
            path="audios"
            element={
              <Suspense fallback={<AppLoading />}>
                <AudiosPage />
              </Suspense>
            }
          />

          {/* Questions */}
          <Route
            path="questions"
            element={
              <Suspense fallback={<AppLoading />}>
                <QuestionsPage />
              </Suspense>
            }
          />

          {/* Vocabularies */}
          <Route
            path="vocabularies"
            element={
              <Suspense fallback={<AppLoading />}>
                <VocabularyRusPage />
              </Suspense>
            }
          />

          {/* MCQ Rus */}
          <Route
            path="multipleChoiceQuestionRus"
            element={
              <Suspense fallback={<AppLoading />}>
                <MultipleChoiceQuestionRusPage />
              </Suspense>
            }
          />

          {/* Free Text Question Rus */}
          <Route
            path="freeTextQuestionRus"
            element={
              <Suspense fallback={<AppLoading />}>
                <FreeTextQuestionRusPage />
              </Suspense>
            }
          />

          {/* Fill Blank Question Rus */}
          <Route
            path="fillBlankQuestionRus"
            element={
              <Suspense fallback={<AppLoading />}>
                <FillBlankQuestionRusPage />
              </Suspense>
            }
          />

          {/* True False Question Rus */}
          <Route
            path="trueFalseQuestionRus"
            element={
              <Suspense fallback={<AppLoading />}>
                <TrueFalseQuestionRusPage />
              </Suspense>
            }
          />

          {/* App Settings */}
          <Route
            path="app-settings"
            element={
              <Suspense fallback={<AppLoading />}>
                <AppSettingsPage />
              </Suspense>
            }
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
