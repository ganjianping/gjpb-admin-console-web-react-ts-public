import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import I18nProvider and LoginPageComponent (unwrapped since we provide store here)
import { I18nProvider, LoginPageComponent } from './exports';
import i18n from './utils/i18n';
import authMfStore from './redux/store';
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
