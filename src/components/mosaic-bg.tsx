"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MosaicBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      float random(in float x) { return fract(sin(x) * 1e4); }
      float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256.0, 256.0);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);
        float t = time * 0.06 + random(uv.x) * 0.4;
        float lineWidth = 0.0008;
        vec3 color = vec3(0.0);
        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 1.0 - length(uv));
          }
        }
        gl_FragColor = vec4(color[2], color[1], color[0], 1.0);
      }
    `;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = { time: { value: 1.0 }, resolution: { value: new THREE.Vector2() } };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false });
    scene.add(new THREE.Mesh(geometry, material));

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const resize = () => { renderer.setSize(window.innerWidth, window.innerHeight); uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height); };
    resize();
    window.addEventListener("resize", resize);
    renderer.render(scene, camera);

    let id: number;
    const animate = () => { id = requestAnimationFrame(animate); uniforms.time.value += 0.05; renderer.render(scene, camera); };
    id = requestAnimationFrame(animate);

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(id); container.removeChild(renderer.domElement); renderer.dispose(); geometry.dispose(); material.dispose(); };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" style={{ background: "#000", overflow: "hidden" }} />;
}
