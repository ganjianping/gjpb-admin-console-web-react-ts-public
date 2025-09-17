import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import I18nProvider and LoginPageComponent (unwrapped since we provide store here)
import { I18nProvider, LoginPageComponent } from './public-api';
import i18n from './config/i18n.config';
import authMfStore from './store';
import { Provider } from 'react-redux';
import './index.css';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Initialize React
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={authMfStore}>
      <I18nProvider 
        i18nInstance={i18n}
        loadingText="Loading translations..."
      >
        <BrowserRouter>
          <LoginPageComponent />
        </BrowserRouter>
      </I18nProvider>
    </Provider>
  </StrictMode>
);
