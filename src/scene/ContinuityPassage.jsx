import React from 'react';

// Continuación física del corredor: une el final del Bridge (-26 m) con la entrada de Método (-75 m).
// No es un fondo 2D: son suelo, pórticos, pilares y líneas de luz dentro del mismo mundo 3D.
const START_Z = -25.5;
const END_Z = -76;
const LENGTH = START_Z - END_Z;
const MID_Z = (START_Z + END_Z) / 2;
const WIDTH = 19.2;
const FRAME_COUNT = 12;
const FRAME_STEP = LENGTH / (FRAME_COUNT - 1);
const frameZ = Array.from({ length: FRAME_COUNT }, (_, i) => START_Z - i * FRAME_STEP);

export default function ContinuityPassage() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.035, MID_Z]} receiveShadow>
        <planeGeometry args={[WIDTH, LENGTH]} />
        <meshStandardMaterial color="#171d27" roughness={0.82} metalness={0.24} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 8.8, 0, 0]}>
          <mesh position={[0, 5.9, MID_Z]} receiveShadow>
            <boxGeometry args={[0.42, 11.8, LENGTH]} />
            <meshStandardMaterial color="#202833" roughness={0.68} metalness={0.48} />
          </mesh>
          <mesh position={[0, 0.14, MID_Z]}>
            <boxGeometry args={[0.16, 0.12, LENGTH]} />
            <meshBasicMaterial color="#6e91c6" transparent opacity={0.42} />
          </mesh>
        </group>
      ))}
      {frameZ.map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 8.25, 5.7, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.72, 11.4, 0.82]} />
              <meshStandardMaterial color="#303945" roughness={0.55} metalness={0.62} />
            </mesh>
          ))}
          <mesh position={[0, 11.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[17.1, 0.72, 0.82]} />
            <meshStandardMaterial color="#303945" roughness={0.55} metalness={0.62} />
          </mesh>
          <mesh position={[0, 10.98, 0]}>
            <boxGeometry args={[5.4, 0.045, 0.24]} />
            <meshBasicMaterial color="#9bb6df" transparent opacity={0.76} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh key={`rail-${side}`} position={[side * 6.9, 3.8, 0]}>
              <boxGeometry args={[0.055, 0.055, 0.82]} />
              <meshBasicMaterial color="#7598ca" transparent opacity={0.58} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, MID_Z]}>
        <planeGeometry args={[0.055, LENGTH]} />
        <meshBasicMaterial color="#a6badb" transparent opacity={0.48} />
      </mesh>
    </group>
  );
}
