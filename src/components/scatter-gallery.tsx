"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import BackButton from "@/components/back-button";

// ——— Layout constants ———————
const SPREAD_A = 950;
const SPREAD_B = 550;
const N_BODY_ITERS = 140;

// ——— Physics constants ———————
const FRICTION = 0.92;
const EASE = 0.12;
const SCALE_EASE = 0.22;
const ZOOM_STEP = 1.14;

// ——— Camera constants ———————
const PAN_FREE_X = 200;
const PAN_FREE_Y = 200;
const SINGLE_FILL = 0.8;
const FIT_MARGIN = 0.92;
const CLICK_THRESHOLD = 6;
const INITIAL_SCALE = 2.8;

// ——— Seeded PRNG ———————
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// ——— Layout engine ———————
function buildLayout(n: number, seedValue: number) {
  const rng = seeded(seedValue);
  const items: { i: number; depth: number; w: number; h: number; x: number; y: number; r: number; rot: number }[] = [];
  for (let i = 0; i < n; i++) {
    const depth = 0.62 + rng() * 0.78;
    const w = 150 + depth * 140;
    const h = w * (0.66 + rng() * 0.6);
    const ang = rng() * Math.PI * 2;
    const rad = Math.sqrt(rng());
    items.push({
      i, depth, w, h,
      x: Math.cos(ang) * rad * SPREAD_A * 0.92,
      y: Math.sin(ang) * rad * SPREAD_B * 0.92,
      r: (w + h) / 4,
      rot: (rng() - 0.5) * 5,
    });
  }
  for (let iter = 0; iter < N_BODY_ITERS; iter++) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = items[i], b = items[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const min = (a.r + b.r) * 0.9 + 30;
        if (dist < min) {
          const push = (min - dist) / 2;
          const ux = dx / dist, uy = dy / dist;
          a.x -= ux * push; a.y -= uy * push;
          b.x += ux * push; b.y += uy * push;
        }
      }
    }
    for (let i = 0; i < n; i++) {
      const it = items[i];
      const e = (it.x / SPREAD_A) ** 2 + (it.y / SPREAD_B) ** 2;
      if (e > 1) { const k = 1 / Math.sqrt(e); it.x *= k; it.y *= k; }
    }
  }
  return items.sort((a, b) => a.depth - b.depth);
}

function clamp(v: number, min: number, max: number) { return v < min ? min : v > max ? max : v; }

// ——— Props ———————
interface ScatterGalleryProps {
  photos: string[];
  cityName: string;
  backHref: string;
  thumbBase: string;
  lightboxBase: string;
  layoutSeed: number;
}

