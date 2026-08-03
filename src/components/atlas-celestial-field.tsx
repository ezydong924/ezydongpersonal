"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CameraControls,
  Cloud,
  Clouds,
  Environment,
  Html,
  Lightformer,
  useTexture,
  type CameraControls as CameraControlsImpl,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type CelestialPoint = {
  slug: string;
  name: string;
  en: string;
  x: number;
  y: number;
  open: boolean;
  frames?: number;
  orbitImages?: string[];
  poster?: string;
  zinePoster?: string;
};

type AtlasCelestialFieldProps = {
  points: CelestialPoint[];
  links: readonly (readonly [string, string])[];
  activeSlug: string;
  focusedSlug: string | null;
  mode: "constellation" | "index";
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
};

const depthMap = [
  -0.32, 0.28, 0.62, -0.08, 0.46, 0.18, -0.52,
  0.54, -0.12, 0.34, -0.38, 0.58, 0.08, -0.44,
];

const volumeVertex = `
varying vec3 vOrigin;
varying vec3 vDirection;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vOrigin = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vDirection = position - vOrigin;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const volumeFragment = `
precision highp float;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uDensity;
varying vec3 vOrigin;
varying vec3 vDirection;

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x),
        mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
        mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

float fbm3(vec3 p) {
  float value = 0.0;
  float amplitude = 0.56;
  for (int i = 0; i < 2; i++) {
    value += noise3(p) * amplitude;
    p = p * 2.03 + vec3(7.1, 3.7, 5.9);
    amplitude *= 0.48;
  }
  return value;
}

vec2 hitBox(vec3 origin, vec3 direction) {
  vec3 invDirection = 1.0 / direction;
  vec3 tMinTemp = (-0.5 - origin) * invDirection;
  vec3 tMaxTemp = (0.5 - origin) * invDirection;
  vec3 tMin = min(tMinTemp, tMaxTemp);
  vec3 tMax = max(tMinTemp, tMaxTemp);
  float t0 = max(tMin.x, max(tMin.y, tMin.z));
  float t1 = min(tMax.x, min(tMax.y, tMax.z));
  return vec2(t0, t1);
}

void main() {
  vec3 rayDirection = normalize(vDirection);
  vec2 bounds = hitBox(vOrigin, rayDirection);
  if (bounds.x > bounds.y) discard;
  bounds.x = max(bounds.x, 0.0);

  float travel = bounds.y - bounds.x;
  float stepSize = travel / 24.0;
  vec3 position = vOrigin + rayDirection * (bounds.x + stepSize * 0.5);
  vec4 accumulation = vec4(0.0);

  for (int i = 0; i < 24; i++) {
    vec3 p = position;
    float depth = float(i) / 23.0;
    p.xy += uPointer * (0.025 + depth * 0.055);
    p.xz = mat2(cos(uTime * 0.025), -sin(uTime * 0.025), sin(uTime * 0.025), cos(uTime * 0.025)) * p.xz;

    float radial = length(p * vec3(0.86, 1.42, 0.74));
    float envelope = smoothstep(0.72, 0.08, radial);
    float fold = sin(p.x * 7.0 + p.z * 5.2 + uTime * 0.13) * 0.08;
    float cloud = fbm3(p * 4.2 + vec3(uTime * 0.018, -uTime * 0.012, uTime * 0.009));
    float filament = smoothstep(0.48, 0.78, cloud + fold);
    float density = envelope * (cloud * 0.11 + filament * 0.24) * uDensity;
    density *= stepSize * 2.2;

    vec3 color = mix(uColorA, uColorB, smoothstep(0.18, 0.82, p.x + cloud * 0.34));
    color *= 0.52 + filament * 1.45;
    accumulation.rgb += (1.0 - accumulation.a) * color * density;
    accumulation.a += (1.0 - accumulation.a) * density;

    if (accumulation.a > 0.92) break;
    position += rayDirection * stepSize;
  }

  gl_FragColor = vec4(accumulation.rgb * 1.38, accumulation.a * 1.12);
}
`;

const particleVertex = `
uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uPointer;
attribute float aPhase;
varying float vAlpha;
varying float vPhase;

