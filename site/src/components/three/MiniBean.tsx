"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { createBeanGeometry } from "./beanGeometry";
import { prepareScannedBean } from "./orientBean";
import { BEAN_MODEL } from "./BeanScene";

function Spinning({ still, geometry, material }: { still: boolean; geometry: THREE.BufferGeometry; material: THREE.Material }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current || still) return;
    ref.current.rotation.y += Math.min(delta, 0.05) * 0.6;
    ref.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.7) * 0.15;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
  });
  return <mesh ref={ref} geometry={geometry} material={material} rotation={[-0.3, 0.6, 0.5]} />;
}

function ProceduralMini({ still }: { still: boolean }) {
  const geometry = useMemo(() => createBeanGeometry(48), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6a3820", roughness: 0.38 }), []);
  return <Spinning still={still} geometry={geometry} material={material} />;
}

function ScannedMini({ still }: { still: boolean }) {
  const gltf = useGLTF(BEAN_MODEL.light, false);
  const { geometry, material } = useMemo(() => {
    const r = prepareScannedBean(gltf.scene, 2.16, true);
    const m = (r.material as THREE.MeshStandardMaterial).clone();
    m.side = THREE.FrontSide;
    return { geometry: r.geometry, material: m };
  }, [gltf]);
  return <Spinning still={still} geometry={geometry} material={material} />;
}

/** Pequeno grão 3D decorativo, renderizado só enquanto está visível. */
export default function MiniBean({ active, still }: { active: boolean; still: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active && !still ? "always" : "demand"}
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 3]} intensity={3} color="#ffd2ad" />
      <directionalLight position={[-3, -1, -2]} intensity={1.4} color="#a3472b" />
      <Suspense fallback={<ProceduralMini still={still} />}>
        <ScannedMini still={still} />
      </Suspense>
    </Canvas>
  );
}
