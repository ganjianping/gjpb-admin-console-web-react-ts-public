import type { ThemeOptions } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import { createTheme as muiCreateTheme } from '@mui/material/styles';
import type { ColorTheme } from '../../../../../shared-lib/src/features/theme/theme.types';

// Color theme palettes
const colorThemes = {
  blue: {
    light: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    dark: { main: '#90caf9', light: '#e3f2fd', dark: '#42a5f5' },
  },
  purple: {
    light: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2' },
    dark: { main: '#ce93d8', light: '#f3e5f5', dark: '#ab47bc' },
  },
  green: {
    light: { main: '#4caf50', light: '#81c784', dark: '#388e3c' },
    dark: { main: '#66bb6a', light: '#a5d6a7', dark: '#4caf50' },
  },
  orange: {
    light: { main: '#ff9800', light: '#ffb74d', dark: '#f57c00' },
    dark: { main: '#ffa726', light: '#ffcc02', dark: '#e65100' },
  },
  red: {
    light: { main: '#f44336', light: '#ef5350', dark: '#d32f2f' },
    dark: { main: '#e57373', light: '#ffcdd2', dark: '#c62828' },
  },
};

// Define color palette for light/dark modes
export const getDesignTokens = (mode: PaletteMode, colorTheme: ColorTheme = 'blue') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: colorThemes[colorTheme as keyof typeof colorThemes].light,
          secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
          },
          error: {
            main: '#f44336',
            light: '#ef5350',
            dark: '#d32f2f',
          },
          warning: {
            main: '#ff9800',
            light: '#ffb74d',
            dark: '#f57c00',
          },
          info: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
          },
          success: {
            main: '#4caf50',
            light: '#81c784',
            dark: '#388e3c',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
        }
      : {
          // Dark mode palette
          primary: colorThemes[colorTheme as keyof typeof colorThemes].dark,
          secondary: {
            main: '#ce93d8',
            light: '#f3e5f5',
            dark: '#ab47bc',
          },
          error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
          },
          warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#f57c00',
          },
          info: {
            main: '#29b6f6',
            light: '#4fc3f7',
            dark: '#0288d1',
          },
          success: {
            main: '#66bb6a',
            light: '#81c784',
            dark: '#4caf50',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
        }),
  },
});

// Define theme options
export const getThemeOptions = (mode: PaletteMode, colorTheme: ColorTheme = 'blue'): ThemeOptions => {
  return {
    ...getDesignTokens(mode, colorTheme),
    typography: {
      fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };
};

export default getThemeOptions;

// Helper function for tests to create a complete theme
export const createTheme = (mode: PaletteMode, colorTheme: ColorTheme = 'blue') => {
  return muiCreateTheme(getThemeOptions(mode, colorTheme));
};