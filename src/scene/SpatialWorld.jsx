import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SelectionMachine from './lab/Machine/SelectionMachine.jsx';

const ORANGE = '#e05a2b';
function Corridor() {
  const ribs = useMemo(() => Array.from({ length: 22 }, (_, i) => -i * 2.8), []);
  const particles = useMemo(() => {
    const points = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) { points[i * 3] = (Math.random() - .5) * 12; points[i * 3 + 1] = Math.random() * 7 - 1; points[i * 3 + 2] = -Math.random() * 62; }
    return points;
  }, []);
  return <group>
    <mesh position={[0,-2.7,-30]} receiveShadow><boxGeometry args={[12,.35,72]}/><meshStandardMaterial color="#17191d" metalness={.72} roughness={.38}/></mesh>
    <mesh position={[0,4.1,-30]}><boxGeometry args={[12,.25,72]}/><meshStandardMaterial color="#14161a" metalness={.55} roughness={.5}/></mesh>
    {[-5.5,5.5].map(x=><mesh key={x} position={[x,.6,-30]}><boxGeometry args={[.3,6.4,72]}/><meshStandardMaterial color="#202329" metalness={.62} roughness={.42}/></mesh>)}
    {ribs.map((z,i)=><group key={i} position={[0,0,z]}><mesh position={[-5.2,.55,0]}><boxGeometry args={[.18,6.2,.18]}/><meshStandardMaterial color="#3b4048" metalness={.8} roughness={.28}/></mesh><mesh position={[5.2,.55,0]}><boxGeometry args={[.18,6.2,.18]}/><meshStandardMaterial color="#3b4048" metalness={.8} roughness={.28}/></mesh><mesh position={[0,3.55,0]}><boxGeometry args={[10.5,.18,.18]}/><meshStandardMaterial color="#3b4048" metalness={.8} roughness={.28}/></mesh>{i%2===0&&<mesh position={[0,3.35,0]}><boxGeometry args={[2.2,.035,.12]}/><meshBasicMaterial color={ORANGE}/></mesh>}</group>)}
    {[-13,-29,-45].map((z,i)=><group key={z} position={[0,-.15,z]}><mesh position={[0,1,0]}><boxGeometry args={[4.8,5.9,.28]}/><meshStandardMaterial color="#252a31" metalness={.8} roughness={.25}/></mesh><mesh position={[0,1,.17]}><boxGeometry args={[4.25,5.35,.06]}/><meshBasicMaterial color="#101216"/></mesh><mesh position={[0,3.75,.23]}><boxGeometry args={[4.6,.07,.08]}/><meshBasicMaterial color={ORANGE}/></mesh><pointLight position={[0,2.2,1.6]} color={i===1?'#d7dce4':ORANGE} intensity={2.4} distance={9}/></group>)}
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles,3]}/></bufferGeometry><pointsMaterial color="#d6d9de" size={.025} transparent opacity={.45} sizeAttenuation/></points>
    <pointLight position={[0,2.5,-7]} color={ORANGE} intensity={8} distance={18}/><pointLight position={[0,2.5,-25]} color="#687b91" intensity={5} distance={20}/><pointLight position={[0,2.5,-43]} color={ORANGE} intensity={7} distance={20}/>
  </group>;
}
function CameraRig({progress, methodProgress}) {
  const {camera}=useThree(); const target=useRef(new THREE.Vector3());
  useFrame((_,delta)=>{const depth=progress.current*42;const lab = Math.max(0, Math.min(1, methodProgress.current)); const lift = Math.sin(lab * Math.PI) * 1.25;target.current.set(0,.15+Math.sin(progress.current*Math.PI*2)*.08+lift,5.4-depth);camera.position.lerp(target.current,1-Math.exp(-delta*3.2));camera.lookAt(0,.15+lift*.72,camera.position.z-8);});
  return null;
}
function LabStage({methodProgress}) { const step = Math.min(4, Math.floor(Math.max(0, Math.min(.999, methodProgress.current)) * 5)); return <group><mesh position={[0,-0.22,-12]}><boxGeometry args={[4,.22,1.65]}/><meshStandardMaterial color="#24282e" metalness={.75} roughness={.3}/></mesh><mesh position={[0,-1.32,-12]}><boxGeometry args={[4.15,2.2,1.8]}/><meshStandardMaterial color="#111317" metalness={.65} roughness={.42}/></mesh><SelectionMachine position={[0,-0.11,-12]} activeStep={step}/></group>; }
export default function SpatialWorld({progress,methodProgress}) {
 return <div className="world" aria-hidden="true"><Canvas fallback={<div className="world-fallback"/>} camera={{position:[0,.15,5.4],fov:58,near:.1,far:110}} dpr={[1,1.5]} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#101114',0);}}><ambientLight intensity={.7}/><hemisphereLight color="#c6d0dd" groundColor="#111216" intensity={.55}/><fog attach="fog" args={['#101114',10,64]}/><Corridor/><LabStage methodProgress={methodProgress}/><CameraRig progress={progress} methodProgress={methodProgress}/></Canvas></div>;
}
