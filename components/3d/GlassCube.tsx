"use client";
import { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// GLASS CUBE — premium transparent glass with crisp edges, procedural
// reflections, refraction-like highlights and a hover-driven blue/cyan glow.
// Fully procedural (no external HDR/env assets). Client-only (dynamic, ssr:false).
// ─────────────────────────────────────────────────────────────────────────────

// Shared vertex shader: world normal, view dir and local position.
const glassVertexShader = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vPos;
void main() {
  vPos = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

// Glass body: fresnel rim + procedural sky reflection + refraction-like tint.
// uHover smoothly (0 -> 1) raises internal blue light and edge brightness.
const glassBodyFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform vec3 uCyan;
uniform vec3 uBlue;
uniform vec3 uElectric;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vPos;

// Procedural studio "environment" sampled from a direction.
vec3 envColor(vec3 dir) {
  float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 horizon = mix(uCyan, uBlue, 0.5);
  vec3 col = mix(horizon, vec3(1.0), pow(h, 1.3));
  // Soft key-light window highlight.
  float spot = pow(max(dot(dir, normalize(vec3(0.45, 0.72, 0.52))), 0.0), 26.0);
  col += vec3(1.0) * spot * 0.7;
  return col;
}

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);

  vec3 R = reflect(-V, N);
  vec3 refl = envColor(R);
  vec3 refr = envColor(refract(-V, N, 0.72));

  // Base glass tint (very light, faintly blue).
  vec3 tint = mix(vec3(0.88, 0.94, 1.0), uBlue, 0.16);
  vec3 color = mix(refr * tint, refl, fres * 0.85);

  // Internal blue light — intensifies on hover.
  float inner = 0.05 + uHover * 0.30;
  color += mix(uCyan, uElectric, 0.4) * inner * (0.45 + 0.55 * fres);

  // Electric blue / cyan edge brightening at the silhouette.
  color += mix(uCyan, uElectric, 0.5) * fres * (0.22 + uHover * 0.95);

  float alpha = clamp(0.10 + fres * 0.55 + uHover * 0.10, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`;

const EDGE = 2.0; // cube edge length
const CUBE_FILL = 0.2; // fraction of the container the cube occupies (smaller = tinier cube)

// ─────────────────────────────────────────────────────────────────────────────
// CUBE — meshes + animation. All motion/eased uniforms handled in useFrame so
// hover state changes never trigger a React re-render.
// ─────────────────────────────────────────────────────────────────────────────
function GlassCubeScene({
  mouseRef,
  reducedMotion,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.ShaderMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);

  const hover = useRef(0); // eased 0..1
  const hoverTarget = useRef(0); // 0 or 1

  const boxGeo = useMemo(() => new THREE.BoxGeometry(EDGE, EDGE, EDGE), []);
  // EdgesGeometry keeps only the 12 real outer edges — no face diagonals.
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(boxGeo), [boxGeo]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uCyan: { value: new THREE.Color("#22D3EE") },
      uBlue: { value: new THREE.Color("#3B82F6") },
      uElectric: { value: new THREE.Color("#2563EB") },
    }),
    []
  );

  useEffect(
    () => () => {
      boxGeo.dispose();
      edgesGeo.dispose();
    },
    [boxGeo, edgesGeo]
  );

  // Reusable color objects to avoid per-frame allocations.
  const edgeBase = useMemo(() => new THREE.Color("#3B82F6"), []);
  const edgeHot = useMemo(() => new THREE.Color("#22D3EE"), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05); // clamp after tab switches

    if (spinRef.current && !reducedMotion) {
      // Continuous, smooth rotation around X and Y (no sudden direction change).
      spinRef.current.rotation.y += d * 0.32;
      spinRef.current.rotation.x += d * 0.16;
      // Gentle floating bob — feels suspended in space.
      spinRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.07;
    }

    if (tiltRef.current) {
      // Subtle mouse-following tilt on the outer group (stable, eased).
      const m = mouseRef.current;
      const tx = -m.y * 0.18;
      const ty = m.x * 0.22;
      tiltRef.current.rotation.x += (tx - tiltRef.current.rotation.x) * 0.05;
      tiltRef.current.rotation.y += (ty - tiltRef.current.rotation.y) * 0.05;
    }

    // Ease hover for a smooth glow transition.
    hover.current += (hoverTarget.current - hover.current) * Math.min(1, d * 6);
    const h = hover.current;

    if (bodyMatRef.current) {
      bodyMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      bodyMatRef.current.uniforms.uHover.value = h;
    }
    if (edgeMatRef.current) {
      edgeMatRef.current.color.copy(edgeBase).lerp(edgeHot, h);
      edgeMatRef.current.opacity = 0.4 + h * 0.6;
    }
  });

  return (
    <group>
      {/* Mouse tilt (outer) */}
      <group ref={tiltRef}>
        {/* Continuous spin + float (inner) */}
        <group ref={spinRef}>
          {/* Glass body */}
          <mesh geometry={boxGeo}>
            <shaderMaterial
              ref={bodyMatRef}
              vertexShader={glassVertexShader}
              fragmentShader={glassBodyFragmentShader}
              uniforms={uniforms}
              transparent
              depthWrite={false}
            />
          </mesh>

          {/* Crisp clean outer edges (no face diagonals) — glow brighter on hover */}
          <lineSegments geometry={edgesGeo}>
            <lineBasicMaterial
              ref={edgeMatRef}
              color="#3B82F6"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </lineSegments>

          {/* Invisible hit-box — hover works across the cube's whole visual area */}
          <mesh
            scale={1.04}
            onPointerOver={() => (hoverTarget.current = 1)}
            onPointerOut={() => (hoverTarget.current = 0)}
          >
            <boxGeometry args={[EDGE, EDGE, EDGE]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// CAMERA FIT — keeps the cube centered and consistently sized across breakpoints.
// ─────────────────────────────────────────────────────────────────────────────
function CameraFit({ half }: { half: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  useEffect(() => {
    const aspect = size.width / size.height;
    const fovY = (camera.fov * Math.PI) / 180;
    const distY = half / Math.tan(fovY / 2);
    const fovX = 2 * Math.atan(Math.tan(fovY / 2) * aspect);
    const distX = half / Math.tan(fovX / 2);
    const dist = Math.max(distX, distY) * 1.08;
    camera.position.set(0, 0, dist);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, half]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBGL SUPPORT CHECK — graceful, non-breaking CSS fallback.
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

export default function GlassCube() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglOk] = useState(detectWebGL);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(q.matches);
    apply();
    q.addEventListener("change", apply);
    return () => q.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Graceful CSS glass fallback when WebGL is unavailable.
  if (!webglOk) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: "62%",
            aspectRatio: "1 / 1",
            borderRadius: 10,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(59,130,246,0.20) 45%, rgba(34,211,238,0.30) 100%)",
            border: "1px solid rgba(59,130,246,0.55)",
            boxShadow:
              "0 0 40px rgba(34,211,238,0.25), inset 0 0 30px rgba(59,130,246,0.20)",
            transform: "rotate(-8deg) rotateX(8deg)",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", touchAction: "pan-y" }}
      >
        <CameraFit half={EDGE / 2 / CUBE_FILL} />
        <GlassCubeScene mouseRef={mouseRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

