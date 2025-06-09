import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from '@mui/material/styles'
import SettingsPage from '../pages/SettingsPage'
import uiReducer, { setThemeMode, setLanguage } from '../redux/slices/uiSlice'
import { createTheme } from '../theme/theme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../shared-lib/src/utils/i18n'

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock i18n with proper translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next')
  const translations: Record<string, string> = {
    'navigation.settings': 'Settings',
    'settings.appearance.title': 'Appearance',
    'settings.notifications.title': 'Notifications', 
    'settings.security.title': 'Security',
    'settings.appearance.selectLanguage': 'Language'
  }
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => translations[key] || key,
      i18n: {
        changeLanguage: vi.fn()
      }
    })
  }
})

// Create test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      ui: uiReducer
    },
    preloadedState: {
      ui: {
        themeMode: 'light' as const,
        language: 'en' as const,
        sidebarOpen: true,
        pageTitle: 'Settings'
      },
      ...preloadedState
    }
  })
}

// Wrapper component for tests
const TestWrapper = ({ children, store }: { children: React.ReactNode, store: ReturnType<typeof createTestStore> }) => {
  const theme = createTheme('light')
  
  return (
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            {children}
          </I18nextProvider>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  )
}

describe('SettingsPage', () => {
  let store: ReturnType<typeof createTestStore>
  
  beforeEach(() => {
    store = createTestStore()
    vi.clearAllMocks()
  })
  
  it('renders settings sections correctly', () => {
    render(
      <TestWrapper store={store}>
        <SettingsPage />
      </TestWrapper>
    )
    
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
  })
  
  it('dispatches theme change action when toggling theme', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    
    render(
      <TestWrapper store={store}>
        <SettingsPage />
      </TestWrapper>
    )
    
    // Clear any calls from component mounting (like setPageTitle)
    dispatchSpy.mockClear()
    
    // Find the theme toggle switch and click it
    const themeSwitch = screen.getAllByRole('checkbox')[0]
    fireEvent.click(themeSwitch)
    
    expect(dispatchSpy).toHaveBeenCalledWith(setThemeMode('dark'))
  })
  
  it('dispatches language change action when selecting a language', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    
    render(
      <TestWrapper store={store}>
        <SettingsPage />
      </TestWrapper>
    )
    
    // Clear any calls from component mounting (like setPageTitle)
    dispatchSpy.mockClear()
    
    // Find the language select by the input's aria-labelledby
    const languageSelect = screen.getByRole('combobox', { name: /language/i })
    
    // Open the select dropdown
    fireEvent.mouseDown(languageSelect)
    
    // Wait for the dropdown to open and find the Chinese option
    const zhOption = await screen.findByText('中文')
    fireEvent.click(zhOption)
    
    expect(dispatchSpy).toHaveBeenCalledWith(setLanguage('zh'))
  })
})
