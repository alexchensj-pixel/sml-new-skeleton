import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacy = path.join(root, 'current-site');
const academy = path.join(legacy, 'sml-v31/sml-v31-academy');
const copy = (from, to) => {
  if (!fs.existsSync(from)) throw new Error(`SML migration source missing: ${path.relative(root, from)}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, force: true });
};

// Keep the immersive skeleton as the actual home application. The original product
// modules live in an isolated namespace and are mounted only on their own routes.
copy(path.join(legacy, 'src'), path.join(root, 'src/legacy'));
copy(path.join(legacy, 'server'), path.join(root, 'server'));
copy(path.join(legacy, 'netlify/functions'), path.join(root, 'netlify/functions'));
copy(path.join(legacy, 'vite.config.js'), path.join(root, 'vite.config.js'));

// Keep the original academy's relative imports and media paths intact.
copy(path.join(academy, 'src/Academy'), path.join(root, 'src/legacy/Academy'));
copy(path.join(academy, 'src/Assets/Images/academy'), path.join(root, 'src/legacy/Assets/Images/academy'));
copy(path.join(academy, 'src/Assets/Video/academy'), path.join(root, 'src/legacy/Assets/Video/academy'));
copy(path.join(academy, 'server/academyContent.mjs'), path.join(root, 'server/academyContent.mjs'));
copy(path.join(academy, 'netlify/functions/academy-content.mjs'), path.join(root, 'netlify/functions/academy-content.mjs'));

// The legacy Vite plugins remain available for local API parity and structured data,
// but the original app's source now lives under src/legacy.
const vitePath = path.join(root, 'vite.config.js');
let vite = fs.readFileSync(vitePath, 'utf8');
vite = vite.replace("./src/Data/Content.js", "./src/legacy/Data/Content.js");
fs.writeFileSync(vitePath, vite);

fs.writeFileSync(path.join(root, 'src/legacy/LegacyRouter.jsx'), `import React from 'react';
import AppOriginal from './App/App.jsx';
import MiSML from './Client/MiSML.jsx';
import Academia from './Academy/Academia.jsx';
import LegalPage from './UI/Legal/LegalPage.jsx';
import { RUTAS } from './Data/Legal.js';
import './styles/global.css';

export default function LegacyRouter() {
  const path = window.location.pathname.replace(/\\/+$/, '') || '/';
  if (path === '/mi-sml' || path.startsWith('/mi-sml/')) return <MiSML />;
  if (path === '/academia' || path.startsWith('/academia/')) return <Academia />;
  if (path === RUTAS.privacidad) return <LegalPage tipo="privacidad" />;
  if (path === RUTAS.aviso) return <LegalPage tipo="aviso" />;
  return <AppOriginal />;
}
`);

fs.writeFileSync(path.join(root, 'src/main.jsx'), `import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const LegacyRouter = lazy(() => import('./legacy/LegacyRouter.jsx'));
const path = window.location.pathname.replace(/\\/+$/, '') || '/';
const isLegacyRoute = path !== '/';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isLegacyRoute
      ? <Suspense fallback={<div className="route-loading" aria-label="Cargando" />}><LegacyRouter /></Suspense>
      : <App />}
  </React.StrictMode>
);
`);
console.log('Hybrid routing ready: immersive skeleton at /; original Mi SML, Academy and legal modules on their own routes.');
