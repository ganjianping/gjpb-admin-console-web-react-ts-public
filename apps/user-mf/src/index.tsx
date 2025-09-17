import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import i18n configuration
import './shared/utils/i18n';

// Import our components through the barrel exports
import { UsersPage } from './public-api';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Initialize React
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <UsersPage />
    </BrowserRouter>
  </StrictMode>
);
