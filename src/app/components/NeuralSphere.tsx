
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Sparkles,
  MeshDistortMaterial,
} from "@react-three/drei";
import { Group } from "three";

function AnimatedSphere() {
  const sphereRef = useRef<Group>(null!);
  const orbitRef = useRef<Group>(null!);

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.25;
      sphereRef.current.rotation.x += delta * 0.1;
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.35;
      orbitRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group>
      {/* Main floating sphere */}
      <Float
        speed={2}
        rotationIntensity={0.3}
        floatIntensity={0.5}
      >
        <group ref={sphereRef}>

          <mesh>
            <icosahedronGeometry args={[1.15, 32]} />
            <MeshDistortMaterial
              color="#7547ff"
              emissive="#301080"
              emissiveIntensity={1.2}
              roughness={0.15}
              metalness={0.6}
              distort={0.25}
              speed={2}
            />
          </mesh>

          {/* Outer wireframe */}
          <mesh>
            <icosahedronGeometry args={[1.35, 2]} />
            <meshBasicMaterial
              color="#9b8cff"
              wireframe
              transparent
              opacity={0.25}
            />
          </mesh>

        </group>
      </Float>

      {/* Rotating orbital rings */}
      <group ref={orbitRef}>
        <mesh rotation={[1.1, 0.3, 0.4]}>
          <torusGeometry args={[1.7, 0.012, 16, 120]} />
          <meshBasicMaterial
            color="#58c7ff"
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh rotation={[0.4, 1.2, 0.8]}>
          <torusGeometry args={[1.85, 0.009, 16, 120]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>

      {/* Floating particles */}
      <Sparkles
        count={100}
        scale={5}
        size={3}
        speed={0.5}
        color="#b9a5ff"
        opacity={0.8}
      />

      <Sparkles
        count={40}
        scale={3}
        size={5}
        speed={0.3}
        color="#55cfff"
      />

      {/* Lighting */}
      <ambientLight intensity={1.5} />
      <pointLight
        position={[3, 3, 3]}
        intensity={3}
        color="#a78bfa"
      />
      <pointLight
        position={[-3, -2, 2]}
        intensity={2}
        color="#38bdf8"
      />
    </group>
  );
}

export default function NeuralSphere() {
  return (
    <div className="h-[440px] w-full md:h-[520px]">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}
