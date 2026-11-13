import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacy = path.join(root, 'current-site');
const academy = path.join(legacy, 'sml-v31/sml-v31-academy');

// Netlify may check out the superproject without populating the public legacy submodule.
// Initialize only this direct submodule (the Academy directory is tracked inside it).
if (!fs.existsSync(path.join(legacy, 'src'))) {
  execFileSync('git', ['submodule', 'update', '--init', 'current-site'], { cwd: root, stdio: 'inherit' });
}
const copy = (from, to) => {
  if (!fs.existsSync(from)) throw new Error(`SML migration source missing: ${path.relative(root, from)}`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, force: true });
};

// Keep the immersive skeleton as the actual home application. The original product modules live in an isolated namespace.
copy(path.join(legacy, 'src'), path.join(root, 'src/legacy'));

// Preserve the original 3D roster layer. RosterGroup is the overview state for the three fighters;
// it is synchronized with the individual Fighter videos through getCharactersReveal().
copy(path.join(legacy, 'server'), path.join(root, 'server'));
copy(path.join(legacy, 'netlify/functions'), path.join(root, 'netlify/functions'));
copy(path.join(legacy, 'vite.config.js'), path.join(root, 'vite.config.js'));

// Keep the academy's relative imports and media paths intact.
copy(path.join(academy, 'src/Academy'), path.join(root, 'src/legacy/Academy'));
copy(path.join(academy, 'src/Assets/Images/academy'), path.join(root, 'src/legacy/Assets/Images/academy'));
copy(path.join(academy, 'src/Assets/Video/academy'), path.join(root, 'src/legacy/Assets/Video/academy'));
copy(path.join(academy, 'server/academyContent.mjs'), path.join(root, 'server/academyContent.mjs'));
copy(path.join(academy, 'netlify/functions/academy-content.mjs'), path.join(root, 'netlify/functions/academy-content.mjs'));

// Academy.jsx was moved one directory deeper; point its server import to the root server module.
const academyEntry = path.join(root, 'src/legacy/Academy/Academia.jsx');
let academySource = fs.readFileSync(academyEntry, 'utf8');
academySource = academySource.replaceAll('../../server/academyContent.mjs', '../../../server/academyContent.mjs');
fs.writeFileSync(academyEntry, academySource);

const vitePath = path.join(root, 'vite.config.js');
let vite = fs.readFileSync(vitePath, 'utf8');
vite = vite.replace('./src/Data/Content.js', './src/legacy/Data/Content.js');
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
// Preview-only scene corrections: keep the pinned legacy source untouched while applying
// deterministic fixes after sync-legacy copies it into the immersive app.
const patchCopiedSource = (relativePath, before, after) => {
  const target = path.join(root, relativePath);
  const source = fs.readFileSync(target, 'utf8');
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Expected scene source not found in ${relativePath}`);
  fs.writeFileSync(target, source.replace(before, after));
};

// Static character portraits: never start the roster video loop. Selection still controls focus/scale.
;
;
;

;
// Lift dark character detail without changing the black background: zero remains zero,
// while low/mid tones become readable on mobile and desktop. No camera/scroll/layout changes.
;


patchCopiedSource(
  'src/legacy/Scene/Environment/cells.js',
  'return { split: false, fx: 1, fy: EXPLORE_STACK_FY, cx: 0.5, cy: EXPLORE_STACK_FY / 2 };',
  [
    'const viewportHeight = Math.max(height, 1);',
    'const topInset = Math.min(86, viewportHeight * 0.14); // 70px mobile header + 16px clear space.',
    'return { split: false, fx: 1, fy: EXPLORE_STACK_FY, cx: 0.5, cy: topInset / viewportHeight + EXPLORE_STACK_FY / 2 };'
  ].join('\n')
);
// Commercial copy and lighting refinements for the immersive preview.
patchCopiedSource(
  'src/legacy/Data/Content.js',
  "titulo: ['Tu técnica.', 'Tu estrategia.', 'Tu forma de combatir.']",
  "titulo: ['Entrenamiento privado', 'de deportes de combate', 'en Madrid.']"
);
patchCopiedSource(
  'src/legacy/Data/Content.js',
  "ctaReservar: 'Reservar evaluación · 30 €'",
  "ctaReservar: 'Empezar mi entrenamiento'"
);
patchCopiedSource(
  'src/legacy/Data/Content.js',
  "contexto: 'Sesiones privadas · Parejas y grupos reducidos'",
  "contexto: 'Entrenamiento privado en Madrid · Análisis técnico · Seguimiento personal'"
);
patchCopiedSource(
  'src/legacy/Data/Content.js',
  "texto: 'Una primera sesión privada para conocerte, observar cómo te mueves y entender qué necesitas.'",
  "texto: 'No es una clase de prueba: es una sesión privada para analizar tu punto de partida, observar cómo te mueves y definir qué necesitas trabajar.'"
);
;
;
;
;
console.log('Hybrid routing ready: immersive skeleton at /; original Mi SML, Academy and legal modules on their own routes.');

// One static source of truth for roster and focused character portraits.
execFileSync(process.execPath, [path.join(root, 'scripts/patch-character-layer.mjs')], { cwd: root, stdio: 'inherit' });
