import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../../../shared-lib/src/services/auth-service';
import type { UserInfo, AuthResponse } from '../../../../shared-lib/src/services/auth-service';
import type { RootState } from '../store';

// Define the auth state interface
interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  roles: string[];
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  roles: [],
};

// Async thunks
export const fetchCurrentUser = createAsyncThunk<
  UserInfo,
  void,
  { rejectValue: string }
>('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error('Failed to fetch user data');
    }
    return user;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  return null;
});

// Initialize auth state on app startup
export const initializeAuth = createAsyncThunk<
  { isAuthenticated: boolean; user?: UserInfo },
  void
>('auth/initialize', async () => {
  try {
    // Check if user has valid authentication tokens
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      // Try to get user info from localStorage first (faster)
      const storedUserInfo = localStorage.getItem('gjpb_user_info');
      if (storedUserInfo) {
        const user = JSON.parse(storedUserInfo);
        return { isAuthenticated: true, user };
      }
      
      // If no stored user info, fetch from API
      const user = await authService.getCurrentUser();
      if (user) {
        return { isAuthenticated: true, user };
      }
    }
    
    return { isAuthenticated: false };
  } catch (error: unknown) {
    // If token is invalid or expired, treat as not authenticated
    console.warn('Auth initialization failed:', error);
    return { isAuthenticated: false };
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { username, email, mobileCountryCode, mobileNumber, nickname, accountStatus, roleCodes } = action.payload;
      state.user = {
        username,
        email,
        mobileCountryCode,
        mobileNumber,
        nickname,
        accountStatus,
        lastLoginAt: action.payload.lastLoginAt,
        lastLoginIp: action.payload.lastLoginIp,
        lastFailedLoginAt: action.payload.lastFailedLoginAt,
        failedLoginAttempts: action.payload.failedLoginAttempts,
        roleCodes,
      };
      state.isAuthenticated = true;
      state.roles = roleCodes;
      state.error = null;
    },
    // New action to handle login success from auth-mf
    handleLoginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const { username, email, mobileCountryCode, mobileNumber, nickname, accountStatus, roleCodes } = action.payload;
      state.user = {
        username,
        email,
        mobileCountryCode,
        mobileNumber,
        nickname,
        accountStatus,
        lastLoginAt: action.payload.lastLoginAt,
        lastLoginIp: action.payload.lastLoginIp,
        lastFailedLoginAt: action.payload.lastFailedLoginAt,
        failedLoginAttempts: action.payload.failedLoginAttempts,
        roleCodes,
      };
      state.isAuthenticated = true;
      state.isLoading = false;
      state.roles = roleCodes;
      state.error = null;
    },
    handleLoginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.roles = [];
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.roles = [];
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.roles = action.payload.roleCodes;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch user';
      });
    
    // Logout user
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.roles = [];
        state.error = null;
      });
    
    // Initialize auth
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload.isAuthenticated && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.roles = action.payload.user.roleCodes || [];
          state.error = null;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.roles = [];
        }
        state.isLoading = false;
      });
  },
});

// Export actions and reducer
export const { 
  setCredentials, 
  clearCredentials, 
  setError, 
  clearError, 
  handleLoginSuccess, 
  handleLoginFailure 
} = authSlice.actions;

// Custom selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserRoles = (state: RootState) => state.auth.roles;

// Check if user has a specific role
export const selectHasRole = (state: RootState, role: string | string[]) => {
  const roles = state.auth.roles;
  if (!roles.length) return false;
  
  const requiredRoles = Array.isArray(role) ? role : [role];
  return requiredRoles.some(r => roles.includes(r));
};

export default authSlice.reducer;