/**
 * Shared Theme Mode Toggle Component
 */
import { IconButton, Tooltip } from '@mui/material';
import { Sun, Moon } from 'lucide-react';

interface ThemeModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  t: (key: string, defaultValue?: string) => string;
  size?: number;
  sx?: any;
}

export const ThemeModeToggle = ({ 
  isDarkMode, 
  onToggle, 
  t, 
  size = 24,
  sx = {}
}: ThemeModeToggleProps) => {
  const defaultSx = {
    width: 52,
    height: 52,
    color: isDarkMode ? '#ffffff' : '#475569',
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid',
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(148, 163, 184, 0.3)',
    borderRadius: '16px',
    boxShadow: isDarkMode
      ? '0 8px 24px rgba(0, 0, 0, 0.3)'
      : '0 8px 24px rgba(148, 163, 184, 0.25)',
    '&:hover': {
      backgroundColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.05)',
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(99, 102, 241, 0.5)',
      boxShadow: isDarkMode
        ? '0 12px 32px rgba(0, 0, 0, 0.4)'
        : '0 12px 32px rgba(99, 102, 241, 0.3)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...sx
  };

  return (
    <Tooltip title={isDarkMode ? t('theme.light', 'Light mode') : t('theme.dark', 'Dark mode')}>
      <IconButton onClick={onToggle} sx={defaultSx}>
        {isDarkMode ? <Sun size={size} /> : <Moon size={size} />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeModeToggle;