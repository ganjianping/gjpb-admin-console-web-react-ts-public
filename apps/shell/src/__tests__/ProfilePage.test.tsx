import { describe, it, beforeEach, vi, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from '@mui/material/styles'
import ProfilePage from '../pages/ProfilePage'
import authReducer from '../redux/slices/authSlice'
import uiReducer from '../redux/slices/uiSlice'
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
    'common.loading': 'Loading...',
    'navigation.profile': 'Profile',
    'profile.tabs.personal': 'Personal Info',
    'profile.tabs.security': 'Security',
    'profile.tabs.activity': 'Activity',
    'common.save': 'Save',
    'profile.changePassword': 'Change Password',
    'profile.updatePassword': 'Update Password',
    'profile.loginActivity': 'Login Activity',
    'profile.lastLogin': 'Last Login',
    'profile.lastIP': 'Last IP Address',
    'profile.failedAttempts': 'Failed Login Attempts',
    'profile.accountStatus': 'Account Status',
    'profile.deviceSessions': 'Device Sessions',
    'profile.noActiveSessions': 'No active sessions found',
    'profile.form.nickname': 'Nickname',
    'profile.form.email': 'Email',
    'profile.form.countryCode': 'Country Code',
    'profile.form.mobileNumber': 'Mobile Number'
  }
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => translations[key] || key,
      i18n: {
        changeLanguage: vi.fn()
      }
    }),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children
  }
})

// Mock user data
const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  nickname: 'Test User',
  mobileCountryCode: '+1',
  mobileNumber: '5551234567',
  accountStatus: 'ACTIVE',
  roleCodes: ['USER'],
  lastLoginAt: new Date().toISOString(),
  lastLoginIp: '127.0.0.1',
  lastFailedLoginAt: null,
  failedLoginAttempts: 0
}

// Create test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer
    },
    preloadedState: {
      auth: {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        roles: mockUser.roleCodes
      },
      ui: {
        themeMode: 'light' as const,
        language: 'en' as const,
        sidebarOpen: true,
        pageTitle: 'Profile'
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

describe('ProfilePage', () => {
  let store: ReturnType<typeof createTestStore>
  
  beforeEach(() => {
    store = createTestStore()
    vi.clearAllMocks()
  })
  
  it('renders user information correctly', () => {
    render(
      <TestWrapper store={store}>
        <ProfilePage />
      </TestWrapper>
    )
    
    // Check if the page contains user information
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText(/\+1 5551234567/)).toBeInTheDocument()
    expect(screen.getByText('USER')).toBeInTheDocument()
  })
  
  it('displays profile tabs correctly', () => {
    render(
      <TestWrapper store={store}>
        <ProfilePage />
      </TestWrapper>
    )
    
    // Check if tabs are rendered
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Activity')).toBeInTheDocument()
  })
  
  it('shows a loading state when user data is not available', () => {
    const storeWithoutUser = createTestStore({
      auth: {
        user: null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        roles: []
      }
    })
    
    render(
      <TestWrapper store={storeWithoutUser}>
        <ProfilePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