export default function ScatterGallery({ photos, cityName, backHref, thumbBase, lightboxBase, layoutSeed }: ScatterGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layout = useMemo(() => buildLayout(photos.length, layoutSeed), [photos.length, layoutSeed]);

  const dims = useMemo(() => {
    let maxW = 0, maxH = 0;
    for (const it of layout) { if (it.w > maxW) maxW = it.w; if (it.h > maxH) maxH = it.h; }
    return { maxW, maxH, halfW: SPREAD_A + maxW / 2, halfH: SPREAD_B + maxH / 2 };
  }, [layout]);

  const cam = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const scale = useRef(0.45);
  const scaleTarget = useRef(0.45);
  const minScale = useRef(0.2);
  const maxScale = useRef(1.5);
  const view = useRef({ w: 1200, h: 700 });

  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const focal = useRef({ wx: 0, wy: 0, sx: 0, sy: 0, active: false });

  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(true);
  const [active, setActive] = useState<number | null>(null);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;
    view.current = { w, h };
    const mn = Math.min((w * FIT_MARGIN) / (2 * dims.halfW), (h * FIT_MARGIN) / (2 * dims.halfH));
    let mx = Math.min((w * SINGLE_FILL) / dims.maxW, (h * SINGLE_FILL) / dims.maxH);
    mx = Math.max(mx, mn * 1.4);
    minScale.current = mn * 1.6;
    maxScale.current = mx;
    if (!ready) {
      scale.current = mn * INITIAL_SCALE;
      scaleTarget.current = mn * INITIAL_SCALE;
      cam.current = { x: 0, y: 0 };
      setReady(true);
    } else {
      scaleTarget.current = clamp(scaleTarget.current, minScale.current, mx);
    }
  }, [dims, ready]);

  useEffect(() => {
    // Initial layout measurement requires the container to be mounted first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    measure();
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const zoomAt = useCallback((mx: number, my: number, factor: number) => {
    const s = scale.current;
    const ns = clamp(s * factor, minScale.current, maxScale.current);
    if (ns === s) return;
    focal.current = { wx: cam.current.x + mx / s, wy: cam.current.y + my / s, sx: mx, sy: my, active: true };
    scaleTarget.current = ns;
    vel.current = { x: 0, y: 0 };
    setHint(false);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      zoomAt(mx, my, e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (active !== null) return;
    dragging.current = true; moved.current = false;
    vel.current = { x: 0, y: 0 };
    const p = "touches" in e ? e.touches[0] : e;
    last.current = { x: p.clientX, y: p.clientY };
    setHint(false);
  }, [active]);

  const onMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    const p = "touches" in e ? e.touches[0] : e;
    const dx = p.clientX - last.current.x;
    const dy = p.clientY - last.current.y;
    if (Math.abs(dx) + Math.abs(dy) > CLICK_THRESHOLD) moved.current = true;
    const s = scale.current;
    cam.current.x -= dx / s;
    cam.current.y -= dy / s;
    vel.current = { x: -dx / s, y: -dy / s };
    last.current = { x: p.clientX, y: p.clientY };
  }, []);

  const onUp = useCallback(() => { dragging.current = false; }, []);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      scale.current += (scaleTarget.current - scale.current) * SCALE_EASE;
      const s = scale.current;
      const c = cam.current;
      if (focal.current.active) {
        c.x = focal.current.wx - focal.current.sx / s;
        c.y = focal.current.wy - focal.current.sy / s;
        if (Math.abs(scaleTarget.current - s) < 0.003) focal.current.active = false;
      }
      if (!dragging.current) {
        c.x += vel.current.x; c.y += vel.current.y;
        vel.current.x *= FRICTION; vel.current.y *= FRICTION;
        if (Math.abs(vel.current.x) < 0.02) vel.current.x = 0;
        if (Math.abs(vel.current.y) < 0.02) vel.current.y = 0;
      }
      const limX = PAN_FREE_X + Math.max(0, dims.halfW - view.current.w / 2 / s);
      const limY = PAN_FREE_Y + Math.max(0, dims.halfH - view.current.h / 2 / s);
      const tx = clamp(c.x, -limX, limX), ty = clamp(c.y, -limY, limY);
      if (dragging.current) { c.x = tx; c.y = ty; } else { c.x += (tx - c.x) * EASE; c.y += (ty - c.y) * EASE; }
      for (let k = 0; k < layout.length; k++) {
        const el = tileRefs.current[k];
        if (!el) continue;
        const it = layout[k];
        const sx = (it.x - c.x * it.depth) * s;
        const sy = (it.y - c.y * it.depth) * s;
        el.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${s}) rotate(${it.rot}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [layout, dims]);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [onMove, onUp]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTileClick = useCallback((idx: number) => {
    if (moved.current) return;
    setActive(idx);
  }, []);

  const zoomBtn = (dir: number) => zoomAt(0, 0, dir > 0 ? ZOOM_STEP * ZOOM_STEP : 1 / (ZOOM_STEP * ZOOM_STEP));
  const resetView = () => {
    scaleTarget.current = minScale.current * INITIAL_SCALE;
    cam.current = { x: 0, y: 0 };
    vel.current = { x: 0, y: 0 };
  };

  const activePhoto = active !== null ? photos[active] : null;

  const btnStyle: React.CSSProperties = {
    width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 9, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.8)", cursor: "pointer", backdropFilter: "blur(8px)",
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", width: "100%", height: "100vh", overflow: "hidden",
        background: "radial-gradient(120% 120% at 50% 30%, #14161a 0%, #0a0b0d 60%, #060708 100%)",
        userSelect: "none", opacity: ready ? 1 : 0, transition: "opacity .5s ease",
      }}
      onMouseDown={onDown}
      onTouchStart={onDown}
    >
      <style>{`
        .sg-tile { transition: filter .35s ease, box-shadow .35s ease; cursor: pointer; }
        .sg-tile:hover { filter: brightness(1.14) saturate(1.05); box-shadow: 0 24px 60px rgba(0,0,0,.6) !important; z-index: 50; }
        .sg-zbtn:hover { background: rgba(255,255,255,.14) !important; }
        @keyframes sgLbIn { from { opacity:0; } to { opacity:1; } }
        @keyframes sgLbPop { from { opacity:0; transform: scale(.92); } to { opacity:1; transform: scale(1); } }
      `}</style>

      <div className="fixed top-8 left-8 z-50" style={{ zIndex: 60 }}>
        <BackButton href={backHref} label="返回" />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0 }}>
        {ready && layout.map((it, k) => (
          <div
            key={it.i}
            ref={(el) => { tileRefs.current[k] = el; }}
            className="sg-tile"
            onClick={() => onTileClick(it.i)}
            style={{
              position: "absolute", left: -it.w / 2, top: -it.h / 2, width: it.w, height: it.h,
              borderRadius: 4, overflow: "hidden",
              boxShadow: "0 14px 40px rgba(0,0,0,.45)", opacity: 0.55 + it.depth * 0.35,
            }}
          >
            <img
              src={`${thumbBase}/${photos[it.i]}`}
              alt=""
              draggable={false}
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", top: 36, left: 120, pointerEvents: "none", zIndex: 10 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,.4)", fontFamily: "'Inter',sans-serif" }}>影笺</div>
        <div style={{ fontSize: 30, color: "#f2efe9", marginTop: 6, fontWeight: 500 }}>{cityName}</div>
      </div>
      <div style={{ position: "absolute", bottom: 32, right: 40, fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,.35)", fontFamily: "'Inter',sans-serif", pointerEvents: "none" }}>
        {photos.length} FRAMES
      </div>

      <div style={{ position: "absolute", right: 36, bottom: 72, zIndex: 60, display: "flex", flexDirection: "column", gap: 8 }}
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="sg-zbtn" style={btnStyle} onClick={() => zoomBtn(1)}><Plus size={17} /></div>
        <div className="sg-zbtn" style={btnStyle} onClick={() => zoomBtn(-1)}><Minus size={17} /></div>
        <div className="sg-zbtn" style={btnStyle} onClick={resetView} title="全景"><Maximize2 size={15} /></div>
      </div>

      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        fontSize: 12, letterSpacing: 3, color: "rgba(255,255,255,.55)", fontFamily: "'Inter',sans-serif",
        pointerEvents: "none", opacity: hint ? 1 : 0, transition: "opacity .8s ease" }}>
        滚轮缩放 · 拖拽浏览 · 点击照片看大图
      </div>

      {active !== null && (
        <div onClick={() => setActive(null)} style={{
          position: "absolute", inset: 0, zIndex: 100, background: "rgba(6,7,8,.82)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out", animation: "sgLbIn .3s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            maxWidth: "82vw", maxHeight: "76vh", borderRadius: 6, overflow: "hidden",
            boxShadow: "0 40px 120px rgba(0,0,0,.7)", animation: "sgLbPop .35s cubic-bezier(.2,.8,.2,1)", cursor: "default" }}>
            <img src={`${lightboxBase}/${activePhoto}`} alt=""
              decoding="async"
              style={{ display: "block", maxWidth: "82vw", maxHeight: "76vh", objectFit: "contain" }} />
          </div>
          <div style={{ marginTop: 18, color: "rgba(255,255,255,.7)", fontFamily: "'Inter',sans-serif",
            fontSize: 12, letterSpacing: 3, pointerEvents: "none" }}>
            {active + 1} / {photos.length} · 点击或 ESC 退出
          </div>
        </div>
      )}
    </div>
  );
}
