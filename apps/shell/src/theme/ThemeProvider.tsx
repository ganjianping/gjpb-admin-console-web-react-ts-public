import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { useAppSelector } from '../hooks/useRedux';
import { selectThemeMode } from '../redux/slices/uiSlice';
import { getThemeOptions } from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeMode = useAppSelector(selectThemeMode);
  
  // Create theme based on current mode
  const theme = useMemo(() => {
    return createTheme(getThemeOptions(themeMode));
  }, [themeMode]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
