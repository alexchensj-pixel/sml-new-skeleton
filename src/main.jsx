import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const LegacyRouter = lazy(() => import('./legacy/LegacyRouter.jsx'));
const path = window.location.pathname.replace(/\/+$/, '') || '/';
const isLegacyRoute = path !== '/';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isLegacyRoute
      ? <Suspense fallback={<div className="route-loading" aria-label="Cargando" />}><LegacyRouter /></Suspense>
      : <App />}
  </React.StrictMode>
);
