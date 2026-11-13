import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content.trimStart());

write('src/legacy/Scene/Environment/RosterGroup.jsx', `
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, DoubleSide, MathUtils, ShaderMaterial, TextureLoader, Vector2 } from 'three';
import { useStore } from '../../App/store.js';
import { getCharactersReveal } from '../Transitions/scrollState.js';
import { disciplines } from '../../Data/Disciplines.js';
import { CELL, cellX, layoutK, exploreLayoutAspect } from './cells.js';

// La misma imagen individual alimenta el overview y el estado enfocado.
// Así no hay recorte de un vídeo de grupo ni salto de identidad al seleccionar.
const GAIN_IDLE = 1.0;
const GAIN_DIM = 0.68;
const APPROACH_Z = 14;

const VERT = \`varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`;

const FRAG = \`uniform sampler2D uStill;
uniform float uGain;
uniform float uReflect;
uniform vec2 uRange;
varying vec2 vUv;
void main() {
  vec2 uv = vec2(mix(uRange.x, uRange.y, vUv.x), vUv.y);
  vec3 c = pow(max(texture2D(uStill, uv).rgb, vec3(0.0)), vec3(0.82));
  float f = 1.0;
  if (uReflect > 0.5) f = (1.0 - smoothstep(0.0, 0.42, vUv.y)) * 0.35;
  gl_FragColor = vec4(c * uGain * f, 1.0);
}\`;

function makeMaterial(still, reflect) {
  return new ShaderMaterial({
    uniforms: {
      uStill: { value: still }, uGain: { value: 0 },
      uReflect: { value: reflect ? 1 : 0 }, uRange: { value: new Vector2(0, 1) },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    toneMapped: false,
  });
}

export default function RosterGroup() {
  const state = useRef({ gain: disciplines.map(() => 0) });
  const approach = useRef(null);
  const mainGroups = useRef([]);
  const reflGroups = useRef([]);
  const mainMeshes = useRef([]);
  const reflMeshes = useRef([]);

  const entries = useMemo(() => disciplines.map((discipline, index) => {
    const still = new TextureLoader().load(discipline.poster);
    const h = CELL.fighterHeight / (discipline.stage.bot - discipline.stage.top);
    const w = h * discipline.stage.ar;
    const cy = (discipline.stage.bot - 0.5) * h;
    const x = (0.5 - discipline.stage.cx) * w;
    return {
      id: discipline.id,
      index,
      w, h, cy, x,
      main: makeMaterial(still, false),
      refl: makeMaterial(still, true),
    };
  }), []);

  useFrame(({ size }, dt) => {
    const focused = useStore.getState().selectedDiscipline;
    const focusedIdx = disciplines.findIndex((d) => d.id === focused);
    const reveal = getCharactersReveal();
    const aspect = exploreLayoutAspect(size.width, size.height);
    const horizontalScale = layoutK(aspect);

    if (approach.current) approach.current.position.z = APPROACH_Z * (1 - reveal);

    entries.forEach((entry, i) => {
      const isFocused = focusedIdx === i;
      const targetGain = focusedIdx < 0 ? GAIN_IDLE : isFocused ? 0 : GAIN_DIM;
      state.current.gain[i] = MathUtils.damp(state.current.gain[i], targetGain, 4, dt);
      entry.main.uniforms.uGain.value = state.current.gain[i] * reveal;
      entry.refl.uniforms.uGain.value = state.current.gain[i] * reveal;

      const x = cellX(i) * horizontalScale * reveal;
      if (mainGroups.current[i]) mainGroups.current[i].position.x = x;
      if (reflGroups.current[i]) reflGroups.current[i].position.x = x;
    });
  });

  return (
    <group ref={approach}>
      <group position={[0, CELL.feetY, 0]}>
        {entries.map((entry, i) => (
          <group key={entry.id} ref={(el) => (mainGroups.current[i] = el)}>
            <mesh ref={(el) => (mainMeshes.current[i] = el)} position={[entry.x, entry.cy, 0]} material={entry.main}>
              <planeGeometry args={[entry.w, entry.h]} />
            </mesh>
          </group>
        ))}
      </group>
      <group scale={[1, -1, 1]}>
        {entries.map((entry, i) => (
          <group key={entry.id} ref={(el) => (reflGroups.current[i] = el)}>
            <mesh ref={(el) => (reflMeshes.current[i] = el)} position={[entry.x, CELL.feetY + entry.cy, 0]} material={entry.refl}>
              <planeGeometry args={[entry.w, entry.h]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
`);