void main() {
  vec3 p = position;
  float radius = length(p.xy);
  float drift = uTime * (0.022 + 0.10 / (1.0 + radius));
  float c = cos(drift);
  float s = sin(drift);
  p.xy = mat2(c, -s, s, c) * p.xy;
  p.x += sin(p.y * 0.72 + p.z * 0.34 + uTime * 0.11 + aPhase * 8.0) * 0.10;
  p.y += cos(p.z * 0.66 - p.x * 0.28 - uTime * 0.09 + aPhase * 6.0) * 0.09;
  p.z += sin(radius * 1.7 - uTime * 0.18 + aPhase * 12.0) * 0.16;
  vec2 pointerDelta = p.xy - uPointer * vec2(3.6, 2.1) + vec2(0.001);
  float pointerInfluence = exp(-dot(pointerDelta, pointerDelta) * 0.17);
  vec2 radialDirection = normalize(pointerDelta);
  vec2 tangentDirection = vec2(-radialDirection.y, radialDirection.x);
  p.xy += radialDirection * pointerInfluence * 0.12;
  p.xy += tangentDirection * pointerInfluence * (0.2 + 0.08 * sin(uTime * 1.1 + aPhase * 9.0));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  float depth = max(1.0, -mvPosition.z);
  gl_PointSize = (0.9 + aPhase * 2.4) * uPixelRatio * (8.5 / depth) * (1.0 + pointerInfluence * 0.82);
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = 0.15 + aPhase * 0.72 + pointerInfluence * 0.34;
  vPhase = aPhase;
}
`;

const particleFragment = `
precision highp float;
varying float vAlpha;
varying float vPhase;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float core = smoothstep(0.46, 0.0, d);
  float glow = exp(-d * 7.0);
  vec3 blue = vec3(0.28, 0.52, 0.92);
  vec3 cyan = vec3(0.39, 0.96, 0.91);
  vec3 violet = vec3(0.48, 0.30, 0.92);
  vec3 color = mix(blue, cyan, smoothstep(0.14, 0.82, vPhase));
  color = mix(color, violet, smoothstep(0.82, 1.0, vPhase) * 0.48);
  color = mix(color, vec3(0.86, 1.0, 0.97), core * 0.58);
  gl_FragColor = vec4(color, (core * 0.72 + glow * 0.28) * vAlpha);
}
`;

const routeVertex = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const routeFragment = `
precision highp float;
uniform float uTime;
uniform float uPhase;
uniform float uActive;
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float lane = 0.42 + (1.0 - smoothstep(0.18, 0.5, abs(vUv.y - 0.5))) * 0.58;
  float travel = fract(vUv.x - uTime * (0.055 + uActive * 0.035) + uPhase);
  float packet = exp(-pow((travel - 0.5) / (0.065 + uActive * 0.025), 2.0));
  float secondary = exp(-pow((fract(travel + 0.38) - 0.5) / 0.11, 2.0)) * 0.24;
  float breathing = 0.68 + sin(uTime * 0.7 + uPhase * 19.0) * 0.12;
  float alpha = uOpacity * lane * (breathing + packet * (0.72 + uActive) + secondary);
  vec3 color = mix(uColor * 0.58, vec3(0.82, 1.0, 0.96), packet * (0.34 + uActive * 0.46));
  gl_FragColor = vec4(color, alpha);
}
`;

function toWorld(point: CelestialPoint, index: number) {
  return new THREE.Vector3(
    (point.x - 50) * 0.119 + 0.62,
    (50 - point.y) * 0.074 - 0.08,
    depthMap[index % depthMap.length],
  );
}

function seedFromSlug(slug: string) {
  let seed = 2166136261;
  for (let index = 0; index < slug.length; index += 1) {
    seed ^= slug.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function seededSample(seed: number, index: number) {
  let value = seed ^ Math.imul(index + 1, 0x9e3779b1);
  value = Math.imul(value ^ (value >>> 16), 2246822507);
  value = Math.imul(value ^ (value >>> 13), 3266489909);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

type MemoryPalette = {
  core: string;
  emissive: string;
  atmosphere: string;
  accent: string;
  dust: string;
};

const memoryPalettes: MemoryPalette[] = [
  {
    core: "#bcefe8",
    emissive: "#2db9ad",
    atmosphere: "#47ead8",
    accent: "#809cff",
    dust: "#c8fff6",
  },
  {
    core: "#d1e5ff",
    emissive: "#3e91c8",
    atmosphere: "#6ac5ef",
    accent: "#9b82ff",
    dust: "#dceeff",
  },
  {
    core: "#d8f3dc",
    emissive: "#45ae96",
    atmosphere: "#6ee0bc",
    accent: "#719ce8",
    dust: "#e1fff5",
  },
];

function CameraRig({
  points,
  focusedSlug,
  mode,
}: Pick<AtlasCelestialFieldProps, "points" | "focusedSlug" | "mode">) {
  const controls = useRef<CameraControlsImpl>(null);
  const focusedPosition = useMemo(() => {
    if (!focusedSlug) return null;
    const index = points.findIndex((point) => point.slug === focusedSlug);
    return index >= 0 ? toWorld(points[index], index) : null;
  }, [focusedSlug, points]);

  useEffect(() => {
    const cameraControls = controls.current;
    if (!cameraControls) return;
    let cancelled = false;

    if (focusedPosition) {
      const narrow = window.innerWidth / window.innerHeight < 0.9;
      void (async () => {
        await cameraControls.setLookAt(
          focusedPosition.x + (narrow ? 0.08 : 0.82),
          focusedPosition.y + (narrow ? 0.38 : 0.58),
          focusedPosition.z + (narrow ? 4.4 : 4.05),
          focusedPosition.x,
          focusedPosition.y,
          focusedPosition.z - 0.18,
          true,
        );
        if (cancelled) return;
        await cameraControls.setLookAt(
          focusedPosition.x + (narrow ? 0.02 : 0.46),
          focusedPosition.y + (narrow ? 0.08 : 0.22),
          focusedPosition.z + (narrow ? 2.05 : 1.55),
          focusedPosition.x,
          focusedPosition.y,
          focusedPosition.z,
          true,
        );
      })();
    } else {
      const narrow = window.innerWidth / window.innerHeight < 0.72;
      void cameraControls.setLookAt(
        0.62,
        -0.08,
        narrow ? 13.4 : 9.2,
        0.62,
        -0.08,
        -0.25,
        true,
      );
    }
    return () => {
      cancelled = true;
    };
  }, [focusedPosition]);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      enabled={mode === "constellation"}
      smoothTime={0.72}
      draggingSmoothTime={0.16}
      minDistance={focusedPosition ? 0.92 : 5.6}
      maxDistance={focusedPosition ? 5.8 : 15.5}
      minPolarAngle={focusedPosition ? Math.PI * 0.2 : Math.PI * 0.28}
      maxPolarAngle={focusedPosition ? Math.PI * 0.8 : Math.PI * 0.72}
      minAzimuthAngle={focusedPosition ? -Math.PI : -1.22}
      maxAzimuthAngle={focusedPosition ? Math.PI : 1.22}
      dollyToCursor
      infinityDolly={false}
      truckSpeed={0}
    />
  );
}

function NebulaVolume({
  position,
  scale,
  rotation,
  colorA,
  colorB,
  density,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  colorA: string;
  colorB: string;
  density: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uDensity: { value: density },
    }),
    [colorA, colorB, density],
  );

  useFrame(({ clock, pointer }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uPointer.value.lerp(pointer, 1 - Math.exp(-delta * 1.8));
    }
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.005;
      mesh.current.rotation.z += delta * 0.0015;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale} rotation={rotation}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={volumeVertex}
        fragmentShader={volumeFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function VolumetricNebula() {
  return (
    <group>
      <NebulaVolume
        position={[-2.2, 0.35, -1.9]}
        scale={[13.5, 7.4, 5.8]}
        rotation={[0.08, -0.18, -0.16]}
        colorA="#132d72"
        colorB="#0e8b92"
        density={1.42}
      />
      <NebulaVolume
        position={[3.8, -1.15, -0.7]}
        scale={[8.2, 5.5, 4.8]}
        rotation={[-0.18, 0.32, 0.2]}
        colorA="#301b74"
        colorB="#21a99f"
        density={1.05}
      />
    </group>
  );
}

function VolumetricCloudLayers() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.025) * 0.045;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.018) * 0.018;
  });

  return (
    <group ref={group} position={[0.2, -0.15, -1.25]}>
      <Clouds
        texture="/assets/atlas/cloud.png"
        limit={260}
        range={220}
        frustumCulled={false}
      >
        <Cloud
          seed={11}
          segments={84}
          bounds={[12, 2.4, 4.2]}
          volume={9}
          smallestVolume={0.22}
          color="#155c68"
          opacity={0.18}
          fade={28}
          growth={2.7}
          speed={0.055}
          position={[-1.8, -0.8, -1.8]}
          rotation={[0.12, -0.2, -0.12]}
        />
        <Cloud
          seed={29}
          segments={72}
          bounds={[8.5, 2.8, 3.6]}
          volume={7}
          smallestVolume={0.2}
          color="#332b72"
          opacity={0.15}
          fade={26}
          growth={2.1}
          speed={0.042}
          position={[3.4, 1.25, -2.2]}
          rotation={[-0.24, 0.16, 0.18]}
        />
        <Cloud
          seed={47}
          segments={54}
          bounds={[5.4, 1.9, 3.2]}
          volume={5}
          smallestVolume={0.16}
          color="#1b7470"
          opacity={0.12}
          fade={22}
          growth={1.8}
          speed={0.068}
          position={[-4.4, 2.25, -0.8]}
          rotation={[0.26, 0.08, -0.3]}
        />
      </Clouds>
    </group>
  );
}

function FlowParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const compact = useThree((state) => state.size.width < 700);
  const { positions, phases } = useMemo(() => {
    const count = compact ? 420 : 980;
    const positionData = new Float32Array(count * 3);
    const phaseData = new Float32Array(count);
    let seed = 731;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i += 1) {
      const arm = i % 5;
      const radius = Math.pow(random(), 0.64) * 7.9;
      const spin = radius * 1.46;
      const angle = (arm / 5) * Math.PI * 2 + spin + (random() - 0.5) * 0.9;
      const turbulence = (random() - 0.5) * (0.14 + radius * 0.055);
      positionData[i * 3] = Math.cos(angle) * radius * 1.08 + turbulence;
      positionData[i * 3 + 1] = Math.sin(angle) * radius * 0.58 + turbulence * 0.55;
      positionData[i * 3 + 2] = -1.1 + (random() - 0.5) * (0.55 + radius * 0.58);
      phaseData[i] = random();
    }
    return { positions: positionData, phases: phaseData };
  }, [compact]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 1.7) },
      uPointer: { value: new THREE.Vector2() },
    }),
    [],
  );

  useFrame(({ clock, pointer }, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime;
      material.current.uniforms.uPointer.value.lerp(pointer, 1 - Math.exp(-delta * 2.1));
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.006;
      pointsRef.current.rotation.x = -0.13 + Math.sin(clock.elapsedTime * 0.047) * 0.035;
      pointsRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.061) * 0.055;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FarStars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 420;
    const data = new Float32Array(count * 3);
    let seed = 97;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (random() - 0.5) * 17;
      data[i * 3 + 1] = (random() - 0.5) * 10;
      data[i * 3 + 2] = -2.8 + random() * 4.4;
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.0017;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#b8e7eb"
        size={0.008}
        transparent
        opacity={0.24}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function ForegroundStars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 150;
    const data = new Float32Array(count * 3);
    let seed = 389;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < count; index += 1) {
      data[index * 3] = (random() - 0.5) * 15;
      data[index * 3 + 1] = (random() - 0.5) * 9;
      data[index * 3 + 2] = 1.1 + random() * 4.2;
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = -clock.elapsedTime * 0.0011;
    ref.current.position.x = Math.sin(clock.elapsedTime * 0.025) * 0.08;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d9eee8"
        size={0.018}
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function MemoryDust({
  seed,
  palette,
}: {
  seed: number;
  palette: MemoryPalette;
}) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 460;
    const data = new Float32Array(count * 3);
    let state = seed || 1;
    const random = () => {
      state = Math.imul(state ^ (state >>> 15), 1 | state);
      state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
      return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
    };

    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 0.36 + Math.pow(random(), 0.68) * 0.55;
      const lane = index % 3;
      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] =
        Math.sin(angle) * radius * (0.46 + lane * 0.08) + (random() - 0.5) * 0.055;
      data[index * 3 + 2] =
        Math.sin(angle * (2.0 + lane * 0.35)) * 0.15 + (random() - 0.5) * 0.12;
    }
    return data;
  }, [seed]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.z = clock.elapsedTime * 0.026;
    points.current.rotation.y = Math.sin(clock.elapsedTime * 0.14) * 0.12;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={palette.dust}
        size={0.009}
        sizeAttenuation
        transparent
        opacity={0.38}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const memoryCoreVertex = `
