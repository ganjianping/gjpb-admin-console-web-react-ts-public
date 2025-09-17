import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authenticationService } from '../../services/authentication.service';
import type { LoginCredentials, AuthResponse } from '../../../../shared-lib/src/services/auth-service';
import { ApiError } from '../../../../shared-lib/src/services/api-client';
import type { RootState } from '../index';

// Login form state interface
interface AuthenticationState {
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
const initialState: AuthenticationState = {
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

// Async thunk for authentication
export const performAuthentication = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string; state: { authentication: AuthenticationState } }
>('authentication/performAuthentication', async (credentials, { rejectWithValue, getState }) => {
  const state = getState();
  
  // Check if account is locked
  if (state.authentication.isLocked) {
    const lockoutExpiry = state.authentication.lockoutExpiresAt;
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
    console.error('[LoginSlice] Login error:', error);
    
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

// Authentication slice
const authenticationSlice = createSlice({
  name: 'authentication',
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
      .addCase(performAuthentication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastLoginAttempt = new Date().toISOString();
      })
      .addCase(performAuthentication.fulfilled, (state) => {
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
      .addCase(performAuthentication.rejected, (state, action) => {
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
} = authenticationSlice.actions;

// Selectors
export const selectIsLoading = (state: RootState) => state.authentication?.isLoading ?? false;
export const selectAuthError = (state: RootState) => state.authentication?.error ?? null;
export const selectLoginAttempts = (state: RootState) => state.authentication?.loginAttempts ?? 0;
export const selectIsLocked = (state: RootState) => state.authentication?.isLocked ?? false;
export const selectLockoutExpiresAt = (state: RootState) => state.authentication?.lockoutExpiresAt ?? null;
export const selectRememberMe = (state: RootState) => state.authentication?.rememberMe ?? false;
export const selectLastSuccessfulLogin = (state: RootState) => state.authentication?.lastSuccessfulLogin ?? null;

// Computed selectors
export const selectRemainingAttempts = (state: RootState) => 
  (state.authentication?.maxLoginAttempts ?? 5) - (state.authentication?.loginAttempts ?? 0);

export const selectIsLockoutActive = (state: RootState) => {
  const authentication = state.authentication;
  if (!authentication?.isLocked || !authentication?.lockoutExpiresAt) return false;
  return new Date().toISOString() < authentication.lockoutExpiresAt;
};

export default authenticationSlice.reducer;
