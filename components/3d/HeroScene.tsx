"use client";
import { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera,
  Trail,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// 1. ROTATING NATURAL EARTH (Bright, crisp, clean colors — no pink or dark shadows)
// ─────────────────────────────────────────────────────────────────────────────
function EarthGlobe() {
  const earthTexture = useTexture("/earth-opt.webp");
  earthTexture.colorSpace = THREE.SRGBColorSpace;

  const earthRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group rotation={[0.2, 0, 0.41]}>
      {/* ── Main Earth Sphere ── */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.75}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}

function FallbackEarth() {
  return (
    <mesh rotation={[0.2, 0, 0.41]}>
      <sphereGeometry args={[1.35, 32, 32]} />
      <meshStandardMaterial color="#2563eb" roughness={0.6} metalness={0.0} />
    </mesh>
  );
}

function Earth() {
  return (
    <Float speed={0.8} rotationIntensity={0.06} floatIntensity={0.25}>
      <Suspense fallback={<FallbackEarth />}>
        <EarthGlobe />
      </Suspense>
    </Float>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. COLORED ORBITAL RINGS — self-luminous glowing neon rings
// ─────────────────────────────────────────────────────────────────────────────
function OrbitalRing({
  radius,
  tube,
  rotX,
  rotZ,
  speed,
  color,
  emissiveIntensity = 2.5,
}: {
  radius: number;
  tube: number;
  rotX: number;
  rotZ: number;
  speed: number;
  color: string;
  emissiveIntensity?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    groupRef.current.rotation.y = t;
  });

  return (
    <group ref={groupRef} rotation={[rotX, 0, rotZ]}>
      <mesh>
        <torusGeometry args={[radius, tube, 3, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COLORED ORBITING SPHERES with glowing trails
// ─────────────────────────────────────────────────────────────────────────────
function OrbitingSphere({
  orbitRadius,
  speed,
  offset,
  size,
  color,
  tiltX = 0,
}: {
  orbitRadius: number;
  speed: number;
  offset: number;
  size: number;
  color: string;
  tiltX?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    const x = Math.cos(t) * orbitRadius;
    const y = Math.sin(t) * orbitRadius * Math.sin(tiltX);
    const z = Math.sin(t) * orbitRadius * Math.cos(tiltX);
    meshRef.current.position.set(x, y, z);
  });

  return (
    <Trail
      width={1.2}
      length={8}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          metalness={0.3}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
    </Trail>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NEURAL NETWORK — colored particles + connecting lines
// ─────────────────────────────────────────────────────────────────────────────
function NeuralParticles({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors, linePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#6366f1"), // purple
      new THREE.Color("#22d3ee"), // cyan
      new THREE.Color("#f43f5e"), // rose
      new THREE.Color("#a78bfa"), // violet
      new THREE.Color("#34d399"), // emerald
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.8;
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const lines: number[] = [];
    const threshold = 1.7;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          lines.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: pos,
      colors: col,
      linePositions: new Float32Array(lines),
    };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04;
      pointsRef.current.rotation.x = t * 0.015;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.04;
      linesRef.current.rotation.x = t * 0.015;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          transparent
          opacity={0.85}
          sizeAttenuation
          vertexColors
          toneMapped={false}
        />
      </points>

      {linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#8888ff" transparent opacity={0.15} />
        </lineSegments>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. COLORFUL FLOATING FRAGMENTS
// ─────────────────────────────────────────────────────────────────────────────
const FRAGMENT_COLORS = [
  "#6366f1", "#22d3ee", "#f43f5e", "#a78bfa",
  "#34d399", "#fb923c", "#facc15", "#e879f9",
  "#38bdf8", "#4ade80", "#f87171", "#818cf8",
];

function Fragment({
  startPos,
  speed,
  color,
}: {
  startPos: [number, number, number];
  speed: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.8;
    meshRef.current.rotation.y = t * 1.2;
    meshRef.current.position.y = startPos[1] + Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={startPos}>
      <dodecahedronGeometry args={[0.09, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        metalness={0.4}
        roughness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MOUSE CAMERA
// ─────────────────────────────────────────────────────────────────────────────
function SceneCamera({
  mouseX,
  mouseY,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouseX.current * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY.current * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroScene() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const onMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX.current = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseY.current = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const fragmentData: { pos: [number, number, number]; speed: number; color: string }[] = [
    { pos: [2.2, 0.8, 0.5],   speed: 0.40, color: FRAGMENT_COLORS[0] },
    { pos: [-2.0, -0.6, 1.0], speed: 0.48, color: FRAGMENT_COLORS[1] },
    { pos: [1.5, -1.5, -0.8], speed: 0.55, color: FRAGMENT_COLORS[2] },
    { pos: [-1.8, 1.2, -0.5], speed: 0.62, color: FRAGMENT_COLORS[3] },
    { pos: [0.8, 2.0, 1.0],   speed: 0.50, color: FRAGMENT_COLORS[4] },
    { pos: [-0.5, -2.2, 0.3], speed: 0.57, color: FRAGMENT_COLORS[5] },
    { pos: [2.5, -0.3, -1.0], speed: 0.44, color: FRAGMENT_COLORS[6] },
    { pos: [-2.3, 0.4, 0.8],  speed: 0.51, color: FRAGMENT_COLORS[7] },
    { pos: [1.0, 1.8, -1.5],  speed: 0.59, color: FRAGMENT_COLORS[8] },
    { pos: [-1.2, -1.8, 1.2], speed: 0.46, color: FRAGMENT_COLORS[9] },
    { pos: [0.3, 2.4, -0.8],  speed: 0.63, color: FRAGMENT_COLORS[10] },
    { pos: [2.1, 0.2, 1.3],   speed: 0.53, color: FRAGMENT_COLORS[11] },
  ];

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{
        antialias: true,
        alpha: true,
      }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 7.2 : 6.5]} fov={45} />
      <SceneCamera mouseX={mouseX} mouseY={mouseY} />

      {/* ── Studio Clean White Lighting for Natural Bright Earth ── */}
      {/* High ambient light to keep all sides bright without dark/muddy shadows */}
      <ambientLight intensity={1.7} color="#ffffff" />
      {/* Main sunlight */}
      <directionalLight position={[5, 6, 4]} intensity={1.6} color="#ffffff" />
      {/* Soft left fill light */}
      <directionalLight position={[-5, 2, 4]} intensity={1.1} color="#ffffff" />
      {/* Soft bottom fill light for southern hemisphere */}
      <directionalLight position={[0, -4, 3]} intensity={0.8} color="#f0f9ff" />

      {/* ── Natural Rotating Earth ── */}
      <Earth />

      {/* ── 3 Glowing colored orbital rings (self-luminous) ── */}
      <OrbitalRing
        radius={1.88}
        tube={0.022}
        rotX={Math.PI * 0.15}
        rotZ={Math.PI * 0.08}
        speed={0.14}
        color="#6366f1"
        emissiveIntensity={3}
      />
      <OrbitalRing
        radius={2.2}
        tube={0.018}
        rotX={Math.PI * 0.42}
        rotZ={Math.PI * 0.25}
        speed={-0.10}
        color="#22d3ee"
        emissiveIntensity={3}
      />
      <OrbitalRing
        radius={2.55}
        tube={0.014}
        rotX={Math.PI * 0.72}
        rotZ={Math.PI * 0.45}
        speed={0.07}
        color="#f43f5e"
        emissiveIntensity={3}
      />

      {/* ── Colored orbiting spheres with trails ── */}
      <OrbitingSphere orbitRadius={1.88} speed={0.8}  offset={0}   size={0.06} color="#6366f1" tiltX={0.15} />
      <OrbitingSphere orbitRadius={2.2}  speed={-0.6} offset={2.1} size={0.05} color="#22d3ee" tiltX={0.42} />
      <OrbitingSphere orbitRadius={2.55} speed={0.45} offset={4.2} size={0.04} color="#f43f5e" tiltX={0.72} />

      {/* ── Colorful neural network / star particles ── */}
      <NeuralParticles count={isMobile ? 60 : 130} />

      {/* ── Colorful floating gem fragments ── */}
      {!isMobile &&
        fragmentData.map((f, i) => (
          <Fragment key={i} startPos={f.pos} speed={f.speed} color={f.color} />
        ))}
    </Canvas>
  );
}
