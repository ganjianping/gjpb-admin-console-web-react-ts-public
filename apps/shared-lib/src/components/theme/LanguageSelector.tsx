/**
 * Shared Language Selector Component
 */
import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Languages } from 'lucide-react';
import type { Language, LanguageOption } from '../../types/theme.types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  languageOptions: LanguageOption[];
  onLanguageChange: (language: Language) => void;
  isDarkMode: boolean;
  t: (key: string, defaultValue?: string) => string;
  size?: number;
  sx?: any;
}

export const LanguageSelector = ({
  currentLanguage,
  languageOptions,
  onLanguageChange,
  isDarkMode,
  t,
  size = 24,
  sx = {}
}: LanguageSelectorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLanguageChange = (language: Language) => {
    onLanguageChange(language);
    setDropdownOpen(false);
  };

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
    <Box sx={{ position: 'relative' }} ref={dropdownRef}>
      <Tooltip title={t('common.language', 'Language')}>
        <IconButton 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          sx={defaultSx}
        >
          <Languages size={size} />
        </IconButton>
      </Tooltip>
      
      {/* Language dropdown menu */}
      {dropdownOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            p: 1,
            minWidth: 140,
            backgroundColor: isDarkMode
              ? 'rgba(30, 41, 59, 0.95)'
              : '#ffffff',
            backdropFilter: isDarkMode ? 'blur(20px)' : 'none',
            border: '1px solid',
            borderColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(226, 232, 240, 0.8)',
            borderRadius: 2,
            boxShadow: isDarkMode
              ? '0 10px 30px rgba(0, 0, 0, 0.3)'
              : '0 10px 30px rgba(148, 163, 184, 0.2)',
            zIndex: 1000,
          }}
        >
          {languageOptions.map((option) => {
            const isSelected = currentLanguage === option.value;
            const selectedBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            
            return (
              <Box
                key={option.value}
                onClick={() => handleLanguageChange(option.value)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: isSelected ? selectedBgColor : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <Box sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 600 : 400,
                }}>
                  {option.flag} {option.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default LanguageSelector;