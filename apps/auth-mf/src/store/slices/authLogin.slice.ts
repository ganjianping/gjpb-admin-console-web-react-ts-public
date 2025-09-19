import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authenticationService } from '../../services/authentication.service';
import type { LoginCredentials, AuthResponse } from '../../../../shared-lib/src/services/auth-service';
import { ApiError } from '../../../../shared-lib/src/services/api-client';
import type { RootState } from '../index';

// Login form state interface
interface AuthLoginState {
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
const initialState: AuthLoginState = {
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

// Async thunk for login authentication
export const performLogin = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string; state: { authLogin: AuthLoginState } }
>('authLogin/performLogin', async (credentials, { rejectWithValue, getState }) => {
  const state = getState();
  
  // Check if account is locked
  if (state.authLogin.isLocked) {
    const lockoutExpiry = state.authLogin.lockoutExpiresAt;
    if (lockoutExpiry && new Date().toISOString() < lockoutExpiry) {
      return rejectWithValue('Account is temporarily locked due to too many failed attempts. Please try again later.');
    }
  }

  try {
    const response = await authenticationService.authenticate(credentials);
    
    // Communicate success to shell after successful authentication
    if (typeof window !== 'undefined' && window.onAuthLoginSuccess) {
      window.onAuthLoginSuccess(response);
    }
    
    return response;
  } catch (error: unknown) {
    console.error('[AuthLoginSlice] Login error:', error);
    
    // Determine error message
    let errorMessage: string;
    if (error instanceof ApiError) {
      errorMessage = error.message || 'Login failed';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Login failed: Unknown error occurred';
    }
    
    // Communicate failure to shell
    if (typeof window !== 'undefined' && window.onAuthLoginFailure) {
      window.onAuthLoginFailure(errorMessage);
    }
    
    return rejectWithValue(errorMessage);
  }
});

// Auth Login slice
const authLoginSlice = createSlice({
  name: 'authLogin',
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
} = authLoginSlice.actions;

// Selectors
export const selectIsLoading = (state: RootState) => state.authLogin?.isLoading ?? false;
export const selectAuthError = (state: RootState) => state.authLogin?.error ?? null;
export const selectLoginAttempts = (state: RootState) => state.authLogin?.loginAttempts ?? 0;
export const selectIsLocked = (state: RootState) => state.authLogin?.isLocked ?? false;
export const selectLockoutExpiresAt = (state: RootState) => state.authLogin?.lockoutExpiresAt ?? null;
export const selectRememberMe = (state: RootState) => state.authLogin?.rememberMe ?? false;
export const selectLastSuccessfulLogin = (state: RootState) => state.authLogin?.lastSuccessfulLogin ?? null;

// Computed selectors
export const selectRemainingAttempts = (state: RootState) => 
  (state.authLogin?.maxLoginAttempts ?? 5) - (state.authLogin?.loginAttempts ?? 0);

export const selectIsLockoutActive = (state: RootState) => {
  const authLogin = state.authLogin;
  if (!authLogin?.isLocked || !authLogin?.lockoutExpiresAt) return false;
  return new Date().toISOString() < authLogin.lockoutExpiresAt;
};

export default authLoginSlice.reducer;
