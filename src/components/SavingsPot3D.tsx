'use client';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  OrbitControls,
  MeshDistortMaterial,
  Float,
} from '@react-three/drei';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';

/**
 * LOGIC:
 * - The pot visualizes user savings progress as a % fill.
 * - Animated coins drop in whenever `balance` increases.
 * - The liquid fill rises using react-spring interpolation.
 * - The pot glass uses refraction & glow for premium look.
 */

type Props = {
  targetPercent?: number; // 0–1 (e.g., 0.75)
  balance?: number;
  goal?: number;
  percent?: number;
};

function AnimatedLiquid({ level = 0.5 }: { level?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { y } = useSpring({ y: level, config: { mass: 1, tension: 180, friction: 26 } });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = y.get() * 0.8 - 0.45;
      meshRef.current.rotation.z = Math.sin(t * 0.4) * 0.03;
    }
  });

  return (
    <a.mesh ref={meshRef}>
      <cylinderGeometry args={[0.42, 0.42, 0.9, 80, 1, true]} />
      <MeshDistortMaterial
        color="#00ffc8"
        emissive="#00ffe0"
        emissiveIntensity={0.15}
        roughness={0.05}
        metalness={0.05}
        transparent
        opacity={0.75}
        distort={0.2}
        speed={2}
      />
    </a.mesh>
  );
}

function Coin({ delay = 0 }) {
  const ref = useRef<THREE.Mesh>(null);
  useEffect(() => {
    if (ref.current) ref.current.position.y = 1.6;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime - delay;
    if (t > 0 && ref.current) {
      const y = 1.6 - t * 1.2;
      if (y > -0.3) ref.current.position.y = y;
      else ref.current.position.y = -999; // hide
      ref.current.rotation.x += 0.08;
      ref.current.rotation.y += 0.1;
    }
  });

  return (
    <mesh ref={ref} position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.01, 40]} />
      <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} emissive="#ffdf70" />
    </mesh>
  );
}

function PotModel({ percent = 0.5 }: { percent?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.004;
  });

  return (
    <group ref={group}>
      {/* Glass container */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 120, 1, true]} />
        <meshPhysicalMaterial
          transmission={0.95}
          ior={1.45}
          thickness={0.5}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.2}
          transparent
          opacity={0.3}
          color="#dffff7"
        />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.43, 0.05, 32, 120]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.15} />
      </mesh>

      {/* Glowing Base */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 80]} />
        <meshStandardMaterial color="#0d0f14" emissive="#00ffc8" emissiveIntensity={0.2} />
      </mesh>

      {/* Animated Liquid */}
      <AnimatedLiquid level={percent} />

      {/* Drop coins */}
      {[0, 1.5, 2.8].map((d, i) => (
        <Coin key={i} delay={d} />
      ))}
    </group>
  );
}

export function SavingsPot3D({
  targetPercent,
  balance = 2847,
  goal = 5000,
  percent: percentProp,
}: Props) {
  const percent = useMemo(() => {
    if (percentProp !== undefined) return Math.min(Math.max(percentProp, 0), 1);
    return Math.min(balance / goal, 1);
  }, [balance, goal, percentProp]);
  
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setDisplay(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="relative w-full h-[480px] rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
      <Canvas shadows camera={{ position: [2.4, 1.7, 2.8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} castShadow />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
        <Float speed={1.5} rotationIntensity={0.2}>
          <PotModel percent={percent} />
        </Float>
        <ContactShadows
          position={[0, -0.7, 0]}
          opacity={0.35}
          scale={6}
          blur={3}
          far={1.2}
        />
      </Canvas>

      {/* Overlay HUD */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3 bg-gradient-to-t from-black/50 to-transparent">
        <div className="text-sm text-white/70">Savings Pot</div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{Math.round(display * 100)}%</div>
          <div className="text-xs text-white/60">filled (£{balance.toLocaleString()})</div>
        </div>
      </div>
    </div>
  );
}
