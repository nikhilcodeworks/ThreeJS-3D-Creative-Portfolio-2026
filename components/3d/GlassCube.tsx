"use client";
import { useEffect, useRef, useMemo, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// GLASS CUBE — premium luminous glass with neon blue/cyan edges, procedural
// reflections, specular highlights, a hover-driven glow, and a natural
// drag/swipe-to-spin interaction with momentum + idle auto-rotation.
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

// Glass body: fresnel rim + procedural sky reflection + refraction-like tint +
// specular glints. uHover smoothly (0 -> 1) raises internal light & edge glow.
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
  vec3 tint = mix(vec3(0.9, 0.95, 1.0), uBlue, 0.14);
  vec3 color = mix(refr * tint, refl, fres * 0.8);

  // Specular highlight (Blinn-Phong) — crisp light glint on the faces.
  vec3 L = normalize(vec3(0.45, 0.72, 0.52));
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 48.0);
  color += vec3(1.0) * spec * (0.35 + uHover * 0.35);

  // Soft broad sheen for a sense of glass thickness.
  float sheen = pow(max(dot(N, H), 0.0), 6.0);
  color += mix(uCyan, uBlue, 0.5) * sheen * 0.06;

  // Internal blue light — intensifies on hover.
  float inner = 0.06 + uHover * 0.34;
  color += mix(uCyan, uElectric, 0.4) * inner * (0.4 + 0.6 * fres);

  // Electric blue / cyan edge brightening at the silhouette.
  color += mix(uCyan, uElectric, 0.5) * fres * (0.28 + uHover * 1.1);

  // Balanced transparency: mostly clear faces, denser toward the rim.
  float alpha = clamp(0.08 + fres * 0.5 + uHover * 0.08, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`;

const EDGE = 2.0; // cube edge length
const CUBE_FILL = 0.2; // fraction of the container the cube occupies

// Drag / spin tuning.
const DRAG_SENSITIVITY = 0.012; // radians of rotation per pixel dragged
const MAX_VELOCITY = 9; // clamp on release momentum (rad/s)
const IDLE_SPIN_Y = 0.45; // idle auto-rotation speed around the vertical axis
const IDLE_SPIN_X = 0.12; // idle auto-rotation speed around the horizontal axis
const MOMENTUM_RETURN = 1.1; // how quickly spin eases back toward idle (1/s)

// ─────────────────────────────────────────────────────────────────────────────
// NEON EDGES — three additive line layers (cyan core + sky + blue halo) scaled
// slightly outward to fake a soft, localized glow hugging the 12 real edges.
// No large ring, halo panel or diagonal cross-lines — just crisp glowing edges.
// ─────────────────────────────────────────────────────────────────────────────
function NeonEdges({
  geo,
  hoverRef,
}: {
  geo: THREE.BufferGeometry;
  hoverRef: { current: number };
}) {
  const coreRef = useRef<THREE.LineBasicMaterial>(null);
  const midRef = useRef<THREE.LineBasicMaterial>(null);
  const outerRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    const h = hoverRef.current;
    // Brighter on hover, fading smoothly as h eases back to 0.
    if (coreRef.current) coreRef.current.opacity = 0.9 + h * 0.1;
    if (midRef.current) midRef.current.opacity = 0.32 + h * 0.42;
    if (outerRef.current) outerRef.current.opacity = 0.14 + h * 0.34;
  });

  const layer = (
    matRef: React.Ref<THREE.LineBasicMaterial>,
    scale: number,
    color: string,
    opacity: number
  ) => (
    <group scale={scale}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial
          ref={matRef}
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );

  return (
    <group>
      {layer(coreRef, 1.0, "#22D3EE", 0.9)} {/* bright cyan core */}
      {layer(midRef, 1.03, "#38BDF8", 0.32)} {/* sky inner glow */}
      {layer(outerRef, 1.06, "#3B82F6", 0.14)} {/* electric blue halo */}
    </group>
  );
}

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
  const gl = useThree((s) => s.gl);
  const canvasEl = gl.domElement;

  const hover = useRef(0); // eased 0..1
  const hoverTarget = useRef(0); // 0 or 1

  // Drag / momentum state (all in refs — no per-frame React state).
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0, t: 0 });
  const deltaAcc = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

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

  // Global pointer listeners for the drag spinner. Added once, removed on
  // unmount. They read refs only, so no re-subscription churn.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault(); // avoid text selection while dragging
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current.x = e.clientX;
      last.current.y = e.clientY;
      deltaAcc.current.x += dx;
      deltaAcc.current.y += dy;

      // Estimate angular velocity (rad/s) from this move, smoothed.
      const now = performance.now();
      const dt = Math.max((now - last.current.t) / 1000, 1 / 240);
      last.current.t = now;
      const ivy = (dx * DRAG_SENSITIVITY) / dt; // horizontal drag -> Y axis
      const ivx = (dy * DRAG_SENSITIVITY) / dt; // vertical drag -> X axis
      vel.current.y = vel.current.y * 0.6 + ivy * 0.4;
      vel.current.x = vel.current.x * 0.6 + ivx * 0.4;
    };
    const endDrag = () => {
      if (!dragging.current) return;
      dragging.current = false;
      canvasEl.style.cursor = "grab";
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [canvasEl]);

  const startDrag = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const ev = e as unknown as PointerEvent;
    dragging.current = true;
    hoverTarget.current = 1; // keep the glow lit while interacting
    last.current.x = ev.clientX;
    last.current.y = ev.clientY;
    last.current.t = performance.now();
    deltaAcc.current.x = 0;
    deltaAcc.current.y = 0;
    canvasEl.style.cursor = "grabbing";
  };

  useFrame((state, delta) => {
    const dt = Math.min(Math.max(delta, 0), 0.05); // clamp after tab switches

    if (dragging.current) {
      // Apply accumulated pointer delta 1:1 — the cube tracks the pointer.
      spinRef.current!.rotation.y += deltaAcc.current.x * DRAG_SENSITIVITY;
      spinRef.current!.rotation.x += deltaAcc.current.y * DRAG_SENSITIVITY;
      deltaAcc.current.x = 0;
      deltaAcc.current.y = 0;
      // Decay stale velocity while holding still so release never jumps.
      const decay = Math.pow(0.1, dt);
      vel.current.y *= decay;
      vel.current.x *= decay;
    } else {
      // Momentum + smooth return to idle: ease velocity toward the idle spin.
      const idleY = reducedMotion ? 0 : IDLE_SPIN_Y;
      const idleX = reducedMotion ? 0 : IDLE_SPIN_X;
      const k = Math.min(1, MOMENTUM_RETURN * dt);
      vel.current.y += (idleY - vel.current.y) * k;
      vel.current.x += (idleX - vel.current.x) * k;
      vel.current.y = THREE.MathUtils.clamp(
        vel.current.y,
        -MAX_VELOCITY,
        MAX_VELOCITY
      );
      vel.current.x = THREE.MathUtils.clamp(
        vel.current.x,
        -MAX_VELOCITY,
        MAX_VELOCITY
      );
      spinRef.current!.rotation.y += vel.current.y * dt;
      spinRef.current!.rotation.x += vel.current.x * dt;
    }

    // Gentle floating bob — feels suspended in space (idle only).
    if (!reducedMotion) {
      spinRef.current!.position.y =
        Math.sin(state.clock.elapsedTime * 0.6) * 0.07;
    }

    // Subtle mouse-following parallax tilt (idle only; eases to 0 while drag).
    const targetTiltX =
      dragging.current || reducedMotion ? 0 : -mouseRef.current.y * 0.18;
    const targetTiltY =
      dragging.current || reducedMotion ? 0 : mouseRef.current.x * 0.22;
    tiltRef.current!.rotation.x +=
      (targetTiltX - tiltRef.current!.rotation.x) * Math.min(1, dt * 3);
    tiltRef.current!.rotation.y +=
      (targetTiltY - tiltRef.current!.rotation.y) * Math.min(1, dt * 3);

    // Ease hover for a smooth glow transition.
    hover.current += (hoverTarget.current - hover.current) * Math.min(1, dt * 6);

    if (bodyMatRef.current) {
      bodyMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      bodyMatRef.current.uniforms.uHover.value = hover.current;
    }
  });

  return (
    <group>
      {/* Mouse tilt (outer) */}
      <group ref={tiltRef}>
        {/* Rotation + float (inner) */}
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

          {/* Neon glowing edges — brighter on hover */}
          <NeonEdges geo={edgesGeo} hoverRef={hover} />

          {/* Interactive hit-box — hover glow + drag-to-spin */}
          <mesh
            scale={1.06}
            onPointerDown={startDrag}
            onPointerOver={() => {
              hoverTarget.current = 1;
              canvasEl.style.cursor = dragging.current ? "grabbing" : "grab";
            }}
            onPointerOut={() => {
              if (!dragging.current) {
                hoverTarget.current = 0;
                canvasEl.style.cursor = "default";
              }
            }}
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
    <div style={{ position: "absolute", inset: 0, touchAction: "none" }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", touchAction: "none" }}
      >
        <CameraFit half={EDGE / 2 / CUBE_FILL} />
        <GlassCubeScene mouseRef={mouseRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

