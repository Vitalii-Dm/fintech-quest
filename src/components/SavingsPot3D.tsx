'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment, OrbitControls, ContactShadows,
  MeshDistortMaterial, Float
} from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';

/**
 * Logic:
 *  • Displays real saving progress: balance / goal = %.
 *  • Liquid level rises smoothly (react-spring interpolation).
 *  • Coins fall in when balance increases.
 *  • Auto-rotate camera + glow base + realistic refraction.
 */

export function SavingsPot3D({
  balance = 2850,
  goal = 5000,
}: { balance?: number; goal?: number }) {
  const percent = Math.min(balance / goal, 1);
  const [coins, setCoins] = useState<number[]>([]);

  // Animate level
  const { y } = useSpring({ y: percent, config: { tension: 180, friction: 22 } });

  // Drop new coin each time balance changes
  useEffect(() => setCoins((c) => [...c, Date.now()]), [balance]);

  return (
    <div className="relative h-[480px] w-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
      <Canvas shadows camera={{ position: [2.3, 1.6, 2.8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} castShadow />
        <Environment preset="city" />
        <Float speed={1.2} rotationIntensity={0.3}>
          <PotBody fill={y} />
        </Float>
        {coins.map((id, i) => (
          <FallingCoin key={id} delay={i * 0.5} />
        ))}
        <ContactShadows position={[0, -0.7, 0]} opacity={0.35} scale={6} blur={3} far={1.2} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>

      {/* Overlay HUD */}
      <div className="absolute bottom-0 inset-x-0 flex justify-between px-5 py-3 bg-gradient-to-t from-black/40 to-transparent">
        <div className="text-sm text-white/70">Savings Pot</div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{Math.round(percent * 100)}%</div>
          <div className="text-xs text-white/60">£{balance.toLocaleString()} / £{goal.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function PotBody({ fill }: { fill: any }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.0035;
  });

  return (
    <group ref={group}>
      {/* Glass jar */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 120]} />
        <meshPhysicalMaterial
          transmission={0.97}
          roughness={0.05}
          clearcoat={1}
          thickness={0.6}
          transparent
          opacity={0.3}
          color="#e8fff9"
        />
      </mesh>

      {/* Gold lid */}
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.43, 0.05, 40, 150]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
      </mesh>

      {/* Base with neon glow */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.05, 80]} />
        <meshStandardMaterial color="#0f172a" emissive="#00ffc8" emissiveIntensity={0.3} />
      </mesh>

      {/* Liquid */}
      <AnimatedLiquid level={fill} />
    </group>
  );
}

function AnimatedLiquid({ level }: { level: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = level.get() * 0.9 - 0.45;
      meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.04;
    }
  });
  return (
    <a.mesh ref={meshRef}>
      <cylinderGeometry args={[0.42, 0.42, 0.9, 80]} />
      <MeshDistortMaterial
        color="#00ffd5"
        emissive="#00ffe0"
        emissiveIntensity={0.15}
        transparent
        opacity={0.75}
        metalness={0.1}
        roughness={0.1}
        distort={0.15}
        speed={2}
      />
    </a.mesh>
  );
}

function FallingCoin({ delay = 0 }: { delay?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime - delay;
    if (t > 0 && ref.current) {
      const y = 1.6 - t * 1.3;
      ref.current.position.y = y > -0.3 ? y : -999;
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
