import { configureStore } from '@reduxjs/toolkit';
import authLoginReducer from './slices/authLogin.slice';

let authMfStoreInstance: ReturnType<typeof createAuthMfStore> | null = null;

// Factory function to create store
const createAuthMfStore = () => {
  return configureStore({
    reducer: {
      authLogin: authLoginReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types for serializable check
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Lazy getter - creates store only when first accessed
export const getAuthMfStore = () => {
  if (!authMfStoreInstance) {
    console.log('[Auth-MF] Creating store instance');
    authMfStoreInstance = createAuthMfStore();
  }
  return authMfStoreInstance;
};

// Cleanup function for when auth-mf unmounts
export const destroyAuthMfStore = () => {
  if (authMfStoreInstance) {
    console.log('[Auth-MF] Destroying store instance');
    authMfStoreInstance = null;
  }
};

// Export the lazy store getter as default for backwards compatibility
export const authMfStore = getAuthMfStore();

// Export types
export type AuthMfStore = ReturnType<typeof createAuthMfStore>;
export type RootState = ReturnType<AuthMfStore['getState']>;
export type AppDispatch = AuthMfStore['dispatch'];

export default authMfStore;
