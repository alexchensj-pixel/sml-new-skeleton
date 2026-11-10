import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraRig from '../legacy/Scene/Camera/index.jsx';
import Lighting from '../legacy/Scene/Lighting/index.jsx';
import Environment from '../legacy/Scene/Environment/index.jsx';
import { segmentKeys } from '../legacy/Data/Content.js';
import { scrollState, setSegment } from '../legacy/Scene/Transitions/scrollState.js';
import { useStore } from '../legacy/App/store.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// The existing page sections remain the only DOM chapters. The original 3D Discover
// room is traversed inside the Home → Method passage; it does not create another page.
const ROUTES = [
  { id: 'inicio', steps: [
    { key: 'entrada', from: 0, to: 0.78 },
    { key: 'entrada>character-select', from: 0.78, to: 0.90 },
    { key: 'character-select', from: 0.90, to: 1 },
  ] },
  { id: 'metodo', steps: [
    { key: 'asesoria-lab', from: 0, to: 0.12 },
    { key: 'asesoria-lab', from: 0.12, to: 1 },
  ] },
  { id: 'entrenamiento', steps: [
    { key: 'asesoria-lab>slot', from: 0, to: 0.12 },
    { key: 'slot', from: 0.12, to: 1 },
  ] },
  { id: 'alex', steps: [
    { key: 'slot>proof-chen', from: 0, to: 0.12 },
    { key: 'proof-chen', from: 0.12, to: 1 },
  ] },
  { id: 'reserva', steps: [
    { key: 'proof-chen>reserva', from: 0, to: 0.12 },
    { key: 'reserva', from: 0.12, to: 1 },
  ] },
];

// El 3D (Scene/Transitions/scrollState.js#isExploreActive) solo acepta toques sobre los luchadores cuando el umbral
// 'entrada>character-select' esta COMPLETO (>= .999). El overlay de Explore debe mostrarse justo entonces, no antes: si no,
// hay un tramo con panel visible y luchadores que no responden.
const CHAPTER_GATE = { 'entrada>character-select': 0.999 };
const chapterFor = (key, progress) => {
  if (!key.includes('>')) return key;
  const [from, to] = key.split('>');
  return progress >= (CHAPTER_GATE[key] ?? 0.72) ? to : from;
};

// Permanencia de EXPLORE. Original: 120vh de scroll propio; en la preview todo Inicio -> Explore cabia en ~1 pantalla y Explore
// recibia ~10vh (imposible quedarse a tocar un luchador). En movil vertical hay un hueco transparente (.explore-dwell, entre
// #inicio y #metodo): el recorrido previo (entrada + umbral) conserva su ritmo y Explore (progreso EXPLORE_AT..1) recorre el hueco.
const EXPLORE_AT = 0.90; // = 'from' del paso 'character-select' en ROUTES.inicio
function withExploreDwell(progress, px, total) {
  const dwell = document.querySelector('.explore-dwell')?.offsetHeight || 0;
  if (dwell <= 0 || dwell >= total) return progress;
  const body = total - dwell;
  return px <= body
    ? clamp(px / body) * EXPLORE_AT
    : EXPLORE_AT + (1 - EXPLORE_AT) * clamp((px - body) / dwell);
}

function applyRoute(route, progress, lastChapter) {
  const step = route.steps.find((item, index) => progress < item.to || index === route.steps.length - 1);
  const index = segmentKeys.indexOf(step.key);
  if (index < 0) return lastChapter;
  const local = clamp((progress - step.from) / Math.max(0.0001, step.to - step.from));
  // Keep the already-traversed segments complete, the active one live, and future
  // segments reset. This makes the original camera path reversible on upward scroll.
  segmentKeys.forEach((key, i) => {
    scrollState.segments[key] = i < index ? 1 : i === index ? Math.max(0.0001, local) : 0;
  });
  setSegment(step.key, Math.max(0.0001, local));
  const chapter = chapterFor(step.key, local);
  if (chapter !== lastChapter) useStore.getState().setActiveChapter(chapter);
  return chapter;
}

export default function LegacyWorld() {
  useEffect(() => {
    let lastChapter = '';
    let frame = 0;
    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const sections = ROUTES.map((route) => ({
          route,
          node: document.getElementById(route.id),
        })).filter((item) => item.node);
        if (!sections.length) return;
        for (let i = 0; i < sections.length; i += 1) {
          const start = sections[i].node.getBoundingClientRect().top + y;
          // Reserva ends where the existing Empresas section begins. Keep the camera
          // parked at the final Door pose throughout B2B instead of scrolling past it.
          const next = sections[i + 1]?.node || (sections[i].route.id === 'reserva' ? document.getElementById('empresas') : null);
          const end = next ? next.getBoundingClientRect().top + y : Math.max(start + 1, document.documentElement.scrollHeight - window.innerHeight);
          if (y >= start && (y < end || i === sections.length - 1)) {
            let progress = clamp((y - start) / Math.max(1, end - start));
            if (sections[i].route.id === 'inicio') progress = withExploreDwell(progress, y - start, Math.max(1, end - start));
            lastChapter = applyRoute(sections[i].route, progress, lastChapter);
            return;
          }
        }
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="world" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 50, near: 0.1, far: 220, position: [0, 1.6, 0] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050608']} />
        <fog attach="fog" args={['#050608', 12, 75]} />
        <CameraRig />
        <Suspense fallback={null}>
          <Lighting />
          <Environment />
        </Suspense>
      </Canvas>
    </div>
  );
}
