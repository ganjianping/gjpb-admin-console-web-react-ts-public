import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginService } from '../../services/login-service';
import type { LoginCredentials, AuthResponse } from '../../../../shared-lib/src/services/auth-service';
import { ApiError } from '../../../../shared-lib/src/services/api-client';
import type { RootState } from '../store';

// Login form state interface
interface LoginState {
  isLoading: boolean;
  error: string | null;
  lastLoginAttempt: string | null;
  loginAttempts: number;
  maxLoginAttempts: number;
  isLocked: boolean;
  lockoutExpiresAt: string | null;
  rememberMe: boolean;
  lastSuccessfulLogin: string | null;
}

// Initial state
const initialState: LoginState = {
  isLoading: false,
  error: null,
  lastLoginAttempt: null,
  loginAttempts: 0,
  maxLoginAttempts: 5,
  isLocked: false,
  lockoutExpiresAt: null,
  rememberMe: false,
  lastSuccessfulLogin: null,
};

// Async thunk for login
export const performLogin = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string; state: { login: LoginState } }
>('login/performLogin', async (credentials, { rejectWithValue, getState }) => {
  const state = getState();
  
  // Check if account is locked
  if (state.login.isLocked) {
    const lockoutExpiry = state.login.lockoutExpiresAt;
    if (lockoutExpiry && new Date().toISOString() < lockoutExpiry) {
      return rejectWithValue('Account is temporarily locked due to too many failed attempts. Please try again later.');
    }
  }

  try {
    const response = await loginService.login(credentials);
    return response;
  } catch (error: unknown) {
    console.error('[LoginSlice] Login error:', error);
    
    if (error instanceof ApiError) {
      return rejectWithValue(error.message || 'Login failed');
    } else if (error instanceof Error) {
      return rejectWithValue(error.message);
    } else {
      return rejectWithValue('Login failed: Unknown error occurred');
    }
  }
});

// Login slice
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.isLocked = false;
      state.lockoutExpiresAt = null;
      state.error = null;
    },
    clearLoginState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.lastLoginAttempt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastLoginAttempt = new Date().toISOString();
      })
      .addCase(performLogin.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.loginAttempts = 0; // Reset attempts on success
        state.isLocked = false;
        state.lockoutExpiresAt = null;
        state.lastSuccessfulLogin = new Date().toISOString();
        
        // Store remember me preference in localStorage
        if (state.rememberMe) {
          localStorage.setItem('gjpb_remember_me', 'true');
        } else {
          localStorage.removeItem('gjpb_remember_me');
        }
      })
      .addCase(performLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed';
        state.loginAttempts += 1;
        
        // Lock account if max attempts reached
        if (state.loginAttempts >= state.maxLoginAttempts) {
          state.isLocked = true;
          // Lock for 15 minutes
          const lockoutDuration = 15 * 60 * 1000;
          state.lockoutExpiresAt = new Date(Date.now() + lockoutDuration).toISOString();
          state.error = `Account locked due to ${state.maxLoginAttempts} failed attempts. Please try again in 15 minutes.`;
        }
      });
  },
});

// Export actions
export const { 
  clearError, 
  setRememberMe, 
  resetLoginAttempts, 
  clearLoginState 
} = loginSlice.actions;

// Selectors
export const selectIsLoading = (state: RootState) => state.login?.isLoading ?? false;
export const selectLoginError = (state: RootState) => state.login?.error ?? null;
export const selectLoginAttempts = (state: RootState) => state.login?.loginAttempts ?? 0;
export const selectIsLocked = (state: RootState) => state.login?.isLocked ?? false;
export const selectLockoutExpiresAt = (state: RootState) => state.login?.lockoutExpiresAt ?? null;
export const selectRememberMe = (state: RootState) => state.login?.rememberMe ?? false;
export const selectLastSuccessfulLogin = (state: RootState) => state.login?.lastSuccessfulLogin ?? null;

// Computed selectors
export const selectRemainingAttempts = (state: RootState) => 
  (state.login?.maxLoginAttempts ?? 5) - (state.login?.loginAttempts ?? 0);

export const selectIsLockoutActive = (state: RootState) => {
  const login = state.login;
  if (!login?.isLocked || !login?.lockoutExpiresAt) return false;
  return new Date().toISOString() < login.lockoutExpiresAt;
};

export default loginSlice.reducer;
