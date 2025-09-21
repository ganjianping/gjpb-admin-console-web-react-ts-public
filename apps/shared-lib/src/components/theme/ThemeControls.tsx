/**
 * Shared Theme Controls Component
 * Combines all theme-related controls into a single component
 */
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ThemeModeToggle } from './ThemeModeToggle';
import { ColorThemeSelector } from './ColorThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import { getColorThemeOptions, getLanguageOptions } from '../../utils/theme.utils';
import type { ThemeMode, ColorTheme, Language } from '../../types/theme.types';

interface ThemeControlsProps {
  // Current state
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  language: Language;
  
  // Handlers
  onThemeToggle: () => void;
  onColorThemeChange: (colorTheme: ColorTheme) => void;
  onLanguageChange: (language: Language) => void;
  
  // Styling
  position?: 'fixed' | 'relative' | 'absolute';
  top?: number | string;
  right?: number | string;
  gap?: number;
  sx?: any;
}

export const ThemeControls = ({
  themeMode,
  colorTheme,
  language,
  onThemeToggle,
  onColorThemeChange,
  onLanguageChange,
  position = 'fixed',
  top = 32,
  right = 32,
  gap = 2,
  sx = {}
}: ThemeControlsProps) => {
  const { t, i18n } = useTranslation();
  const isDarkMode = themeMode === 'dark';
  
  // Handle language change with i18n integration
  const handleLanguageChange = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  // Create wrapper function for translations
  const translate = (key: string, defaultValue?: string) => {
    return defaultValue ? t(key, { defaultValue }) : t(key);
  };

  const defaultSx = {
    position,
    top,
    right,
    zIndex: 1000,
    display: 'flex',
    gap,
    ...sx
  };

  const colorThemeOptions = getColorThemeOptions(translate);
  const languageOptions = getLanguageOptions();

  return (
    <Box sx={defaultSx}>
      <LanguageSelector
        currentLanguage={language}
        languageOptions={languageOptions}
        onLanguageChange={handleLanguageChange}
        isDarkMode={isDarkMode}
        t={translate}
      />
      
      <ColorThemeSelector
        currentColorTheme={colorTheme}
        colorThemeOptions={colorThemeOptions}
        onColorThemeChange={onColorThemeChange}
        isDarkMode={isDarkMode}
        t={translate}
      />
      
      <ThemeModeToggle
        isDarkMode={isDarkMode}
        onToggle={onThemeToggle}
        t={translate}
      />
    </Box>
  );
};

export default ThemeControls;