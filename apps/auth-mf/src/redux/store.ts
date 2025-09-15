import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';

// Configure the auth-mf specific store
export const authMfStore = configureStore({
  reducer: {
    login: loginReducer,
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

// Export types
export type RootState = ReturnType<typeof authMfStore.getState>;
export type AppDispatch = typeof authMfStore.dispatch;

export default authMfStore;
