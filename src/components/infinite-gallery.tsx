"use client";

import React, { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings { fadeIn: { start: number; end: number }; fadeOut: { start: number; end: number }; }
interface BlurSettings { blurIn: { start: number; end: number }; blurOut: { start: number; end: number }; maxBlur: number; }
interface InfiniteGalleryProps {
  images: ImageItem[]; speed?: number; visibleCount?: number;
  fadeSettings?: FadeSettings; blurSettings?: BlurSettings;
  className?: string; style?: React.CSSProperties;
  onImageClick?: (index: number) => void;
}

const DEPTH_RANGE = 50;
const MAX_H_OFFSET = 8;
const MAX_V_OFFSET = 8;

interface PlaneData { index: number; z: number; imageIndex: number; x: number; y: number; }

function createClothMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { map: { value: null }, opacity: { value: 1.0 }, blurAmount: { value: 0.0 }, scrollForce: { value: 0.0 }, time: { value: 0.0 }, isHovered: { value: 0.0 } },
    vertexShader: `
      uniform float scrollForce; uniform float time; uniform float isHovered; varying vec2 vUv;
      void main() { vUv = uv; vec3 pos = position; float ci = scrollForce * 0.3; float d = length(pos.xy); float curve = d * d * ci; float r1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02; float r2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015; float cloth = (r1 + r2) * abs(ci) * 2.0; float fw = 0.0; if (isHovered > 0.5) { float wp = pos.x * 3.0 + time * 8.0; float damp = smoothstep(-0.5, 0.5, pos.x); fw = sin(wp) * 0.1 * damp + sin(pos.x * 5.0 + time * 12.0) * 0.03 * damp; } pos.z -= (curve + cloth + fw); gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); }
    `,
    fragmentShader: `
      uniform sampler2D map; uniform float opacity; uniform float blurAmount; varying vec2 vUv;
      void main() { vec4 color = texture2D(map, vUv); if (blurAmount > 0.0) { vec2 ts = 1.0 / vec2(textureSize(map, 0)); vec4 blurred = vec4(0.0); float total = 0.0; for (float x = -2.0; x <= 2.0; x += 1.0) { for (float y = -2.0; y <= 2.0; y += 1.0) { vec2 off = vec2(x, y) * ts * blurAmount; float w = 1.0 / (1.0 + length(vec2(x, y))); blurred += texture2D(map, vUv + off) * w; total += w; } } color = blurred / total; } gl_FragColor = vec4(color.rgb, color.a * opacity); }
    `,
  });
}

function ImagePlane({ texture, position, scale, material, onClick }: { texture: THREE.Texture; position: [number, number, number]; scale: [number, number, number]; material: THREE.ShaderMaterial; onClick?: () => void; }) {
  const [hovered, setHovered] = useState(false);
  // Three.js materials are mutable imperative objects (not React state) —
  // updating their uniforms in place is the standard react-three-fiber
  // pattern, not an accidental prop mutation.
  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => { if (material?.uniforms) { material.uniforms.map.value = texture; material.uniforms.isHovered.value = hovered ? 1.0 : 0.0; } }, [material, texture, hovered]);
  return (<mesh position={position} scale={scale} material={material} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onClick={onClick}><planeGeometry args={[1, 1, 32, 32]} /></mesh>);
}

