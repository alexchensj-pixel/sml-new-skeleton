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

// The new skeleton remains the host project; the pinned original app supplies the complete product modules.
copy(path.join(legacy, 'src'), path.join(root, 'src'));
copy(path.join(legacy, 'server'), path.join(root, 'server'));
copy(path.join(legacy, 'netlify/functions'), path.join(root, 'netlify/functions'));
copy(path.join(legacy, 'vite.config.js'), path.join(root, 'vite.config.js'));

// Bring the course academy into the same Vite application instead of building a second site under /academia.
copy(path.join(academy, 'src/Academy'), path.join(root, 'src/Academy'));
copy(path.join(academy, 'src/Assets/Images/academy'), path.join(root, 'src/Assets/Images/academy'));
copy(path.join(academy, 'src/Assets/Video/academy'), path.join(root, 'src/Assets/Video/academy'));
copy(path.join(academy, 'server/academyContent.mjs'), path.join(root, 'server/academyContent.mjs'));
copy(path.join(academy, 'netlify/functions/academy-content.mjs'), path.join(root, 'netlify/functions/academy-content.mjs'));

// Route all public, client and legal experiences through one application entry point.
fs.writeFileSync(path.join(root, 'src/main.jsx'), `import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App/App.jsx';
import LegalPage from './UI/Legal/LegalPage.jsx';
import { RUTAS } from './Data/Legal.js';
import './styles/global.css';
const MiSML = lazy(() => import('./Client/MiSML.jsx'));
const Academia = lazy(() => import('./Academy/Academia.jsx'));
const ruta = window.location.pathname.replace(/\\/+$/, '') || '/';
const legalTipo = ruta === RUTAS.privacidad ? 'privacidad' : ruta === RUTAS.aviso ? 'aviso' : null;
const esMiSML = ruta === '/mi-sml' || ruta.startsWith('/mi-sml/');
const esAcademia = ruta === '/academia' || ruta.startsWith('/academia/');
if (!legalTipo && !esMiSML && !esAcademia) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {esMiSML ? <Suspense fallback={null}><MiSML /></Suspense>
      : esAcademia ? <Suspense fallback={null}><Academia /></Suspense>
      : legalTipo ? <LegalPage tipo={legalTipo} /> : <App />}
  </React.StrictMode>
);
`);
console.log('SML legacy modules synchronised into the new skeleton project.');
