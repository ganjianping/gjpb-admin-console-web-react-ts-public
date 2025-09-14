import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import I18nProvider and LoginPage through the barrel exports
import { I18nProvider, LoginPage } from './exports';
import i18n from './utils/i18n';
import './index.css';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Initialize React
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <I18nProvider 
      i18nInstance={i18n}
      loadingText="Loading translations..."
    >
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>
);
