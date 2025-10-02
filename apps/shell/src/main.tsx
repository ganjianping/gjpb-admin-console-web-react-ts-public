import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './index.css'
import '../../shared-lib/src/utils/i18n' // Initialize i18n
import './config/i18n.config' // Load shell-specific translations (dashboard)
import '../../shared-lib/src/services/firebase-config.service' // Initialize Firebase Performance Monitoring
import { store } from './redux/store'
import ThemeProvider from './theme/ThemeProvider'
import AppLoading from './components/AppLoading'

// Lazy load the routes for better initial loading performance
const AppRoutes = lazy(() => import('./routes/AppRoutes'))

// Improved mounting with error boundaries
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
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
