import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './index.css'
import '../../shared-lib/src/i18n/i18n' // Initialize i18n
import './core/config/translations' // Load shell-specific translations (dashboard)
import '../../shared-lib/src/firebase/firebase-config.service' // Initialize Firebase Performance Monitoring
import { store } from './core/store/store'
import ThemeProvider from './theme/components/ThemeProvider'
import AppLoading from './core/components/AppLoading'

// Lazy load the routes for better initial loading performance
const AppRoutes = lazy(() => import('./navigation/routes/AppRoutes'))

// Improved mounting with error boundaries
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// import.meta.env typing can be missing; safely read BASE_URL at runtime
const __basename = (import.meta as any).env?.BASE_URL ?? '/';

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter
        basename={__basename}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          <Suspense fallback={<AppLoading />}>
            <AppRoutes />
          </Suspense>
          <Toaster position="top-right" />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
