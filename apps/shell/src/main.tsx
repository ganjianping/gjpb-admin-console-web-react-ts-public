import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './index.css'
import '../../shared-lib/src/utils/i18n' // Initialize i18n
import { store } from './redux/store'
import ThemeProvider from './theme/ThemeProvider'
import CSRFInitializer from './components/CSRFInitializer'

// Lazy load the routes for better initial loading performance
const AppRoutes = lazy(() => import('./routes/AppRoutes'))

// Performance monitoring in production only
// Only load in production to avoid unnecessary overhead
const isProd = window.location.hostname !== 'localhost';
if (isProd) {
  // We use dynamic import() for code splitting
  // This avoids loading the reportWebVitals code in development
  import('./utils/reportWebVitals')
    .then(({ reportWebVitals }) => reportWebVitals())
    .catch(err => console.warn('Could not initialize performance monitoring', err));
}

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
          <CSRFInitializer>
            <Suspense fallback={<div className="app-loading">Loading application...</div>}>
              <AppRoutes />
            </Suspense>
            <Toaster position="top-right" />
          </CSRFInitializer>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
