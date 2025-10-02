import { describe, it, beforeEach, vi, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ProfilePage from '../pages/ProfilePage'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../shared-lib/src/utils/i18n'
import type { User } from '../services/userService'

// Initialize i18n for user-mf
import '../../config/i18n.config'

// Mock notification hook
vi.mock('../../shared/hooks', () => ({
  useNotification: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}))

// Mock i18n with proper translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next')
  const translations: Record<string, string> = {
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.notAvailable': 'Not Available',
    'profile.tabs.personal': 'Personal Info',
    'profile.tabs.security': 'Security',
    'profile.tabs.activity': 'Activity',
    'profile.changePassword': 'Change Password',
    'profile.updatePassword': 'Update Password',
    'profile.loginActivity': 'Login Activity',
    'profile.lastLogin': 'Last Login',
    'profile.lastIP': 'Last IP',
    'profile.failedAttempts': 'Failed Attempts',
    'profile.accountStatus': 'Account Status',
    'profile.deviceSessions': 'Device Sessions',
    'profile.noActiveSessions': 'No active sessions found',
    'profile.form.nickname': 'Nickname',
    'profile.form.email': 'Email',
    'profile.form.countryCode': 'Country Code',
    'profile.form.mobileNumber': 'Mobile Number',
    'profile.noEmailProvided': 'No email provided',
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

// Mock user data in the format expected by user-mf
const mockUser: User = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  nickname: 'Test User',
  mobileCountryCode: '+1',
  mobileNumber: '5551234567',
  accountStatus: 'active',
  active: true,
  lastLoginAt: new Date().toISOString(),
  lastLoginIp: '127.0.0.1',
  passwordChangedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  roles: [
    {
      id: 'role-1',
      name: 'User',
      code: 'USER',
      description: 'Standard user role',
      sortOrder: 0,
      level: 0,
      parentRoleId: null,
      systemRole: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: null,
      updatedBy: null,
    }
  ]
}

// Create theme for test
const theme = createTheme()

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('renders user information correctly', () => {
    render(
      <TestWrapper>
        <ProfilePage user={mockUser} />
      </TestWrapper>
    )
    
    // Check if the page contains user information
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText(/\+1 5551234567/)).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })
  
  it('displays profile tabs correctly', () => {
    render(
      <TestWrapper>
        <ProfilePage user={mockUser} />
      </TestWrapper>
    )
    
    // Check if tabs are rendered
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Activity')).toBeInTheDocument()
  })
  
  it('shows a loading state when user data is not available', () => {
    render(
      <TestWrapper>
        <ProfilePage user={null} />
      </TestWrapper>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
  
  it('handles user without nickname by showing username', () => {
    const userWithoutNickname: User = {
      ...mockUser,
      nickname: null,
    }
    
    render(
      <TestWrapper>
        <ProfilePage user={userWithoutNickname} />
      </TestWrapper>
    )
    
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })
  
  it('handles user without email gracefully', () => {
    const userWithoutEmail: User = {
      ...mockUser,
      email: null,
    }
    
    render(
      <TestWrapper>
        <ProfilePage user={userWithoutEmail} />
      </TestWrapper>
    )
    
    expect(screen.getByText('No email provided')).toBeInTheDocument()
  })
  
  it('displays role codes correctly from roles array', () => {
    render(
      <TestWrapper>
        <ProfilePage user={mockUser} />
      </TestWrapper>
    )
    
    expect(screen.getByText('User')).toBeInTheDocument()
  })
})