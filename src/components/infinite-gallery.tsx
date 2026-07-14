"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  className?: string;
  style?: React.CSSProperties;
  onImageClick?: (index: number) => void;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEPTH_RANGE = 50;
const MAX_H_OFFSET = 8;
const MAX_V_OFFSET = 8;

function createClothMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float ci = scrollForce * 0.3;
        float d = length(pos.xy);
        float curve = d * d * ci;
        float r1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float r2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float cloth = (r1 + r2) * abs(ci) * 2.0;
        float fw = 0.0;
        if (isHovered > 0.5) {
          float wp = pos.x * 3.0 + time * 8.0;
          float damp = smoothstep(-0.5, 0.5, pos.x);
          fw = sin(wp) * 0.1 * damp + sin(pos.x * 5.0 + time * 12.0) * 0.03 * damp;
        }
        pos.z -= curve + cloth + fw;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);
        if (blurAmount > 0.0) {
          vec2 ts = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * ts * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
}

function ImagePlane({
  material,
  onClick,
  meshRef,
}: {
  material: THREE.ShaderMaterial;
  onClick?: () => void;
  meshRef: (mesh: THREE.Mesh | null) => void;
}) {
  return (
    <mesh
      ref={meshRef}
      material={material}
      onPointerEnter={() => {
        // Three.js uniforms are intentionally updated outside React state.
        // eslint-disable-next-line react-hooks/immutability
        material.uniforms.isHovered.value = 1.0;
      }}
      onPointerLeave={() => {
        // eslint-disable-next-line react-hooks/immutability
        material.uniforms.isHovered.value = 0.0;
      }}
      onClick={onClick}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  fadeSettings = { fadeIn: { start: 0.05, end: 0.15 }, fadeOut: { start: 0.85, end: 0.95 } },
  blurSettings = { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.9, end: 1.0 }, maxBlur: 3.0 },
  onImageClick,
}: Omit<InfiniteGalleryProps, "className" | "style">) {
  const { gl } = useThree();
  const scrollVelocity = useRef(0);
  const autoPlay = useRef(true);
  const lastInteraction = useRef(0);
  const touchY = useRef<number | null>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const normalized = useMemo(
    () => images.map((image) => (typeof image === "string" ? { src: image, alt: "" } : image)),
    [images],
  );
  const textures = useTexture(normalized.map((image) => image.src));
  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount],
  );
  const spatial = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    for (let index = 0; index < visibleCount; index++) {
      const horizontalAngle = (index * 2.618) % (Math.PI * 2);
      const verticalAngle = (index * 1.618 + Math.PI / 3) % (Math.PI * 2);
      positions.push({
        x: (Math.sin(horizontalAngle) * ((index % 3) * 1.2) * MAX_H_OFFSET) / 3,
        y: (Math.cos(verticalAngle) * (((index + 1) % 4) * 0.8) * MAX_V_OFFSET) / 4,
      });
    }
    return positions;
  }, [visibleCount]);

  const total = normalized.length;
  const planes = useRef<PlaneData[]>([]);

  useEffect(() => {
    planes.current = Array.from({ length: visibleCount }, (_, index) => ({
      index,
      z: visibleCount > 0 ? ((DEPTH_RANGE / visibleCount) * index) % DEPTH_RANGE : 0,
      imageIndex: total > 0 ? index % total : 0,
      x: spatial[index]?.x ?? 0,
      y: spatial[index]?.y ?? 0,
    }));
    meshRefs.current = [];
  }, [spatial, total, visibleCount]);

  useEffect(() => {
    return () => {
      materials.forEach((material) => material.dispose());
    };
  }, [materials]);

  useEffect(() => {
    lastInteraction.current = Date.now();
  }, []);

  const pauseAutoPlay = useCallback(() => {
    autoPlay.current = false;
    lastInteraction.current = Date.now();
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      scrollVelocity.current += event.deltaY * 0.01 * speed;
      pauseAutoPlay();
    },
    [pauseAutoPlay, speed],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchY.current = event.touches[0].clientY;
        pauseAutoPlay();
      }
    },
    [pauseAutoPlay],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 1 && touchY.current !== null) {
        event.preventDefault();
        const deltaY = touchY.current - event.touches[0].clientY;
        scrollVelocity.current += deltaY * 0.04 * speed;
        touchY.current = event.touches[0].clientY;
        lastInteraction.current = Date.now();
      }
    },
    [speed],
  );

  const handleTouchEnd = useCallback(() => {
    touchY.current = null;
  }, []);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        scrollVelocity.current -= 2 * speed;
        pauseAutoPlay();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        scrollVelocity.current += 2 * speed;
        pauseAutoPlay();
      }
    },
    [pauseAutoPlay, speed],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("keydown", handleKey);
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("keydown", handleKey);
    };
  }, [gl, handleKey, handleTouchEnd, handleTouchMove, handleTouchStart, handleWheel]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) autoPlay.current = true;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (autoPlay.current) scrollVelocity.current += 0.3 * delta;
    scrollVelocity.current *= 0.95;

    const advance = total > 0 ? visibleCount % total || total : 0;
    const time = state.clock.getElapsedTime();

    planes.current.forEach((plane, index) => {
      let nextZ = plane.z + scrollVelocity.current * delta * 10;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (nextZ >= DEPTH_RANGE) {
        wrapsForward = Math.floor(nextZ / DEPTH_RANGE);
        nextZ -= DEPTH_RANGE * wrapsForward;
      } else if (nextZ < 0) {
        wrapsBackward = Math.ceil(-nextZ / DEPTH_RANGE);
        nextZ += DEPTH_RANGE * wrapsBackward;
      }

      if (wrapsForward > 0 && advance > 0 && total > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * advance) % total;
      }
      if (wrapsBackward > 0 && advance > 0 && total > 0) {
        plane.imageIndex = ((plane.imageIndex - wrapsBackward * advance) % total + total) % total;
      }

      plane.z = ((nextZ % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE;
      plane.x = spatial[index]?.x ?? 0;
      plane.y = spatial[index]?.y ?? 0;

      const normalizedDepth = plane.z / DEPTH_RANGE;
      const fadeIn = fadeSettings.fadeIn;
      const fadeOut = fadeSettings.fadeOut;
      const blurIn = blurSettings.blurIn;
      const blurOut = blurSettings.blurOut;
      const maxBlur = blurSettings.maxBlur;
      let opacity = 1;
      let blur = 0;

      if (normalizedDepth >= fadeIn.start && normalizedDepth <= fadeIn.end) {
        opacity = (normalizedDepth - fadeIn.start) / (fadeIn.end - fadeIn.start);
      } else if (normalizedDepth < fadeIn.start) {
        opacity = 0;
      } else if (normalizedDepth >= fadeOut.start && normalizedDepth <= fadeOut.end) {
        opacity = 1 - (normalizedDepth - fadeOut.start) / (fadeOut.end - fadeOut.start);
      } else if (normalizedDepth > fadeOut.end) {
        opacity = 0;
      }

      if (normalizedDepth >= blurIn.start && normalizedDepth <= blurIn.end) {
        blur = maxBlur * (1 - (normalizedDepth - blurIn.start) / (blurIn.end - blurIn.start));
      } else if (normalizedDepth < blurIn.start) {
        blur = maxBlur;
      } else if (normalizedDepth >= blurOut.start && normalizedDepth <= blurOut.end) {
        blur = maxBlur * (normalizedDepth - blurOut.start) / (blurOut.end - blurOut.start);
      } else if (normalizedDepth > blurOut.end) {
        blur = maxBlur;
      }

      const material = materials[index];
      const texture = textures[plane.imageIndex];
      if (material?.uniforms) {
        material.uniforms.map.value = texture;
        material.uniforms.opacity.value = Math.max(0, Math.min(1, opacity));
        material.uniforms.blurAmount.value = Math.max(0, Math.min(maxBlur, blur));
        material.uniforms.scrollForce.value = scrollVelocity.current;
        material.uniforms.time.value = time;
      }

      const mesh = meshRefs.current[index];
      if (mesh && texture) {
        const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
        mesh.position.set(plane.x, plane.y, plane.z - DEPTH_RANGE / 2);
        mesh.scale.set(
          aspectRatio > 1 ? 2 * aspectRatio : 2,
          aspectRatio > 1 ? 2 : 2 / aspectRatio,
          1,
        );
      }
    });
  });

  if (normalized.length === 0) return null;

  return (
    <>
      {Array.from({ length: visibleCount }, (_, index) => {
        const material = materials[index];
        if (!material) return null;
        return (
          <ImagePlane
            key={index}
            material={material}
            meshRef={(mesh) => {
              meshRefs.current[index] = mesh;
            }}
            onClick={onImageClick ? () => onImageClick(planes.current[index]?.imageIndex ?? index) : undefined}
          />
        );
      })}
    </>
  );
}