uniform float uTime;
uniform float uSeed;
varying vec3 vLocal;
varying vec3 vNormal;
varying vec3 vView;
varying float vRidge;
varying float vBasin;

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x),
        mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
        mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 4; i++) {
    value += noise3(p) * amplitude;
    p = p * 2.07 + vec3(7.3, 2.1, 5.8);
    amplitude *= 0.49;
  }
  return value;
}

void main() {
  vec3 direction = normalize(position);
  float seedShift = uSeed * 0.31;
  float continental = fbm(direction * 2.65 + vec3(seedShift, 1.7, -2.1));
  float detail = fbm(direction * 8.7 + vec3(-3.2, seedShift, 4.6));
  float cellular = abs(sin(
    direction.x * 17.0 +
    direction.y * 13.0 -
    direction.z * 19.0 +
    detail * 4.2
  ));
  float basin = smoothstep(0.43, 0.68, continental);
  float ridge = pow(1.0 - abs(detail * 2.0 - 1.0), 3.2);
  float pulse = sin(uTime * 0.18 + continental * 8.0) * 0.0018;
  float elevation = (continental - 0.52) * 0.055 + ridge * basin * 0.018 + pulse;
  elevation -= smoothstep(0.0, 0.16, cellular) * (1.0 - basin) * 0.008;

  vec3 p = position + normal * elevation;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  vLocal = direction;
  vNormal = normalize(normalMatrix * normal);
  vView = -mvPosition.xyz;
  vRidge = ridge;
  vBasin = basin;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const memoryCoreFragment = `
precision highp float;
uniform float uTime;
uniform float uSeed;
uniform vec3 uCore;
uniform vec3 uAtmosphere;
uniform vec3 uAccent;
varying vec3 vLocal;
varying vec3 vNormal;
varying vec3 vView;
varying float vRidge;
varying float vBasin;

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vView);
  vec3 lightDirection = normalize(vec3(-0.62, 0.78, 0.54));
  float diffuse = max(dot(normal, lightDirection), 0.0);
  float halfLight = smoothstep(-0.18, 0.52, dot(normal, lightDirection));
  float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.2);

  float latitude = asin(clamp(vLocal.y, -1.0, 1.0));
  float longitude = atan(vLocal.z, vLocal.x);
  float contourValue = fract(
    vBasin * 7.0 +
    vRidge * 1.3 +
    sin(longitude * 3.0 + uSeed) * 0.08
  );
  float contour = 1.0 - smoothstep(0.035, 0.085, min(contourValue, 1.0 - contourValue));
  float meridian = 1.0 - smoothstep(
    0.012,
    0.042,
    abs(sin(longitude * 12.0 + sin(latitude * 3.0) * 0.6))
  );
  float latitudeGrid = 1.0 - smoothstep(0.01, 0.035, abs(sin(latitude * 18.0)));
  float archiveGrid = max(meridian, latitudeGrid) * (1.0 - vBasin) * 0.42;
  float signal = pow(hash31(floor((vLocal + 1.0) * 19.0 + uSeed)), 15.0);

  vec3 abyss = vec3(0.001, 0.004, 0.012);
  vec3 lowland = mix(vec3(0.004, 0.014, 0.027), uCore * 0.026, 0.24);
  vec3 highland = mix(vec3(0.007, 0.032, 0.045), uCore * 0.085, vRidge * 0.6);
  vec3 surface = mix(lowland, highland, vBasin);
  surface *= 0.08 + halfLight * 0.46 + diffuse * 0.12;
  surface = mix(
    surface,
    abyss,
    (1.0 - smoothstep(-0.16, 0.42, dot(normal, lightDirection))) * 0.86
  );
  surface += uAtmosphere * contour * vBasin * (0.022 + diffuse * 0.055);
  surface += uAccent * archiveGrid * (0.012 + halfLight * 0.026);
  surface += uAtmosphere * signal * (0.09 + 0.18 * sin(uTime * 1.1 + uSeed));
  surface += uAtmosphere * rim * 0.16;
  surface += vec3(0.52, 0.76, 0.88) * pow(diffuse, 22.0) * 0.035;
  gl_FragColor = vec4(surface, 1.0);
}
`;

const memoryShellFragment = `
precision highp float;
uniform float uTime;
uniform vec3 uAtmosphere;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vView);
  float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 4.2);
  float scan = 0.56 + 0.44 * sin(gl_FragCoord.y * 0.18 - uTime * 0.7);
  float alpha = rim * (0.13 + scan * 0.07);
  gl_FragColor = vec4(uAtmosphere * (0.5 + rim), alpha);
}
`;

function MemoryContactSheet({
  images,
  seed,
  slug,
}: {
  images: string[];
  seed: number;
  slug: string;
}) {
  const root = useRef<THREE.Group>(null);
  const cards = useRef<Array<THREE.Group | null>>([]);
  const startedAt = useRef<number | null>(null);
  const compact = useThree((state) => state.size.width < 700);
  const textures = useTexture(images.slice(0, 3)) as THREE.Texture[];
  const anchors = useMemo(
    () =>
      compact
        ? [
            new THREE.Vector3(-0.38, -0.24, -0.18),
            new THREE.Vector3(0, -0.02, 0.32),
            new THREE.Vector3(0.38, -0.24, -0.18),
          ]
        : [
            new THREE.Vector3(-0.62, -0.18, -0.22),
            new THREE.Vector3(0, 0.05, 0.38),
            new THREE.Vector3(0.62, -0.18, -0.22),
          ],
    [compact],
  );
  const lowerRail = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-0.55, -0.38, -0.16),
          ...anchors.map((point) =>
            point.clone().add(new THREE.Vector3(0, -0.13, -0.025)),
          ),
          new THREE.Vector3(0.55, -0.38, -0.16),
        ],
        false,
        "catmullrom",
        0.62,
      ),
    [anchors],
  );

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    });
  }, [textures]);

  useFrame(({ clock }) => {
    if (startedAt.current === null) startedAt.current = clock.elapsedTime;
    const age = clock.elapsedTime - startedAt.current;
    const reveal = THREE.MathUtils.smoothstep(age, 0.32, 1.55);
    const phase = (seed % 503) * 0.007;
    if (root.current) {
      root.current.rotation.x = 0.018 + Math.sin(clock.elapsedTime * 0.12 + phase) * 0.008;
      root.current.position.y = Math.sin(clock.elapsedTime * 0.18 + phase) * 0.008;
    }

    cards.current.forEach((card, index) => {
      if (!card) return;
      const anchor = anchors[index] ?? anchors[0];
      card.position.copy(anchor);
      card.rotation.set(
        index === 1 ? -0.012 : 0.025,
        index === 0 ? 0.5 : index === 2 ? -0.5 : 0,
        index === 0 ? -0.025 : index === 2 ? 0.025 : 0,
      );
      const stagger = THREE.MathUtils.smoothstep(reveal, index * 0.11, 0.72 + index * 0.08);
      card.scale.setScalar(0.01 + stagger * 0.99);
    });
  });

  return (
    <group ref={root} position={[-0.08, -0.015, 0]} rotation={[0.035, 0, 0]}>
      <mesh>
        <tubeGeometry args={[lowerRail, 80, 0.0024, 5, false]} />
        <meshStandardMaterial
          color="#4b5856"
          emissive="#55716d"
          emissiveIntensity={0.035}
          metalness={0.15}
          roughness={0.82}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh position={[0, -0.27, -0.34]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 0.82]} />
        <meshBasicMaterial
          color="#020609"
          transparent
          opacity={0.54}
          depthWrite={false}
        />
      </mesh>
      {textures.map((texture, index) => (
        <group
          key={images[index]}
          ref={(node) => {
            cards.current[index] = node;
          }}
        >
          <mesh position={[0, 0, -0.021]}>
            <boxGeometry args={[compact ? (index === 1 ? 0.38 : 0.25) : index === 1 ? 0.56 : 0.37, compact ? (index === 1 ? 0.255 : 0.17) : index === 1 ? 0.37 : 0.245, 0.018]} />
            <meshStandardMaterial color={index === 1 ? "#d8d1bf" : "#111615"} metalness={0.02} roughness={0.94} />
          </mesh>
          <mesh
            position={[0, 0, -0.009]}
            onClick={(event) => {
              event.stopPropagation();
              window.location.assign(`/gallery/photos/${slug}`);
            }}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = ""; }}
          >
            <planeGeometry args={[compact ? (index === 1 ? 0.35 : 0.23) : index === 1 ? 0.53 : 0.35, compact ? (index === 1 ? 0.225 : 0.15) : index === 1 ? 0.34 : 0.225]} />
            <meshBasicMaterial
              map={texture}
              opacity={0.96}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, compact ? (index === 1 ? -0.121 : -0.082) : index === 1 ? -0.179 : -0.119, -0.0065]}>
            <planeGeometry args={[compact ? (index === 1 ? 0.35 : 0.23) : index === 1 ? 0.53 : 0.35, 0.006]} />
            <meshBasicMaterial color={index === 1 ? "#c8b68c" : "#7d8d8b"} />
          </mesh>
          {index === 1 && (
            <Html
              transform
              position={[0, compact ? -0.145 : -0.205, 0.004]}
              distanceFactor={compact ? 5.6 : 6.8}
              zIndexRange={[20, 0]}
              style={{ pointerEvents: "auto" }}
            >
              <a
                href={`/gallery/photos/${slug}`}
                className="atlas-photo-portal"
                aria-label="进入这段记忆"
              >
                <span>OPEN THE CONTACT SHEET</span>
                <b>进入照片</b>
                <i>↗</i>
              </a>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

function ArchiveZineCover({ poster, slug }: { poster: string; slug: string }) {
  const texture = useTexture(poster) as THREE.Texture;

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group position={[0, 0.04, 0]} rotation={[0.008, -0.035, 0.003]}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          window.location.assign(`/gallery/photos/${slug}`);
        }}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
      >
        <planeGeometry args={[0.68, 1.1333]} />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function FocusedMemoryObject({ point }: { point: CelestialPoint }) {
  const root = useRef<THREE.Group>(null);
  const object = useRef<THREE.Group>(null);
  const enteredAt = useRef<number | null>(null);

  useFrame(({ camera, clock, size }, delta) => {
    if (enteredAt.current === null) enteredAt.current = clock.elapsedTime;
    if (root.current) {
      const compact = size.width / size.height < 0.9;
      const targetScale = compact ? 0.84 : 0.9;
      const nextScale = THREE.MathUtils.damp(
        root.current.scale.x,
        targetScale,
        4.5,
        delta,
      );
      root.current.scale.setScalar(nextScale);
      root.current.position.x = THREE.MathUtils.damp(
        root.current.position.x,
        compact ? 0 : -0.36,
        4.5,
        delta,
      );
    }
    if (
      object.current &&
      clock.elapsedTime - enteredAt.current < 2.25
    ) {
      object.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={root}>
      <group ref={object}>
        {point.zinePoster && <ArchiveZineCover poster={point.zinePoster} slug={point.slug} />}
      </group>
    </group>
  );
}

function GalaxyRoute({
  from,
  to,
  index,
  active,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  index: number;
  active: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const courier = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const midpoint = from.clone().lerp(to, 0.5);
    const direction = to.clone().sub(from);
    const side = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
    const bend = 0.13 + direction.length() * (0.072 + (index % 3) * 0.015);
    midpoint.addScaledVector(side, bend * (index % 2 === 0 ? 1 : -1));
    midpoint.z += ((index % 4) - 1.5) * 0.24 + direction.length() * 0.06;
    return new THREE.QuadraticBezierCurve3(from.clone(), midpoint, to.clone());
  }, [from, index, to]);
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 72, active ? 0.0085 : 0.0048, 5, false),
    [active, curve],
  );
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: seededSample(4919, index) },
      uActive: { value: active ? 1 : 0 },
      uOpacity: { value: active ? 0.88 : 0.25 },
      uColor: {
        value: new THREE.Color(active ? "#a8fff0" : index % 3 === 0 ? "#718be0" : "#4baea9"),
      },
    }),
    [active, index],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime;
    if (courier.current && active) {
      const progress = (clock.elapsedTime * 0.085 + seededSample(7127, index)) % 1;
      courier.current.position.copy(curve.getPointAt(progress));
    }
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={routeVertex}
          fragmentShader={routeFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {active && (
        <mesh ref={courier}>
          <octahedronGeometry args={[0.024, 1]} />
          <meshBasicMaterial
            color="#e1fff8"
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

function NodeOrbitGlyph({
  active,
  hovered,
  open,
  index,
}: {
  active: boolean;
  hovered: boolean;
  open: boolean;
  index: number;
}) {
  const group = useRef<THREE.Group>(null);
  const arcs = useMemo(() => {
    return [0, 1, 2].map((lane) => {
      const radius = 0.12 + lane * 0.027;
      const start = 0.34 + lane * 1.1;
      const length = Math.PI * (1.12 + lane * 0.18);
      const points = Array.from({ length: 42 }, (_, pointIndex) => {
        const angle = start + (pointIndex / 41) * length;
        return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      });
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);
  const arcLines = useMemo(
    () =>
      arcs.map((geometry) => {
        const line = new THREE.Line(geometry);
        (line.material as THREE.Material).dispose();
        return line;
      }),
    [arcs],
  );

  useEffect(() => () => arcs.forEach((geometry) => geometry.dispose()), [arcs]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const direction = index % 2 === 0 ? 1 : -1;
    group.current.rotation.z = clock.elapsedTime * (0.12 + (index % 3) * 0.018) * direction;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.21 + index) * 0.22;
  });

  const visibleOpacity = hovered ? 0.82 : active ? 0.6 : open ? 0.24 : 0.13;

  return (
    <group ref={group} scale={hovered ? 1.18 : active ? 1.05 : 0.92}>
      <primitive object={arcLines[0]} rotation={[0.72, 0.2, 0.12]}>
        <lineBasicMaterial
          attach="material"
          color="#9affeb"
          transparent
          opacity={visibleOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </primitive>
      <primitive object={arcLines[1]} rotation={[-0.42, 0.86, 0.74]}>
        <lineBasicMaterial
          attach="material"
          color="#718dff"
          transparent
          opacity={visibleOpacity * 0.72}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </primitive>
      <primitive object={arcLines[2]} rotation={[1.18, -0.36, -0.62]}>
        <lineBasicMaterial
          attach="material"
          color="#c6fff5"
          transparent
          opacity={visibleOpacity * 0.48}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </primitive>
      <mesh position={[0.135, 0, 0]}>
        <sphereGeometry args={[0.009, 10, 10]} />
        <meshBasicMaterial
          color="#e7fffa"
          transparent
          opacity={active || hovered ? 0.94 : 0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function CityNode({
  point,
  position,
  index,
  active,
  focused,
  dimmed,
  onSelect,
  onHover,
}: {
  point: CelestialPoint;
  position: THREE.Vector3;
  index: number;
  active: boolean;
  focused: boolean;
  dimmed: boolean;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
      onHover(null);
    },
    [onHover],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = focused ? 1 : hovered ? 1.48 : active ? 1.22 : dimmed ? 0.72 : 1;
    const next = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5.5, delta);
    group.current.scale.setScalar(next);
  });

  return (
    <group ref={group} position={position}>
      {!focused && (
        <>
          <mesh
            onClick={(event) => {
              event.stopPropagation();
              if (dimmed) return;
              onSelect(point.slug);
            }}
            onPointerOver={(event) => {
              if (dimmed) return;
              setHovered(true);
              onHover(point.slug);
              document.body.style.cursor = "pointer";
              if (event.nativeEvent.target instanceof HTMLElement) {
                event.nativeEvent.target.style.cursor = "pointer";
              }
            }}
            onPointerOut={(event) => {
              setHovered(false);
              onHover(null);
              document.body.style.cursor = "";
              if (event.nativeEvent.target instanceof HTMLElement) {
                event.nativeEvent.target.style.cursor = "grab";
              }
            }}
          >
            <sphereGeometry args={[point.open ? 0.14 : 0.105, 18, 18]} />
            <meshBasicMaterial
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[point.open ? 0.048 : 0.032, 24, 24]} />
            <meshPhysicalMaterial
              color={point.open ? "#d8e4db" : "#6f8585"}
              emissive={point.open ? "#477f7b" : "#18363d"}
              emissiveIntensity={hovered ? 0.92 : active ? 0.62 : 0.22}
              roughness={0.38}
              metalness={0.06}
              clearcoat={0.35}
              clearcoatRoughness={0.35}
              transparent
              opacity={dimmed ? 0.2 : 0.94}
            />
          </mesh>
          <mesh scale={hovered ? 1.42 : active ? 1.25 : 1.08}>
            <sphereGeometry args={[point.open ? 0.052 : 0.036, 20, 20]} />
            <meshBasicMaterial
              color={point.open ? "#b6e1d7" : "#54747a"}
              transparent
              opacity={dimmed ? 0.018 : hovered ? 0.12 : active ? 0.08 : 0.035}
              side={THREE.BackSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </>
      )}
      {!focused && (
        <Html
          position={[0.14, 0.1, 0]}
          distanceFactor={8}
          zIndexRange={[20, 5]}
          style={{
            pointerEvents: "auto",
            opacity: dimmed ? 0.14 : 1,
            transition: "opacity 400ms ease",
          }}
        >
          <button
            type="button"
            aria-label={`聚焦${point.name}`}
            className={`atlas-3d-label ${active ? "is-active" : ""}`}
            onMouseEnter={() => {
              setHovered(true);
              onHover(point.slug);
            }}
            onMouseLeave={() => {
              setHovered(false);
              onHover(null);
            }}
            onClick={(event) => {
              event.stopPropagation();
              event.currentTarget.blur();
              onSelect(point.slug);
            }}
          >
            <i>{String(index + 1).padStart(2, "0")}</i>
            <span>{point.name}</span>
            <small>
              {point.en}
              <b>{point.frames ? `${point.frames}F` : "DEV"}</b>
            </small>
          </button>
        </Html>
      )}
      {!focused && hovered && point.open && point.poster && (
        <Html
          position={[point.x > 65 ? -0.34 : 0.18, point.y <= 32 ? -0.2 : 0.25, 0.06]}
          distanceFactor={7.2}
          zIndexRange={[32, 12]}
          style={{ pointerEvents: "none" }}
        >
          <div className={`atlas-node-preview${point.y <= 32 ? " is-below" : ""}`}>
            <span
              className="atlas-node-preview-image"
              style={{ backgroundImage: `url(${point.poster})` }}
            />
          </div>
        </Html>
      )}
      {focused && <FocusedMemoryObject point={point} />}
    </group>
  );
}

function GalaxyScaffold() {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () =>
      [2.35, 3.55, 4.9].map((radius, ringIndex) => {
        const segmentCount = 180;
        const data = new Float32Array(segmentCount * 6);
        for (let index = 0; index < segmentCount; index += 1) {
          const a = (index / segmentCount) * Math.PI * 2;
          const b = ((index + 1) / segmentCount) * Math.PI * 2;
          const yScale = 0.53 + ringIndex * 0.035;
          const zScale = 0.08 + ringIndex * 0.024;
          data.set(
            [
              Math.cos(a) * radius,
              Math.sin(a) * radius * yScale,
              Math.sin(a * 3 + ringIndex) * radius * zScale,
              Math.cos(b) * radius,
              Math.sin(b) * radius * yScale,
              Math.sin(b * 3 + ringIndex) * radius * zScale,
            ],
            index * 6,
          );
        }
        return data;
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = -0.12 + Math.sin(clock.elapsedTime * 0.022) * 0.025;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.018) * 0.045;
  });

  return (
    <group ref={group} position={[0.62, -0.08, -0.82]} rotation={[0.18, 0, -0.12]}>
      {rings.map((positions, index) => (
        <lineSegments key={index}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={index === 1 ? "#667ee0" : "#66c5bd"}
            transparent
            opacity={index === 0 ? 0.075 : 0.045}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </lineSegments>
      ))}
    </group>
  );
}

function Constellation({
  points,
  links,
  activeSlug,
  focusedSlug,
  mode,
  onSelect,
  onHover,
}: AtlasCelestialFieldProps) {
  const compact = useThree((state) => state.size.width < 700);
  const positions = useMemo(
    () => new Map(points.map((point, index) => [point.slug, toWorld(point, index)])),
    [points],
  );
  const routes = useMemo(
    () =>
      links.flatMap(([from, to], index) => {
        const start = positions.get(from);
        const end = positions.get(to);
        return start && end ? [{ from, to, start, end, index }] : [];
      }),
    [links, positions],
  );

  if (mode !== "constellation") return null;

  return (
    <group
      scale={!focusedSlug && compact ? [0.46, 0.74, 0.68] : [1, 1, 1]}
      position={!focusedSlug && compact ? [0, -0.18, 0] : [0, 0, 0]}
    >
      {!focusedSlug && (
        <group>
          {routes.map((route) => (
            <GalaxyRoute
              key={`${route.from}-${route.to}`}
              from={route.start}
              to={route.end}
              index={route.index}
              active={route.from === activeSlug || route.to === activeSlug}
            />
          ))}
        </group>
      )}

      {points.map((point, index) => {
        const position = positions.get(point.slug);
        if (!position) return null;
        const active = point.slug === activeSlug;
        const focused = point.slug === focusedSlug;
        if (focusedSlug && !focused) return null;
        return (
          <CityNode
            key={point.slug}
            point={point}
            position={position}
            index={index}
            active={active}
            focused={focused}
            dimmed={Boolean(focusedSlug && !focused)}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </group>
  );
}

function Scene(props: AtlasCelestialFieldProps) {
  return (
    <>
      <fog attach="fog" args={["#03101c", 13, 25]} />
      <ambientLight color="#79a7b8" intensity={0.34} />
      <directionalLight
        color="#d8fff8"
        intensity={1.05}
        position={[3.5, 4.5, 5.5]}
      />
      <directionalLight
        color="#7188e8"
        intensity={0.56}
        position={[-4, -2.5, 2]}
      />
      <Environment
        files="/assets/atlas/moonless_golf_1k.hdr"
        environmentIntensity={0.92}
      >
        <group rotation={[0, -0.55, 0.16]}>
          <Lightformer
            form="rect"
            color="#d9fff8"
            intensity={2.2}
            scale={[4, 1.2, 1]}
            position={[0, 3, -4]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <Lightformer
            form="ring"
            color="#6786ff"
            intensity={1.4}
            scale={3.5}
            position={[-4, 0, 1]}
            rotation={[0, Math.PI / 2, 0]}
          />
        </group>
      </Environment>
      <CameraRig
        points={props.points}
        focusedSlug={props.focusedSlug}
        mode={props.mode}
      />
      {!props.focusedSlug && <FarStars />}
      {!props.focusedSlug && <ForegroundStars />}
      {!props.focusedSlug && <FlowParticles />}
      {props.mode === "constellation" && <Constellation {...props} />}
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={0.4}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.34}
          radius={0.72}
        />
        <Vignette eskil={false} offset={0.16} darkness={0.38} />
      </EffectComposer>
    </>
  );
}

export default function AtlasCelestialField(props: AtlasCelestialFieldProps) {
  return (
    <div className="atlas-canvas-shell absolute inset-0 z-[2]">
      <Canvas
        dpr={[1, 1.45]}
        camera={{ position: [0, 0, 9.2], fov: 44, near: 0.02, far: 30 }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#03101c"), 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