function GalleryScene({ images, speed = 1, visibleCount = 8, fadeSettings = { fadeIn: { start: 0.05, end: 0.15 }, fadeOut: { start: 0.85, end: 0.95 } }, blurSettings = { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.9, end: 1.0 }, maxBlur: 3.0 }, onImageClick }: Omit<InfiniteGalleryProps, "className" | "style">) {
  const [scrollVel, setScrollVel] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const lastInt = useRef(0);
  useEffect(() => { lastInt.current = Date.now(); }, []);
  const touchY = useRef<number | null>(null);

  const normalized = useMemo(() => images.map((img) => (typeof img === "string" ? { src: img, alt: "" } : img)), [images]);
  const textures = useTexture(normalized.map((img) => img.src));
  const materials = useMemo(() => Array.from({ length: visibleCount }, () => createClothMaterial()), [visibleCount]);

  const spatial = useMemo(() => { const p: { x: number; y: number }[] = []; for (let i = 0; i < visibleCount; i++) { const ha = (i * 2.618) % (Math.PI * 2); const va = (i * 1.618 + Math.PI / 3) % (Math.PI * 2); p.push({ x: (Math.sin(ha) * ((i % 3) * 1.2) * MAX_H_OFFSET) / 3, y: (Math.cos(va) * (((i + 1) % 4) * 0.8) * MAX_V_OFFSET) / 4 }); } return p; }, [visibleCount]);

  const total = normalized.length;
  const planes = useRef<PlaneData[]>(Array.from({ length: visibleCount }, (_, i) => ({ index: i, z: visibleCount > 0 ? ((DEPTH_RANGE / visibleCount) * i) % DEPTH_RANGE : 0, imageIndex: total > 0 ? i % total : 0, x: spatial[i]?.x ?? 0, y: spatial[i]?.y ?? 0 })));
  useEffect(() => { planes.current = Array.from({ length: visibleCount }, (_, i) => ({ index: i, z: visibleCount > 0 ? ((DEPTH_RANGE / Math.max(visibleCount, 1)) * i) % DEPTH_RANGE : 0, imageIndex: total > 0 ? i % total : 0, x: spatial[i]?.x ?? 0, y: spatial[i]?.y ?? 0 })); }, [spatial, total, visibleCount]);

  const handleWheel = useCallback((e: WheelEvent) => { e.preventDefault(); setScrollVel((p) => p + e.deltaY * 0.01 * speed); setAutoPlay(false); lastInt.current = Date.now(); }, [speed]);
  const handleTouchStart = useCallback((e: TouchEvent) => { if (e.touches.length === 1) { touchY.current = e.touches[0].clientY; setAutoPlay(false); lastInt.current = Date.now(); } }, []);
  const handleTouchMove = useCallback((e: TouchEvent) => { if (e.touches.length === 1 && touchY.current !== null) { e.preventDefault(); const dy = touchY.current - e.touches[0].clientY; setScrollVel((p) => p + dy * 0.04 * speed); touchY.current = e.touches[0].clientY; lastInt.current = Date.now(); } }, [speed]);
  const handleTouchEnd = useCallback(() => { touchY.current = null; }, []);
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "ArrowUp" || e.key === "ArrowLeft") { setScrollVel((p) => p - 2 * speed); setAutoPlay(false); lastInt.current = Date.now(); } if (e.key === "ArrowDown" || e.key === "ArrowRight") { setScrollVel((p) => p + 2 * speed); setAutoPlay(false); lastInt.current = Date.now(); } }, [speed]);

  useEffect(() => { const el = document.querySelector("canvas"); if (!el) return; el.addEventListener("wheel", handleWheel, { passive: false }); el.addEventListener("touchstart", handleTouchStart, { passive: false }); el.addEventListener("touchmove", handleTouchMove, { passive: false }); el.addEventListener("touchend", handleTouchEnd); document.addEventListener("keydown", handleKey); return () => { el.removeEventListener("wheel", handleWheel); el.removeEventListener("touchstart", handleTouchStart); el.removeEventListener("touchmove", handleTouchMove); el.removeEventListener("touchend", handleTouchEnd); document.removeEventListener("keydown", handleKey); }; }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, handleKey]);

  useEffect(() => { const iv = setInterval(() => { if (Date.now() - lastInt.current > 3000) setAutoPlay(true); }, 1000); return () => clearInterval(iv); }, []);

  useFrame((_state, delta) => { if (autoPlay) setScrollVel((p) => p + 0.3 * delta); setScrollVel((p) => p * 0.95); const t = _state.clock.getElapsedTime(); materials.forEach((m) => { if (m?.uniforms) { m.uniforms.time.value = t; m.uniforms.scrollForce.value = scrollVel; } }); const adv = total > 0 ? visibleCount % total || total : 0; planes.current.forEach((plane, i) => { let nz = plane.z + scrollVel * delta * 10; let wf = 0, wb = 0; if (nz >= DEPTH_RANGE) { wf = Math.floor(nz / DEPTH_RANGE); nz -= DEPTH_RANGE * wf; } else if (nz < 0) { wb = Math.ceil(-nz / DEPTH_RANGE); nz += DEPTH_RANGE * wb; } if (wf > 0 && adv > 0 && total > 0) plane.imageIndex = (plane.imageIndex + wf * adv) % total; if (wb > 0 && adv > 0 && total > 0) plane.imageIndex = ((plane.imageIndex - wb * adv) % total + total) % total; plane.z = ((nz % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE; plane.x = spatial[i]?.x ?? 0; plane.y = spatial[i]?.y ?? 0; const np = plane.z / DEPTH_RANGE; let op = 1, bl = 0; const fi = fadeSettings.fadeIn, fo = fadeSettings.fadeOut; const bi = blurSettings.blurIn, bo = blurSettings.blurOut, mb = blurSettings.maxBlur; if (np >= fi.start && np <= fi.end) op = (np - fi.start) / (fi.end - fi.start); else if (np < fi.start) op = 0; else if (np >= fo.start && np <= fo.end) op = 1 - (np - fo.start) / (fo.end - fo.start); else if (np > fo.end) op = 0; op = Math.max(0, Math.min(1, op)); if (np >= bi.start && np <= bi.end) bl = mb * (1 - (np - bi.start) / (bi.end - bi.start)); else if (np < bi.start) bl = mb; else if (np >= bo.start && np <= bo.end) bl = mb * (np - bo.start) / (bo.end - bo.start); else if (np > bo.end) bl = mb; bl = Math.max(0, Math.min(mb, bl)); const mat = materials[i]; if (mat?.uniforms) { mat.uniforms.opacity.value = op; mat.uniforms.blurAmount.value = bl; } }); });

  if (normalized.length === 0) return null;
  // planes.current is a mutable, per-frame-updated store driven by useFrame
  // (outside React's render loop) rather than React state, by design — this
  // avoids a state update (and full reconciliation) on every animation frame.
  // eslint-disable-next-line react-hooks/refs
  return (<>{planes.current.map((plane, i) => { const tex = textures[plane.imageIndex]; const mat = materials[i]; if (!tex || !mat) return null; const wz = plane.z - DEPTH_RANGE / 2; const asp = tex.image ? tex.image.width / tex.image.height : 1; const sc: [number, number, number] = asp > 1 ? [2 * asp, 2, 1] : [2, 2 / asp, 1]; return <ImagePlane key={plane.index} texture={tex} position={[plane.x, plane.y, wz]} scale={sc} material={mat} onClick={onImageClick ? () => onImageClick(plane.imageIndex) : undefined} />; })}</>);
}

function FallbackGallery({ images }: { images: ImageItem[] }) { const n = useMemo(() => images.map((i) => (typeof i === "string" ? { src: i, alt: "" } : i)), [images]); return (<div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4"><p className="text-gray-600 mb-4">WebGL not available</p><div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">{n.map((img, i) => <img key={i} src={img.src} alt={img.alt} className="w-full h-32 object-cover rounded" />)}</div></div>); }

export default function InfiniteGallery({ images, className = "h-96 w-full", style, fadeSettings = { fadeIn: { start: 0.05, end: 0.2 }, fadeOut: { start: 0.75, end: 0.9 } }, blurSettings = { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.7, end: 0.85 }, maxBlur: 4.0 }, onImageClick }: InfiniteGalleryProps) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    // WebGL support can only be detected client-side, after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const c = document.createElement("canvas"); if (!c.getContext("webgl") && !c.getContext("experimental-webgl")) setOk(false); } catch { setOk(false); }
  }, []);
  if (!ok) return <div className={className} style={style}><FallbackGallery images={images} /></div>;
  return (<div className={className} style={style}><Canvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }}><GalleryScene images={images} fadeSettings={fadeSettings} blurSettings={blurSettings} onImageClick={onImageClick} /></Canvas></div>);
}
