"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED GLSL — Ashima simplex noise + fBm (procedural, no external assets)
// ─────────────────────────────────────────────────────────────────────────────
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
float fbm(vec3 p){
  float value = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return value;
}
`;

// Shared vertex shader: passes normal, view dir and local position.
const orbVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewPosition = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

// Core fragment: glassy energy with cyan/blue/violet ramp + Fresnel rim.
const orbCoreFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColorCyan;
uniform vec3 uColorBlue;
uniform vec3 uColorViolet;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vPosition;
${NOISE_GLSL}
void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Luminous Fresnel rim.
  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.5);

  // Animated energy field — domain-warped fBm; mouse nudges the field.
  float t = uTime * 0.22;
  vec3 p = normalize(vPosition) * 2.3;
  p.xy += uMouse * 0.4;
  float warp = fbm(p + vec3(0.0, t, 0.0));
  float energy = fbm(p * 1.7 + warp * 0.8 + vec3(t * 0.6, -t * 0.4, t * 0.3));
  energy = clamp(energy * 0.5 + 0.5, 0.0, 1.0);
  energy = smoothstep(0.28, 0.85, energy);

  // Cyan -> electric blue -> violet energy ramp.
  vec3 color = mix(uColorCyan, uColorBlue, smoothstep(0.0, 0.55, energy));
  color = mix(color, uColorViolet, smoothstep(0.5, 1.0, energy));

  // Soft baked lighting for depth (unlit shader keeps it self-contained).
  vec3 lightDir = normalize(vec3(0.5, 0.8, 0.6));
  float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
  color *= 0.7 + 0.55 * diffuse;

  // Glassy bright centre facing the viewer.
  float facing = pow(clamp(dot(normal, viewDir), 0.0, 1.0), 1.6);
  color = mix(color, vec3(0.92, 0.98, 1.0), facing * 0.22);

  // Luminous glow at the silhouette.
  color += fresnel * mix(uColorCyan, uColorViolet, 0.5 + 0.5 * sin(uTime * 0.5)) * 1.7;

  // Glassy transparent centre, glowing opaque rim.
  float alpha = clamp(0.30 + energy * 0.35 + fresnel * 0.85, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// ENERGY ORB — single glassy, procedural energy core (no outer halo).
// Mouse position subtly drives both the rotation and the energy field.
// ─────────────────────────────────────────────────────────────────────────────
function EnergyOrb({
  mouseRef,
  reducedMotion,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMatRef = useRef<THREE.ShaderMaterial>(null);

  // Smoothed mouse so the orb reacts gently rather than snapping.
  const smooth = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorCyan: { value: new THREE.Color("#22d3ee") },
      uColorBlue: { value: new THREE.Color("#2563eb") },
      uColorViolet: { value: new THREE.Color("#8b5cf6") },
    }),
    []
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05); // clamp for stability after tab switches
    const target = mouseRef.current;

    // Ease the mouse influence.
    smooth.current.x += (target.x - smooth.current.x) * 0.05;
    smooth.current.y += (target.y - smooth.current.y) * 0.05;

    if (groupRef.current) {
      const spin = reducedMotion ? 0 : d;
      groupRef.current.rotation.y += spin * 0.25 + smooth.current.x * 0.004;
      groupRef.current.rotation.x += smooth.current.y * 0.003;
      // Gentle floating bob.
      groupRef.current.position.y =
        reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    }

    if (coreMatRef.current) {
      coreMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      coreMatRef.current.uniforms.uMouse.value.set(
        smooth.current.x,
        smooth.current.y
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glassy energy core */}
      <mesh>
        <sphereGeometry args={[1.35, 96, 96]} />
        <shaderMaterial
          ref={coreMatRef}
          vertexShader={orbVertexShader}
          fragmentShader={orbCoreFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOUSE PARALLAX CAMERA — subtle depth as the pointer moves.
// ─────────────────────────────────────────────────────────────────────────────
function SceneCamera({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  // Read the camera from the frame callback argument (a function parameter,
  // not a hook return value) so mutating it stays within React's purity rules.
  useFrame(({ camera }) => {
    const { x, y } = mouseRef.current;
    camera.position.x += (x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBGL SUPPORT CHECK — enables a graceful, non-breaking fallback.
// ─────────────────────────────────────────────────────────────────────────────
function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — hero scene. Client-only (dynamically imported with ssr:false).
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroScene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Detect WebGL once at mount (client-only component) rather than in an
  // effect, avoiding a cascading render.
  const [webglOk] = useState(detectWebGL);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => setReducedMotion(motionQuery.matches);
    applyMotion();
    motionQuery.addEventListener("change", applyMotion);

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x =
          (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseRef.current.y =
          (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      motionQuery.removeEventListener("change", applyMotion);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  // Graceful, purely-CSS fallback when WebGL can't run.
  if (!webglOk) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: "min(70vw, 380px)",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 34%, rgba(255,255,255,0.95) 0%, rgba(34,211,238,0.55) 26%, rgba(37,99,235,0.6) 58%, rgba(139,92,246,0.55) 100%)",
          boxShadow:
            "0 0 80px rgba(34,211,238,0.35), 0 0 160px rgba(139,92,246,0.28)",
          filter: "blur(0.2px)",
        }}
      />
    );
  }

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 0, isMobile ? 6.2 : 5.4]}
        fov={45}
      />
      <SceneCamera mouseRef={mouseRef} />
      <EnergyOrb mouseRef={mouseRef} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
