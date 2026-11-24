"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { createBeanGeometry } from "./beanGeometry";
import { prepareScannedBean } from "./orientBean";

/* Grão escaneado (fotogrametria): "Coffee beans" por kouitimizuno, CC-BY-4.0
   https://sketchfab.com/3d-models/coffee-beans-8146e99925fb4b49839e4fa7ace83f0f */
export const BEAN_MODEL = { full: "/models/grao.glb", light: "/models/grao-1k.glb" };

export interface SceneDriver {
  /** 0 → 1 conforme o hero sai da tela */
  progress: number;
  /** ponteiro normalizado (-1 a 1) */
  px: number;
  py: number;
}

const SHARDS = 26;

function smooth(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

interface BeanLook {
  geometry: THREE.BufferGeometry;
  shardGeometry: THREE.BufferGeometry;
  material: THREE.Material;
  shardMaterial: THREE.Material;
}

/** grão desenhado em código: aparece enquanto o escaneado carrega */
function ProceduralBean(props: { driver: SceneDriver; still: boolean; compact: boolean }) {
  const look = useMemo<BeanLook>(
    () => ({
      geometry: createBeanGeometry(props.compact ? 64 : 112),
      shardGeometry: createBeanGeometry(24),
      material: new THREE.MeshPhysicalMaterial({
        color: "#4a2716",
        roughness: 0.46,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        sheen: 0.25,
        sheenColor: new THREE.Color("#c9703a"),
        sheenRoughness: 0.7,
      }),
      shardMaterial: new THREE.MeshPhysicalMaterial({ color: "#3e2012", roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.4 }),
    }),
    [props.compact],
  );
  return <Bean {...props} look={look} />;
}

/** grão real, escaneado por fotogrametria */
function ScannedBean(props: { driver: SceneDriver; still: boolean; compact: boolean }) {
  const gltf = useGLTF(props.compact ? BEAN_MODEL.light : BEAN_MODEL.full, false);
  const look = useMemo<BeanLook>(() => {
    const { geometry, material } = prepareScannedBean(gltf.scene, 2.16, true);
    const main = (material as THREE.MeshStandardMaterial).clone();
    main.roughness = 0.42;
    main.envMapIntensity = 1.15;
    main.side = THREE.FrontSide;
    const shard = main.clone();
    shard.envMapIntensity = 0.9;
    return { geometry, shardGeometry: geometry, material: main, shardMaterial: shard };
  }, [gltf]);
  return <Bean {...props} look={look} />;
}

function Bean({ driver, still, look }: { driver: SceneDriver; still: boolean; compact: boolean; look: BeanLook }) {
  const group = useRef<THREE.Group>(null);
  const bean = useRef<THREE.Mesh>(null);
  const shards = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // direção e giro de cada grão que "nasce" do grão principal
  const seeds = useMemo(() => {
    const rnd = mulberry32(7);
    return Array.from({ length: SHARDS }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / SHARDS);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * 1.35,
        Math.cos(phi) * 0.9,
        Math.sin(phi) * Math.sin(theta) * 0.8,
      );
      return {
        dir,
        dist: 2.2 + rnd() * 2.6,
        spin: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(2.2),
        size: 0.16 + rnd() * 0.14,
        delay: rnd() * 0.25,
      };
    });
  }, []);

  const tilt = useRef({ x: 0, y: 0 });
  const smoothed = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    const b = bean.current;
    const s = shards.current;
    if (!g || !b || !s) return;
    const dt = Math.min(delta, 0.05);

    // progresso de scroll suavizado
    smoothed.current = THREE.MathUtils.damp(smoothed.current, still ? 0 : driver.progress, 6, dt);
    const p = smoothed.current;

    // inclina em direção ao ponteiro
    const tx = still ? 0 : driver.py * 0.35;
    const ty = still ? 0 : driver.px * 0.55;
    tilt.current.x = THREE.MathUtils.damp(tilt.current.x, tx, 3.5, dt);
    tilt.current.y = THREE.MathUtils.damp(tilt.current.y, ty, 3.5, dt);

    if (!still) b.rotation.y += dt * (0.32 + p * 1.4);
    b.rotation.x = -0.35 + tilt.current.x + p * 1.1;
    b.rotation.z = 0.42 + tilt.current.y * 0.4;
    g.rotation.y = tilt.current.y;

    const t = state.clock.elapsedTime;
    const float = still ? 0 : Math.sin(t * 0.9) * 0.06;
    g.position.y = float + p * 0.6;
    const scale = 1 - smooth(0.1, 0.85, p) * 0.45;
    b.scale.setScalar(scale);

    // o grão se divide em vários ao rolar
    for (let i = 0; i < SHARDS; i++) {
      const sd = seeds[i];
      const local = smooth(sd.delay, 0.75 + sd.delay * 0.4, p);
      const out = local * sd.dist;
      dummy.position.copy(sd.dir).multiplyScalar(out);
      dummy.position.y += Math.sin(t * 0.6 + i) * 0.05 * local;
      dummy.rotation.set(
        sd.spin.x * (t * 0.4 + local * 3),
        sd.spin.y * (t * 0.4 + local * 3),
        sd.spin.z * local * 3,
      );
      dummy.scale.setScalar(sd.size * smooth(0.02, 0.25, local));
      dummy.updateMatrix();
      s.setMatrixAt(i, dummy.matrix);
    }
    s.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <mesh ref={bean} geometry={look.geometry} material={look.material} />
      <instancedMesh
        key={look.shardGeometry.uuid}
        ref={shards}
        args={[look.shardGeometry, look.shardMaterial, SHARDS]}
        frustumCulled={false}
      />
    </group>
  );
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function BeanScene({
  driver,
  still,
  active,
  compact,
  onFallback,
}: {
  driver: SceneDriver;
  still: boolean;
  active: boolean;
  compact: boolean;
  onFallback: () => void;
}) {
  const [lowDpr, setLowDpr] = useState(false);
  const dpr: number | [number, number] = lowDpr ? 1 : compact ? [1, 1.5] : [1, 1.75];
  const declines = useRef(0);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active && !still ? "always" : "demand"}
      camera={{ position: [0, 0, compact ? 6.4 : 5.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      {/* abaixo de ~28 fps reduz a resolução; só desiste do 3D se continuar abaixo de ~24 fps */}
      <PerformanceMonitor
        bounds={() => [28, 50]}
        flipflops={6}
        onDecline={({ fps }) => {
          setLowDpr(true);
          if (fps < 24) {
            declines.current += 1;
            if (declines.current >= 3) onFallback();
          }
        }}
        onIncline={() => {
          declines.current = 0;
        }}
      />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 3, 4]} intensity={2.4} color="#ffb27a" />
      <directionalLight position={[-4, -1, -3]} intensity={1.6} color="#f0a46b" />
      <pointLight position={[0, -2.5, 2]} intensity={6} color="#e0793a" distance={8} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[2, 3, 3]} scale={[5, 2, 1]} color="#ffe1c4" />
        <Lightformer form="rect" intensity={1.2} position={[-4, 0, -2]} scale={[3, 6, 1]} color="#e0793a" />
        <Lightformer form="circle" intensity={0.8} position={[0, -4, 2]} scale={3} color="#ffb27a" />
      </Environment>
      <Suspense fallback={<ProceduralBean driver={driver} still={still} compact={compact} />}>
        <ScannedBean driver={driver} still={still} compact={compact} />
      </Suspense>
    </Canvas>
  );
}
