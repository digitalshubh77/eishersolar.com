"use client";

import { Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function SolarCore() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.13;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.18,
      0.04,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -state.pointer.x * 0.14,
      0.04,
    );
  });

  return (
    <group ref={group}>
      <Float speed={1.7} rotationIntensity={0.35} floatIntensity={0.65}>
        <mesh>
          <icosahedronGeometry args={[1.18, 3]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.8}
            chromaticAberration={0.08}
            anisotropy={0.2}
            distortion={0.15}
            distortionScale={0.2}
            temporalDistortion={0.08}
            color="#7bea5e"
            roughness={0.12}
          />
        </mesh>
        <mesh scale={0.78}>
          <icosahedronGeometry args={[1.18, 2]} />
          <meshStandardMaterial
            color="#edff64"
            emissive="#54d938"
            emissiveIntensity={1.8}
            wireframe
            transparent
            opacity={0.46}
          />
        </mesh>
      </Float>

      <mesh rotation={[1.12, 0.2, 0.3]}>
        <torusGeometry args={[1.72, 0.012, 12, 160]} />
        <meshBasicMaterial color="#d7ff8c" transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[0.25, 1.2, -0.3]}>
        <torusGeometry args={[2.05, 0.008, 12, 160]} />
        <meshBasicMaterial color="#2e8dff" transparent opacity={0.35} />
      </mesh>
      <Sparkles
        count={36}
        scale={5}
        size={1.7}
        speed={0.25}
        color="#dfff8d"
        opacity={0.62}
      />
    </group>
  );
}

export default function SolarOrbit() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.1} />
      <pointLight position={[3, 3, 4]} intensity={7} color="#a8ff74" />
      <pointLight position={[-3, -2, 2]} intensity={5} color="#157fff" />
      <SolarCore />
    </Canvas>
  );
}
