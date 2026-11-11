import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraRig from '../legacy/Scene/Camera/index.jsx';
import Lighting from '../legacy/Scene/Lighting/index.jsx';
import Environment from '../legacy/Scene/Environment/index.jsx';
import { segmentKeys } from '../legacy/Data/Content.js';
import { scrollState, setSegment, prefersReducedMotion } from '../legacy/Scene/Transitions/scrollState.js';
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

// La selección ocupa una sola pantalla REAL (explore-dwell), no un hueco para consumir scroll.
// Al entrar en esa región, el reveal se ejecuta por tiempo (1,5 s), no por la velocidad del dedo.
const EXPLORE_START = 0.78;
const EXPLORE_END = 0.90;
const BRIDGE_PHASE_MS = 3000;
const SELECT_REVEAL_MS = 4200;
const EXPLORE_DURATION_MS = BRIDGE_PHASE_MS + SELECT_REVEAL_MS;

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
    let revealFrame = 0;
    let revealStarted = false;
    let revealComplete = false;
    let revealRunning = false;

    const playExploreReveal = () => {
      if (revealStarted) return;
      revealStarted = true;
      // Con movimiento reducido, saltamos directamente al fotograma estático de máxima calidad.
      if (prefersReducedMotion) {
        setSegment('entrada', 1);
        lastChapter = applyRoute(ROUTES[0], EXPLORE_END, lastChapter);
        revealComplete = true;
        return;
      }
      revealRunning = true;
      // La Entrada termina y el umbral HOME → selección se anima por reloj.
      // RosterGroup usa este mismo progreso para opacidad, separación y asentamiento espacial.
      setSegment('entrada', 1);
      setSegment('entrada>character-select', 0.0001);
      const startedAt = performance.now();
      const tick = (now) => {
        const elapsed = Math.max(0, now - startedAt);
        // Primera fase: dejar que el Bridge termine su recorrido sin solaparse con
        // la selección. Segunda fase: reservar 4,2 s completos para revelar los 3 luchadores.
        const bridgeT = clamp(elapsed / BRIDGE_PHASE_MS);
        const revealT = clamp((elapsed - BRIDGE_PHASE_MS) / SELECT_REVEAL_MS);
        const bridgeEase = bridgeT * bridgeT * (3 - 2 * bridgeT);
        const revealEase = revealT * revealT * (3 - 2 * revealT);
        const localProgress = elapsed < BRIDGE_PHASE_MS
          ? 0.82 * bridgeEase
          : 0.82 + 0.18 * revealEase;
        const t = clamp(elapsed / EXPLORE_DURATION_MS);
        const routeProgress = EXPLORE_START + (EXPLORE_END - EXPLORE_START) * localProgress;
        lastChapter = applyRoute(ROUTES[0], routeProgress, lastChapter);
        if (t < 1) {
          revealFrame = requestAnimationFrame(tick);
          return;
        }
        // Pose final: tres figuras asentadas, reveal=1 y capítulo interactivo.
        lastChapter = applyRoute(ROUTES[0], EXPLORE_END, lastChapter);
        revealRunning = false;
        revealComplete = true;
        revealFrame = 0;
        update();
      };
      revealFrame = requestAnimationFrame(tick);
    };

    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const exploreNode = document.querySelector('.explore-dwell');
        const exploreRect = exploreNode?.getBoundingClientRect();
        const exploreTop = exploreRect ? exploreRect.top + y : Infinity;
        const exploreBottom = exploreRect ? exploreRect.bottom + y : -Infinity;
        const exploreVisible = !!exploreRect && exploreRect.top < window.innerHeight * 0.92 && exploreRect.bottom > window.innerHeight * 0.08;
        // También detecta un salto de scroll que haya cruzado el borde entre dos frames.
        const exploreReached = !!exploreRect && y + window.innerHeight * 0.92 >= exploreTop && y < exploreBottom + window.innerHeight;

        // Al entrar la escena en pantalla se dispara una sola vez. El scroll puede continuar:
        // no modifica la animación ni puede dejar a los luchadores a medio revelar.
        if ((exploreVisible || exploreReached) && !revealStarted) {
          playExploreReveal();
          return;
        }
        if (revealRunning || (exploreVisible && revealComplete)) return;
        // Si se vuelve hacia arriba y se abandona la escena, se permite reproducirla de nuevo.
        if (!exploreVisible && exploreNode && y < exploreTop) {
          revealStarted = false;
          revealComplete = false;
        }

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
            const progress = clamp((y - start) / Math.max(1, end - start));
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
      if (revealFrame) cancelAnimationFrame(revealFrame);
    };
  }, []);

  return (
    <div className="world" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2.5]}
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