function FallbackGallery({
  images,
  onImageClick,
}: {
  images: ImageItem[];
  onImageClick?: (index: number) => void;
}) {
  const normalized = useMemo(
    () => images.map((image) => (typeof image === "string" ? { src: image, alt: "" } : image)),
    [images],
  );

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-100 p-4">
      <p className="mb-4 text-gray-600">WebGL not available</p>
      <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
        {normalized.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className="overflow-hidden rounded"
            onClick={() => onImageClick?.(index)}
          >
            <img src={image.src} alt={image.alt} className="h-32 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function InfiniteGallery({
  images,
  className = "h-96 w-full",
  style,
  fadeSettings = { fadeIn: { start: 0.05, end: 0.2 }, fadeOut: { start: 0.75, end: 0.9 } },
  blurSettings = { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.7, end: 0.85 }, maxBlur: 4.0 },
  onImageClick,
}: InfiniteGalleryProps) {
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      if (!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")) {
        // WebGL availability can only be determined after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWebglAvailable(false);
      }
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  if (!webglAvailable) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} onImageClick={onImageClick} />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 0], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <GalleryScene
          images={images}
          fadeSettings={fadeSettings}
          blurSettings={blurSettings}
          onImageClick={onImageClick}
        />
      </Canvas>
    </div>
  );
}
