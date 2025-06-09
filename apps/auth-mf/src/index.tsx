import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import our new TranslationProvider and LoginPage through the barrel exports
import { TranslationProvider, LoginPage } from './exports';
import './index.css';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Initialize React
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <TranslationProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </TranslationProvider>
  </StrictMode>
);
