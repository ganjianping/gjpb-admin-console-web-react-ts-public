import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { appSettingsService } from "../../../../shared-lib/src/api/app-settings-service";

const AppSettingsCard = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    // Function to load settings
    const loadSettings = () => {
      const currentSettings = appSettingsService.getAppSettingsByLanguage(
        i18n.language,
      );
      return currentSettings;
    };

    // Load settings immediately
    const initialSettings = loadSettings();
    setSettings(initialSettings);

    // If settings are empty, set up a retry mechanism
    // This handles the case where the background API call hasn't completed yet
    if (Object.keys(initialSettings).length === 0) {
      const intervalId = setInterval(() => {
        const currentSettings = loadSettings();
        if (Object.keys(currentSettings).length > 0) {
          setSettings(currentSettings);
          clearInterval(intervalId);
        }
      }, 500); // Check every 500ms for up to 10 seconds

      // Clear interval after 10 seconds to avoid infinite polling
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [i18n.language]);

  // If no settings available, don't render the card
  if (Object.keys(settings).length === 0) {
    return null;
  }

  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: {
          xs: "0 2px 8px rgba(0,0,0,0.05)",
          sm: "0 3px 12px rgba(0,0,0,0.08)",
        },
        border: theme.palette.mode === "light" ? "1px solid" : "none",
        borderColor: theme.palette.mode === "light" ? "divider" : "transparent",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SettingsIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("dashboard.appSettings.title", "App Settings")}
          </Typography>
        </Box>

        {/* Settings List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(settings).map(([name, value]) => (
            <Box key={name}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {t(`dashboard.appSettings.${name}`, name.replace(/_/g, " "))}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={value}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(25, 118, 210, 0.08)"
                        : "rgba(144, 202, 249, 0.16)",
                    color:
                      theme.palette.mode === "light"
                        ? "primary.main"
                        : "primary.light",
                    border: `1px solid ${
                      theme.palette.mode === "light"
                        ? "rgba(25, 118, 210, 0.2)"
                        : "rgba(144, 202, 249, 0.3)"
                    }`,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppSettingsCard;
