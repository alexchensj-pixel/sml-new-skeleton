import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { MeshBasicMaterial, SRGBColorSpace, TextureLoader } from 'three';
import { image } from '../legacy/Data/Media.js';

// La sala inicial vive dentro del mismo mundo 3D, no como un background fijo del viewport.
// El plano está anclado al eje del corredor; la arquitectura real de Entrada queda delante.
const ROOM_WALL_Z = -17.5;
const ROOM_ASPECT = 704 / 1525;
const FADE_START_Z = -5;
const FADE_END_Z = -15.5;

export default function EntryRoomBackdrop() {
  const mesh = useRef(null);
  const material = useRef(null);
  const texture = useLoader(TextureLoader, image.heroLab);
  texture.colorSpace = SRGBColorSpace;

  useFrame(({ camera, size }) => {
    if (!mesh.current || !material.current) return;
    const distance = Math.max(0.1, camera.position.z - ROOM_WALL_Z);
    const viewHeight = 2 * distance * Math.tan((camera.fov * Math.PI / 180) / 2);
    const viewWidth = viewHeight * (size.width / Math.max(1, size.height));
    const width = Math.max(viewWidth, viewHeight * ROOM_ASPECT);
    const height = Math.max(viewHeight, viewWidth / ROOM_ASPECT);
    mesh.current.scale.set(width, height, 1);
    mesh.current.position.set(camera.position.x, 2.05, ROOM_WALL_Z);
    const t = Math.min(1, Math.max(0, (FADE_START_Z - camera.position.z) / (FADE_START_Z - FADE_END_Z)));
    material.current.opacity = 1 - t * t * (3 - 2 * t);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={material} map={texture} transparent opacity={1} depthWrite={false} toneMapped />
    </mesh>
  );
}