write('src/legacy/Scene/Environment/Fighter.jsx', `
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, DoubleSide, MathUtils, ShaderMaterial, TextureLoader } from 'three';
import { useStore } from '../../App/store.js';
import { getCharactersReveal } from '../Transitions/scrollState.js';
import { CELL } from './cells.js';

const VERT = \`varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\`;

const FRAG = \`uniform sampler2D uStill;
uniform float uGain;
uniform float uReflect;
varying vec2 vUv;
void main() {
  vec3 c = pow(max(texture2D(uStill, vUv).rgb, vec3(0.0)), vec3(0.82));
  float f = 1.0;
  if (uReflect > 0.5) f = (1.0 - smoothstep(0.0, 0.42, vUv.y)) * 0.35;
  gl_FragColor = vec4(c * uGain * f, 1.0);
}\`;

function makeMaterial(still, reflect) {
  return new ShaderMaterial({
    uniforms: { uStill: { value: still }, uGain: { value: 0 }, uReflect: { value: reflect ? 1 : 0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    toneMapped: false,
  });
}

export default function Fighter({ discipline }) {
  const { id, poster, stage } = discipline;
  const group = useRef(null);
  const mirror = useRef(null);
  const state = useRef({ gain: 0, scale: 1 });

  const media = useMemo(() => {
    const still = new TextureLoader().load(poster);
    return { main: makeMaterial(still, false), refl: makeMaterial(still, true) };
  }, [poster]);

  const geo = useMemo(() => {
    const h = CELL.fighterHeight / (stage.bot - stage.top);
    const w = h * stage.ar;
    return { w, h, x: (0.5 - stage.cx) * w, cy: (stage.bot - 0.5) * h };
  }, [stage]);

  useFrame((_, dt) => {
    const focused = useStore.getState().selectedDiscipline;
    const isFocus = focused === id;
    const s = state.current;
    s.gain = MathUtils.damp(s.gain, isFocus ? 1 : 0, 4, dt);
    s.scale = MathUtils.damp(s.scale, focused ? (isFocus ? 1.12 : 0.95) : 1, 4, dt);
    if (group.current) group.current.scale.set(s.scale, s.scale, 1);
    if (mirror.current) mirror.current.scale.set(s.scale, -s.scale, 1);
    const gain = s.gain * getCharactersReveal();
    media.main.uniforms.uGain.value = gain;
    media.refl.uniforms.uGain.value = gain;
  });

  return (
    <group>
      <group ref={group} position={[0, CELL.feetY, 0]}>
        <mesh position={[geo.x, geo.cy, 0]} material={media.main}>
          <planeGeometry args={[geo.w, geo.h]} />
        </mesh>
      </group>
      <group ref={mirror} position={[0, 0, 0]} scale={[1, -1, 1]}>
        <mesh position={[geo.x, CELL.feetY + geo.cy, 0]} material={media.refl}>
          <planeGeometry args={[geo.w, geo.h]} />
        </mesh>
      </group>
    </group>
  );
}
`);

// Remove obsolete character-video imports from the copied data modules as well.
const disciplinesPath = path.join(root, 'src/legacy/Data/Disciplines.js');
let disciplinesSource = fs.readFileSync(disciplinesPath, 'utf8');
disciplinesSource = disciplinesSource.replace("import { video, poster } from './Media.js';", "import { poster } from './Media.js';");
for (const key of ['boxeo', 'k1', 'muayThai']) disciplinesSource = disciplinesSource.replace(`video: video.${key}, `, '');
fs.writeFileSync(disciplinesPath, disciplinesSource);

const mediaPath = path.join(root, 'src/legacy/Data/Media.js');
let mediaSource = fs.readFileSync(mediaPath, 'utf8');
const LF = String.fromCharCode(10);
mediaSource = mediaSource.split(LF).filter((line) => ![
  "import boxeoCell from '../Assets/Video/boxeo-cell.mp4';",
  "import k1Cell from '../Assets/Video/k1-cell.mp4';",
  "import muayThaiCell from '../Assets/Video/muay-thai-cell.mp4';",
  "import rosterCompleto from '../Assets/Video/roster-completo.mp4';",
  "import stillRoster from '../Assets/Images/roster-completo-poster.jpg';",
].includes(line)).join(LF);
const videoStart = mediaSource.indexOf('export const video = {');
const videoEnd = mediaSource.indexOf(LF + '};', videoStart);
if (videoStart < 0 || videoEnd < 0) throw new Error('Expected character video export not found in Media.js');
mediaSource = mediaSource.slice(0, videoStart) + 'export const video = { tysonBridge, mcgregorBridge };' + mediaSource.slice(videoEnd + 3);
mediaSource = mediaSource.replace(
  'export const poster = { boxeo: stillBoxeo, k1: stillK1, muayThai: stillMuayThai, roster: stillRoster };',
  'export const poster = { boxeo: stillBoxeo, k1: stillK1, muayThai: stillMuayThai };'
);
fs.writeFileSync(mediaPath, mediaSource);
