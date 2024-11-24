import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './lib/utils/error-boundary';
import { DevAuthProvider } from './lib/auth/DevAuthProvider';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DevAuthProvider>
        <App />
      </DevAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);