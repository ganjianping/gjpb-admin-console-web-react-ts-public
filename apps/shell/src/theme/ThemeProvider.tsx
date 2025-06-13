import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { useAppSelector } from '../hooks/useRedux';
import { selectThemeMode, selectColorTheme } from '../redux/slices/uiSlice';
import { getThemeOptions } from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeMode = useAppSelector(selectThemeMode);
  const colorTheme = useAppSelector(selectColorTheme);
  
  // Create theme based on current mode and color theme
  const theme = useMemo(() => {
    return createTheme(getThemeOptions(themeMode, colorTheme));
  }, [themeMode, colorTheme]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
